// Analytics for the in-browser mock server (GET /analytics, GET /analytics/unanswered).
// Real activity comes from the chat log the mock server keeps (every playground and public-link
// question is recorded). The two built-in demo chatbots also get a steady, deterministic history
// of synthetic traffic — messages, guest ratings, unanswered questions and reported answers — so
// the dashboard has a year of data to show on a fresh install.
import type {
  Analytics,
  AnalyticsChannel,
  AnalyticsGranularity,
  AnalyticsPoint,
  Chatbot,
  GuestChannel,
  ReportedAnswer,
  UnansweredEntry,
} from "./types";

/** One question asked of a chatbot, as logged by the mock server. */
export type ChatEvent = {
  chatbotId: string;
  channel: AnalyticsChannel;
  /** Who asked: "owner" in the playground, or a per-browser guest id on public channels. */
  visitor: string;
  at: number;
  question: string;
  answered: boolean;
  sources: number;
  /** The bot's reply (trimmed); older log entries don't have it. */
  reply?: string;
};

const CHANNELS: AnalyticsChannel[] = ["public-link", "widget", "telegram", "playground"];
const GUEST_CHANNELS: GuestChannel[] = ["public-link", "widget", "telegram"];
const DAY = 24 * 60 * 60 * 1000;
const SESSION_GAP = 30 * 60 * 1000;
const LIVE_WINDOW = 10 * 60 * 1000;
const HISTORY_DAYS = 400;
const STORAGE_LIMIT = 5 * 1024 ** 3;
const URL_DOC_BYTES = 120 * 1024;
const CHATBOT_LIMIT = 5;
/** Share of answers a guest rates. */
const RATED_SHARE = 0.12;
const NOT_FOUND_REPLY = "Sorry, I couldn't find that in my knowledge base.";

type DemoReport = Omit<ReportedAnswer, "id" | "chatbotId" | "reportedAt"> & { daysAgo: number };

/** Synthetic traffic profile of the built-in demo chatbots. */
const DEMO_TRAFFIC: Record<string, { perDay: number; unanswered: string[]; reports: DemoReport[] }> = {
  demo_billing: {
    perDay: 640,
    unanswered: [
      "Can I pay with cryptocurrency?",
      "Do you offer a student discount?",
      "Why was I charged twice this month?",
      "Can I transfer my plan to another account?",
      "Is there a lifetime plan?",
      "Do you accept bank transfers from Cambodia?",
      "Can I get an invoice in Khmer?",
      "How do I add a second card as backup?",
    ],
    reports: [
      {
        question: "What is the refund window for annual plans?",
        botAnswer: "Annual plans can be refunded within 14 days of purchase when you contact support.",
        comment: "Our policy says 30 days.",
        reason: "inaccurate",
        channel: "public-link",
        status: "open",
        daysAgo: 1,
      },
      {
        question: "How do I reset my password?",
        botAnswer: "Open Settings → Security and choose Reset password; a link is sent to your email.",
        comment: "There is no Security page in the new app.",
        reason: "inaccurate",
        channel: "telegram",
        status: "open",
        daysAgo: 2,
      },
      {
        question: "Can I pay with cryptocurrency?",
        botAnswer: NOT_FOUND_REPLY,
        comment: "I wanted to know the payment options.",
        reason: "unhelpful",
        channel: "widget",
        status: "open",
        daysAgo: 3,
      },
      {
        question: "Which plans include priority support?",
        botAnswer: "Priority support is included in the Business plan.",
        comment: "Pro has it too.",
        reason: "inaccurate",
        channel: "widget",
        status: "resolved",
        daysAgo: 6,
      },
      {
        question: "When will I be charged after the trial?",
        botAnswer: "At the end of the trial.",
        comment: "Too short.",
        reason: "unhelpful",
        channel: "telegram",
        status: "dismissed",
        daysAgo: 9,
      },
    ],
  },
  demo_hr: {
    perDay: 420,
    unanswered: [
      "Can I carry over unused sick leave?",
      "Who approves overtime on weekends?",
      "Is there a gym membership benefit?",
      "How do I change my bank account for payroll?",
      "Can I work remotely from another country?",
      "Do interns get public holidays off?",
      "How do I claim my phone bill?",
    ],
    reports: [
      {
        question: "Can I work from home on Fridays?",
        botAnswer: "Remote work needs approval from HR for each day.",
        comment: "The remote work policy allows two days a week.",
        reason: "inaccurate",
        channel: "widget",
        status: "open",
        daysAgo: 0,
      },
      {
        question: "How many days of annual leave do I get?",
        botAnswer: "Full-time staff get 12 days of annual leave per year.",
        comment: "It is 18 days after the 2025 policy update.",
        reason: "inaccurate",
        channel: "public-link",
        status: "resolved",
        daysAgo: 4,
      },
      {
        question: "Who approves overtime?",
        botAnswer: "Overtime is approved by your direct manager in the HR portal.",
        comment: "Too short.",
        reason: "unhelpful",
        channel: "telegram",
        status: "dismissed",
        daysAgo: 5,
      },
    ],
  },
};
const CHANNEL_SHARE: Record<AnalyticsChannel, number> = {
  "public-link": 0.43,
  widget: 0.29,
  telegram: 0.18,
  playground: 0.1,
};

