import { useEffect, useState, type ReactNode } from "react";
import { Toaster } from "./shared/Toaster";

// Every screen fills the whole browser window on any laptop.
// The layout is fluid, and the UI density adapts to the window: we pick a scale
// so the window behaves like a ~1536x760 viewport (a typical laptop browser
// window), then lay the screen out at window/scale and scale it back up.
// Small laptops (1280/1366) get slightly smaller UI, large screens (1920+)
// slightly larger, and the page always covers the window edge to edge.
const BASE_W = 1536;
const BASE_H = 760;
const MIN_SCALE = 0.75;
const MAX_SCALE = 1.5;

// Below this layout size the window scrolls instead of squeezing the layout.
export const MIN_W = 1280;
export const MIN_H = 640;

function useViewport() {
  const read = () => ({ w: window.innerWidth, h: window.innerHeight });
  const [vp, setVp] = useState(read);
  useEffect(() => {
    const onResize = () => setVp(read());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return vp;
}

export function Stage({ children }: { children: ReactNode }) {
  const { w, h } = useViewport();
  const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, Math.min(w / BASE_W, h / BASE_H)));
  const layoutW = Math.max(MIN_W, w / scale);
  const layoutH = Math.max(MIN_H, h / scale);
  return (
    <div className="h-screen w-screen overflow-auto bg-bg-page">
      {/* floor + overflow-clip: float rounding must never trigger scrollbars, and focusing an
          input must not scroll the unscaled layout box inside (overflow-hidden would allow that) */}
      <div className="overflow-clip" style={{ width: Math.floor(layoutW * scale), height: Math.floor(layoutH * scale) }}>
        <div className="origin-top-left" style={{ width: layoutW, height: layoutH, transform: `scale(${scale})` }}>
          {children}
          <Toaster />
        </div>
      </div>
    </div>
  );
}
