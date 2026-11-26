import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { usingMockApi } from "./services/api";
import { startTelegramPoller } from "./services/telegramPoller";
import "./index.css";

// With the in-browser mock API, the open app is what answers connected Telegram bots.
if (usingMockApi) startTelegramPoller();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
