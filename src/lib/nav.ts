import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/** Returns a click-handler factory: onClick={go("/list")} */
export function useGo() {
  const navigate = useNavigate();
  return (to: string) => () => navigate(to);
}

/** Navigates automatically after a delay (Figma "After delay" interactions). */
export function useAutoNext(to: string, ms: number) {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => navigate(to), ms);
    return () => clearTimeout(t);
  }, [navigate, to, ms]);
}
