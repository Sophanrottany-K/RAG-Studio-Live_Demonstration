import { HashRouter, Route, Routes } from "react-router-dom";
import { Stage } from "./components/Stage";
import { ChatbotDraftProvider } from "./lib/chatbotDraft";
import { ScreenIndex } from "./components/ScreenIndex";
import { screens } from "./screens";
import Screen46Guest from "./screens/Screen46Guest";

// HashRouter keeps every screen reachable on any static host (no server rewrites needed).
export default function App() {
  return (
    <HashRouter>
      <ChatbotDraftProvider>
        <Routes>
          {screens.map(({ path, Component }) => (
            <Route
              key={path}
              path={path}
              element={
                <Stage>
                  <Component />
                </Stage>
              }
            />
          ))}
          {/* Guest chat behind a public share link; not in the jump list because it needs a token. */}
          <Route
            path="/s/:token"
            element={
              <Stage>
                <Screen46Guest />
              </Stage>
            }
          />
          <Route path="/screens" element={<ScreenIndex />} />
          <Route path="*" element={<ScreenIndex />} />
        </Routes>
      </ChatbotDraftProvider>
    </HashRouter>
  );
}
