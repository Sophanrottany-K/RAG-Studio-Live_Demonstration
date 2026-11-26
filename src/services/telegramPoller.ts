// Runs the connected Telegram bots while the app is open (mock API only).
//
// The in-browser mock has no public URL for a webhook, so one tab long-polls getUpdates for every
// connected bot and answers with the same knowledge-base logic as the Playground. A Web Lock makes
// sure only one tab polls at a time (Telegram rejects concurrent getUpdates with 409); when that tab
// closes, another open tab takes over. With no RAG Studio tab open, the bots don't answer.
import { setTelegramOffset, telegramBotTokens, telegramReply } from "./mockServer";
import { TelegramError, telegramCall, type TelegramUpdate } from "./telegram";

const LOCK = "rag-studio-telegram-poller";
const TYPING_REFRESH_MS = 4000;
const RECONCILE_MS = 3000;
const LONG_POLL_SECONDS = 25;

const sleep = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve) => {
    const t = setTimeout(resolve, ms);
    signal.addEventListener("abort", () => {
      clearTimeout(t);
      resolve();
    });
  });

/** Per chat, the answer still being sent, so a quick follow-up question is answered after it. */
const chatQueues = new Map<string, Promise<unknown>>();

function answer(chatbotId: string, token: string, chatId: number, messageId: number, question: string) {
  const key = `${chatbotId}:${chatId}`;
  const run = async () => {
    // Telegram shows "typing…" (the three dots) for about 5 s per call, or until the bot sends a message,
    // so repeat it while the answer is being produced.
    const typing = () => telegramCall(token, "sendChatAction", { chat_id: chatId, action: "typing" }).catch(() => {});
    typing();
    const keepTyping = setInterval(typing, TYPING_REFRESH_MS);
    let text: string;
    try {
      // A short "thinking" pause, so the dots are visible even when the answer is found instantly.
      [text] = await Promise.all([telegramReply(chatbotId, chatId, question), sleepFor(1500 + Math.random() * 1000)]);
    } catch {
      text = "Sorry, I couldn't answer that just now. Please try again.";
    } finally {
      clearInterval(keepTyping);
    }
    await telegramCall(token, "sendMessage", {
      chat_id: chatId,
      text: text.slice(0, 4096),
      reply_to_message_id: messageId,
      allow_sending_without_reply: true,
    }).catch((e) => console.warn("[telegram] sending the answer failed:", e));
  };
  const next = (chatQueues.get(key) ?? Promise.resolve()).then(run);
  chatQueues.set(key, next);
  next.finally(() => chatQueues.get(key) === next && chatQueues.delete(key));
}

const sleepFor = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function pollBot(chatbotId: string, token: string, startOffset: number, signal: AbortSignal) {
  let offset = startOffset;
  let failures = 0;
  while (!signal.aborted) {
    try {
      const updates = await telegramCall<TelegramUpdate[]>(
        token,
        "getUpdates",
        { offset, timeout: LONG_POLL_SECONDS, allowed_updates: JSON.stringify(["message"]) },
        signal,
      );
      failures = 0;
      for (const update of updates) {
        offset = update.update_id + 1;
        setTelegramOffset(chatbotId, offset);
        const message = update.message;
        if (!message?.text || signal.aborted) continue;
        // Not awaited, so one long answer doesn't hold up other chats; each chat's answers stay in order.
        answer(chatbotId, token, message.chat.id, message.message_id, message.text);
      }
    } catch (e) {
      if (signal.aborted) return;
      // 401/404: the token was revoked. 409: a webhook or another poller owns this bot. Back off and retry.
      failures++;
      if (e instanceof TelegramError && failures === 1) console.warn(`[telegram] ${chatbotId}: ${e.message}`);
      await sleep(Math.min(30000, 1000 * 2 ** Math.min(failures, 5)), signal);
    }
  }
}

function runPoller(signal: AbortSignal) {
  const running = new Map<string, { token: string; controller: AbortController }>();
  const reconcile = () => {
    const bots = telegramBotTokens();
    const wanted = new Map(bots.map((b) => [b.chatbotId, b.token]));
    for (const [chatbotId, bot] of running)
      if (wanted.get(chatbotId) !== bot.token) {
        bot.controller.abort();
        running.delete(chatbotId);
      }
    for (const [chatbotId, token] of wanted)
      if (!running.has(chatbotId)) {
        const controller = new AbortController();
        running.set(chatbotId, { token, controller });
        pollBot(chatbotId, token, bots.find((b) => b.chatbotId === chatbotId)!.offset, controller.signal);
      }
  };
  return new Promise<void>((resolve) => {
    reconcile();
    const timer = setInterval(reconcile, RECONCILE_MS);
    signal.addEventListener("abort", () => {
      clearInterval(timer);
      for (const bot of running.values()) bot.controller.abort();
      resolve();
    });
  });
}

let started = false;

/** Starts polling in this tab, or waits to take over if another tab is already polling. */
export function startTelegramPoller() {
  if (started || typeof window === "undefined") return;
  started = true;
  const forever = new AbortController();
  if (navigator.locks) navigator.locks.request(LOCK, () => runPoller(forever.signal));
  else runPoller(forever.signal);
}
