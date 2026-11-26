// Minimal Telegram Bot API client for the browser.
//
// api.telegram.org sends `Access-Control-Allow-Origin: *` but answers CORS preflights with 501, so every
// call must be a "simple" request: POST with a form-encoded body and no custom headers.

export type TelegramUser = { id: number; is_bot: boolean; first_name: string; username?: string };
export type TelegramMessage = {
  message_id: number;
  chat: { id: number; type: string };
  from?: TelegramUser;
  text?: string;
};
export type TelegramUpdate = { update_id: number; message?: TelegramMessage };

export class TelegramError extends Error {
  constructor(
    message: string,
    readonly code: number,
  ) {
    super(message);
  }
}

export async function telegramCall<T>(
  token: string,
  method: string,
  params: Record<string, string | number | boolean> = {},
  signal?: AbortSignal,
): Promise<T> {
  const body = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) body.set(key, String(value));
  let res: Response;
  try {
    res = await fetch(`https://api.telegram.org/bot${token}/${method}`, { method: "POST", body, signal });
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") throw e;
    throw new TelegramError("Couldn't reach Telegram. Check your internet connection.", 0);
  }
  const data = (await res.json().catch(() => ({}))) as { ok?: boolean; result?: T; description?: string };
  if (!res.ok || !data.ok) throw new TelegramError(data.description ?? `Telegram ${method} failed`, res.status);
  return data.result as T;
}
