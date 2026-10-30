import { HashRouter, Route, Routes } from "react-router-dom";
import { Stage } from "./components/Stage";
import { ChatbotDraftProvider } from "./lib/chatbotDraft";
import { ScreenIndex } from "./components/ScreenIndex";
import { screens } from "./screens";
import Screen46Guest from "./screens/Screen46Guest";
import Screen48Widget from "./screens/Screen48Widget";

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
          {/* Web widget inside the iframe that public/widget.js adds to the owner's website. No Stage: the
              iframe is bubble- or window-sized, not a laptop screen. */}
          <Route path="/w/:chatbotId" element={<Screen48Widget />} />
          <Route path="/screens" element={<ScreenIndex />} />
          <Route path="*" element={<ScreenIndex />} />
        </Routes>
      </ChatbotDraftProvider>
    </HashRouter>
  );
}