/** Small deterministic PRNG: the same seed always gives the same numbers. */
function random(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), h | 1);
    h ^= h + Math.imul(h ^ (h >>> 7), h | 61);
    return ((h ^ (h >>> 14)) >>> 0) / 4294967296;
  };
}

const startOfDay = (t: number) => {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};
const addDays = (t: number, n: number) => {
  const d = new Date(t);
  d.setDate(d.getDate() + n);
  return d.getTime();
};
const addMonths = (t: number, n: number) => {
  const d = new Date(t);
  d.setMonth(d.getMonth() + n, 1);
  return d.getTime();
};
const startOfWeek = (t: number) => {
  const d = new Date(startOfDay(t));
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); // Monday
  return d.getTime();
};
const startOfMonth = (t: number) => {
  const d = new Date(startOfDay(t));
  d.setDate(1);
  return d.getTime();
};

/** Aggregated activity of one chatbot on one channel over some span of time, starting at `at`. */
type Activity = {
  chatbotId: string;
  channel: AnalyticsChannel;
  at: number;
  messages: number;
  sessions: number;
  answered: number;
  helpful: number;
  notHelpful: number;
};

function syntheticActivity(bot: Chatbot, now: number): Activity[] {
  const profile = DEMO_TRAFFIC[bot.id];
  if (!profile) return [];
  const out: Activity[] = [];
  const today = startOfDay(now);
  for (let i = HISTORY_DAYS; i >= 0; i--) {
    const day = addDays(today, -i);
    const rnd = random(`${bot.id}:${day}`);
    const weekday = new Date(day).getDay();
    const weekend = weekday === 0 || weekday === 6 ? 0.62 : 1;
    const growth = 0.7 + 0.3 * ((HISTORY_DAYS - i) / HISTORY_DAYS); // traffic grows over the year
    const elapsed = i === 0 ? (now - day) / DAY : 1; // today is still in progress
    const total = profile.perDay * weekend * growth * (0.85 + rnd() * 0.3) * elapsed;
    const answerRate = 0.925 + rnd() * 0.035;
    const helpfulRate = 0.86 + rnd() * 0.08;
    for (const channel of CHANNELS) {
      const messages = Math.round(total * CHANNEL_SHARE[channel] * (0.9 + rnd() * 0.2));
      if (!messages) continue;
      const answered = Math.round(messages * answerRate);
      // Only guests rate answers; the owner testing in the Playground doesn't.
      const rated = channel === "playground" ? 0 : Math.round(answered * RATED_SHARE);
      const helpful = Math.round(rated * helpfulRate);
      out.push({
        chatbotId: bot.id,
        channel,
        at: day,
        messages,
        sessions: Math.max(1, Math.round(messages / (3.5 + rnd() * 0.8))),
        answered,
        helpful,
        notHelpful: rated - helpful,
      });
    }
  }
  return out;
}

/** Turns the chat log into activity; a session is a visitor's run of questions with no 30-minute gap. */
function loggedActivity(events: ChatEvent[]): Activity[] {
  const lastSeen = new Map<string, number>();
  return [...events]
    .sort((a, b) => a.at - b.at)
    .map((e) => {
      const key = `${e.chatbotId}|${e.channel}|${e.visitor}`;
      const newSession = e.at - (lastSeen.get(key) ?? -Infinity) > SESSION_GAP;
      lastSeen.set(key, e.at);
      return {
        chatbotId: e.chatbotId,
        channel: e.channel,
        at: e.at,
        messages: 1,
        sessions: newSession ? 1 : 0,
        answered: e.answered ? 1 : 0,
        helpful: 0,
        notHelpful: 0,
      };
    });
}

