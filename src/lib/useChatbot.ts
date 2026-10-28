import { useCallback, useEffect, useState } from "react";
import { api, errorMessage, isAbort } from "../services/api";
import type { Chatbot } from "../services/types";

const POLL_MS = 1500;

/** Loads a chatbot and keeps polling while its documents are being indexed. */
export function useChatbot(id: string | null) {
  const [bot, setBot] = useState<Chatbot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    const load = async () => {
      try {
        // Without an id (opened from the screen index), show the most recently created chatbot.
        const next = id
          ? await api.getChatbot(id, controller.signal)
          : ((await api.listChatbots(controller.signal))[0] ?? null);
        setBot(next);
        setError(null);
        if (next?.documents.some((d) => d.status === "queued" || d.status === "processing"))
          timer = setTimeout(load, POLL_MS);
      } catch (e) {
        if (isAbort(e)) return;
        setError(errorMessage(e));
        timer = setTimeout(load, POLL_MS * 2);
      }
    };
    load();
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [id, attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);
  return { bot, setBot, error, loading: !bot && !error, reload };
}
