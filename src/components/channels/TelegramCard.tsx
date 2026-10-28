import { useState } from "react";
import { api } from "../../services/api";
import { isTelegramToken } from "../../services/limits";
import type { ChatbotChannels, TelegramChannel } from "../../services/types";
import { ConfirmDialog } from "../create/ConfirmDialog";
import { HowToConnect } from "../shared/HowToConnect";
import { Banner, Button, Field, TextInput } from "../create/ui";
import { ChannelCard, SubTitle, formatDateTime, splitError } from "./parts";

export function TelegramCard({
  chatbotId,
  telegram,
  onSaved,
  chatbotPaused = false,
}: {
  chatbotId: string;
  telegram: TelegramChannel;
  onSaved: (c: ChatbotChannels) => void;
  chatbotPaused?: boolean;
}) {
  const [token, setToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [busy, setBusy] = useState<null | "connect" | "disconnect">(null);
  const [error, setError] = useState<{ field: string | null; message: string } | null>(null);
  const [confirmDisconnect, setConfirmDisconnect] = useState(false);

  const connect = async () => {
    if (!token.trim()) return setError({ field: "token", message: "Paste the bot token from @BotFather." });
    if (!isTelegramToken(token))
      return setError({
        field: "token",
        message: "This doesn't look like a bot token. It should look like 123456789:AAH…",
      });
    setBusy("connect");
    setError(null);
    try {
      onSaved(await api.connectTelegram(chatbotId, token.trim()));
      setToken("");
      setShowToken(false);
    } catch (e) {
      setError(splitError(e, ["token"]));
    } finally {
      setBusy(null);
    }
  };

  const disconnect = async () => {
    setConfirmDisconnect(false);
    setBusy("disconnect");
    setError(null);
    try {
      onSaved(await api.disconnectTelegram(chatbotId));
    } catch (e) {
      setError(splitError(e, []));
    } finally {
      setBusy(null);
    }
  };

  const subtitle = telegram.connected
    ? `${telegram.botUsername} · Connected ${formatDateTime(telegram.connectedAt)}`
    : "Answer questions inside a Telegram bot";

  return (
    <ChannelCard
      icon="icons/channel-icon-3.svg"
      title="Telegram Bot"
      subtitle={subtitle}
      state={!telegram.connected ? "off" : chatbotPaused ? "chatbotPaused" : "connected"}
    >
      {telegram.connected ? (
        <div className="self-stretch flex flex-col items-start gap-4">
          <SubTitle>Connection</SubTitle>
          <div className="self-stretch bg-[#E7F6EC] border border-[#B7E2C8] rounded-[12px] px-4 py-3.5 flex items-center gap-4">
            <span className="w-2 h-2 shrink-0 rounded-full bg-[#1A7F37]" />
            <div className="flex-1 min-w-0 flex flex-col gap-0.5">
              <div className="font-gabarito font-bold text-[15px] text-[#1A7F37]">{telegram.botUsername} is live</div>
              <div className="font-gabarito text-[13px] text-ink-secondary">
                Token <span className="font-roboto-mono">••••••••{telegram.tokenHint}</span> · Webhook set automatically
                · {telegram.messagesThisWeek} messages this week
              </div>
            </div>
            <Button variant="secondary" loading={busy === "disconnect"} onClick={() => setConfirmDisconnect(true)}>
              Disconnect
            </Button>
          </div>
          <div className="font-gabarito text-[13px] text-ink-secondary">
            To use a different bot, disconnect first and paste the new token.
          </div>
          {error && <Banner tone="danger">{error.message}</Banner>}
        </div>
      ) : (
        <div className="self-stretch flex items-start gap-6">
          <form
            className="flex-1 min-w-0 flex flex-col items-start gap-4"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              connect();
            }}
          >
            <SubTitle>Bot token</SubTitle>
            <Field
              label="Telegram bot token"
              htmlFor="telegram-token"
              error={error?.field === "token" ? error.message : null}
              hint="We store the token encrypted and only show its last 4 characters."
            >
              <div className="self-stretch flex items-start gap-2.5">
                <TextInput
                  id="telegram-token"
                  type={showToken ? "text" : "password"}
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="123456789:AAH…"
                  value={token}
                  invalid={error?.field === "token"}
                  className="flex-1 min-w-0 font-roboto-mono text-[13px]"
                  onChange={(e) => {
                    setToken(e.target.value);
                    if (error) setError(null);
                  }}
                />
                <Button onClick={() => setShowToken((s) => !s)} aria-pressed={showToken}>
                  {showToken ? "Hide" : "Show"}
                </Button>
              </div>
            </Field>
            {error && !error.field && <Banner tone="danger">{error.message}</Banner>}
            <Button type="submit" variant="primary" loading={busy === "connect"} disabled={!token.trim()}>
              {busy === "connect" ? "Connecting…" : "Connect bot"}
            </Button>
          </form>
          <HowToConnect />
        </div>
      )}
      <ConfirmDialog
        open={confirmDisconnect}
        title={`Disconnect ${telegram.botUsername ?? "the bot"}?`}
        confirmLabel="Disconnect"
        cancelLabel="Cancel"
        danger
        onCancel={() => setConfirmDisconnect(false)}
        onConfirm={disconnect}
      >
        The bot stops answering in Telegram right away. You can reconnect it later with the same token.
      </ConfirmDialog>
    </ChannelCard>
  );
}