/** The demo bots' unanswered questions: a handful a day from their recurring gaps. */
function syntheticUnanswered(bot: Chatbot, now: number, days: number): UnansweredEntry[] {
  const profile = DEMO_TRAFFIC[bot.id];
  if (!profile) return [];
  const out: UnansweredEntry[] = [];
  const today = startOfDay(now);
  for (let i = 0; i < days; i++) {
    const day = addDays(today, -i);
    const rnd = random(`${bot.id}:gaps:${day}`);
    const count = 4 + Math.floor(rnd() * 6);
    for (let n = 0; n < count; n++) {
      // Questions earlier in the list come up more often.
      const pick = Math.floor(rnd() ** 1.6 * profile.unanswered.length);
      const channel = GUEST_CHANNELS[Math.floor(rnd() * GUEST_CHANNELS.length)];
      const at = day + Math.floor(rnd() * DAY);
      if (at > now) continue;
      out.push({
        id: `${bot.id}-${day}-${n}`,
        chatbotId: bot.id,
        question: profile.unanswered[pick],
        lastReply: NOT_FOUND_REPLY,
        channel,
        askedAt: new Date(at).toISOString(),
      });
    }
  }
  return out;
}

/** Every unanswered question in the last `days` days (today included), newest first. */
export function computeUnanswered(
  allBots: Chatbot[],
  events: ChatEvent[],
  chatbotId: string | null,
  days: number,
  now = Date.now(),
): UnansweredEntry[] {
  const bots = chatbotId ? allBots.filter((b) => b.id === chatbotId) : allBots;
  const ids = new Set(bots.map((b) => b.id));
  const from = addDays(startOfDay(now), -(days - 1));
  const logged: UnansweredEntry[] = events
    .filter((e) => ids.has(e.chatbotId) && !e.answered && e.at >= from && e.question.trim())
    .map((e) => ({
      id: `log-${e.at}-${e.chatbotId}`,
      chatbotId: e.chatbotId,
      question: e.question.trim(),
      lastReply: e.reply ?? NOT_FOUND_REPLY,
      channel: e.channel,
      askedAt: new Date(e.at).toISOString(),
    }));
  return [...bots.flatMap((b) => syntheticUnanswered(b, now, days)), ...logged].sort((a, b) =>
    b.askedAt.localeCompare(a.askedAt),
  );
}

/** Bucket starts for the trend, oldest first, plus the label of the whole period. */
function buckets(granularity: AnalyticsGranularity, now: number, days: number) {
  if (granularity === "weekly") {
    const last = startOfWeek(now);
    return {
      starts: Array.from({ length: 8 }, (_, i) => addDays(last, (i - 7) * 7)),
      step: (t: number) => addDays(t, 7),
      label: "last 8 weeks",
    };
  }
  if (granularity === "monthly") {
    const last = startOfMonth(now);
    return {
      starts: Array.from({ length: 6 }, (_, i) => addMonths(last, i - 5)),
      step: (t: number) => addMonths(t, 1),
      label: "last 6 months",
    };
  }
  const last = startOfDay(now);
  return {
    starts: Array.from({ length: days }, (_, i) => addDays(last, i - days + 1)),
    step: (t: number) => addDays(t, 1),
    label: `last ${days} days`,
  };
}

const sum = (rows: Activity[], key: "messages" | "sessions" | "answered" | "helpful" | "notHelpful") =>
  rows.reduce((n, r) => n + r[key], 0);

const docBytes = (bot: Chatbot) => bot.documents.reduce((n, d) => n + (d.sizeBytes ?? URL_DOC_BYTES), 0);
/** Embeddings + text chunks: roughly a third of the original files. */
const indexBytes = (storage: number) => Math.round(storage * 0.3);

export function computeAnalytics(
  allBots: Chatbot[],
  events: ChatEvent[],
  granularity: AnalyticsGranularity,
  chatbotId: string | null,
  now = Date.now(),
  /** Length of the daily trend; weekly and monthly ignore it. */
  days = 14,
): Analytics {
  const allActivity = [...allBots.flatMap((b) => syntheticActivity(b, now)), ...loggedActivity(events)];
  const bots = chatbotId ? allBots.filter((b) => b.id === chatbotId) : allBots;
  const ids = new Set(bots.map((b) => b.id));
  const scopedEvents = events.filter((e) => ids.has(e.chatbotId));
  const activity = allActivity.filter((a) => ids.has(a.chatbotId));

  const { starts, step, label } = buckets(granularity, now, days);
  const from = starts[0];
  const prevFrom = from - (now - from);
  const inPeriod = activity.filter((a) => a.at >= from && a.at <= now);
  const inPrevious = activity.filter((a) => a.at >= prevFrom && a.at < from);

  const trend: AnalyticsPoint[] = starts.map((start) => {
    const rows = inPeriod.filter((a) => a.at >= start && a.at < step(start));
    return {
      start: new Date(start).toISOString(),
      messages: sum(rows, "messages"),
      sessions: sum(rows, "sessions"),
      answered: sum(rows, "answered"),
    };
  });

  const messages = sum(inPeriod, "messages");
  const answered = sum(inPeriod, "answered");
  const prevMessages = sum(inPrevious, "messages");

  // Live: real visitors seen in the last 10 minutes, plus a steady crowd on the active demo bots.
  const recent = new Set(
    scopedEvents.filter((e) => now - e.at < LIVE_WINDOW).map((e) => `${e.chatbotId}|${e.channel}|${e.visitor}`),
  );
  const hour = new Date(now).getHours();
  const daytime = hour >= 8 && hour < 20 ? 1 : 0.35;
  const syntheticLive = bots
    .filter((b) => DEMO_TRAFFIC[b.id] && b.status === "active")
    .reduce((n, b) => n + Math.round((5 + random(`${b.id}:${Math.floor(now / 300_000)}`)() * 9) * daytime), 0);

  // Unanswered questions in the period, grouped by question.
  const periodDays = Math.round((startOfDay(now) - from) / DAY) + 1;
  const unanswered = computeUnanswered(allBots, events, chatbotId, periodDays, now);
  const counts = new Map<string, { question: string; chatbotId: string; count: number }>();
  for (const q of unanswered) {
    const key = `${q.chatbotId}|${q.question.toLowerCase()}`;
    const entry = counts.get(key) ?? { question: q.question, chatbotId: q.chatbotId, count: 0 };
    entry.count += 1;
    counts.set(key, entry);
  }

  const reports: ReportedAnswer[] = bots
    .flatMap((b) =>
      (DEMO_TRAFFIC[b.id]?.reports ?? []).map(({ daysAgo, ...r }, i) => ({
        ...r,
        id: `${b.id}-report-${i}`,
        chatbotId: b.id,
        reportedAt: new Date(addDays(startOfDay(now), -daysAgo) + 10 * 60 * 60 * 1000).toISOString(),
      })),
    )
    .sort((a, b) => b.reportedAt.localeCompare(a.reportedAt));

  const storageBytes = bots.reduce((n, b) => n + docBytes(b), 0);
  const documents = bots.reduce((n, b) => n + b.documents.length, 0);

  return {
    generatedAt: new Date(now).toISOString(),
    granularity,
    periodLabel: label,
    chatbotCount: bots.length,
    totals: {
      messages,
      answered,
      unanswered: messages - answered,
      sessions: sum(inPeriod, "sessions"),
      guests: sum(
        inPeriod.filter((a) => a.channel !== "playground"),
        "sessions",
      ),
      messagesChangePct: prevMessages ? ((messages - prevMessages) / prevMessages) * 100 : null,
    },
    activeSessions: recent.size + syntheticLive,
    knowledge: {
      documents,
      readyDocuments: bots.reduce((n, b) => n + b.documents.filter((d) => d.status === "ready").length, 0),
      storageBytes,
      storageLimitBytes: STORAGE_LIMIT,
      indexBytes: indexBytes(storageBytes),
    },
    trend,
    channels: CHANNELS.map((channel) => {
      const rows = inPeriod.filter((a) => a.channel === channel);
      return { channel, messages: sum(rows, "messages"), sessions: sum(rows, "sessions") };
    }),
    feedback: { helpful: sum(inPeriod, "helpful"), notHelpful: sum(inPeriod, "notHelpful") },
    unanswered: {
      total: unanswered.length,
      top: [...counts.values()].sort((a, b) => b.count - a.count).slice(0, 5),
    },
    reports,
    // Usage is account-wide (like the plan it's measured against), whatever chatbot is selected.
    usage: {
      chatbots: allBots.length,
      chatbotLimit: CHATBOT_LIMIT,
      perChatbot: allBots.map((b) => {
        const storage = docBytes(b);
        return {
          chatbotId: b.id,
          name: b.name,
          status: b.status,
          messages: sum(
            allActivity.filter((a) => a.chatbotId === b.id && a.at >= from && a.at <= now),
            "messages",
          ),
          documents: b.documents.length,
          storageBytes: storage,
          indexBytes: indexBytes(storage),
        };
      }),
    },
  };
}
