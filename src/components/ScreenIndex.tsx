import { Link } from "react-router-dom";
import { screens } from "../screens";

// Lists every screen of the prototype. Open it at #/screens
export function ScreenIndex() {
  return (
    <div className="min-h-screen bg-[#F7F7F5] px-10 py-12 font-gabarito text-[#111111]">
      <h1 className="text-[28px] font-bold">RAG Studio · Live Demo</h1>
      <p className="mt-1 text-[14px] text-[#6B6B6B]">{screens.length} screens. Click any screen, then use the UI to follow the prototype flow.</p>
      <ol className="mt-8 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {screens.map((s) => (
          <li key={s.path}>
            <Link
              to={s.path}
              className="block rounded-[12px] border border-[#E4E4E0] bg-white px-4 py-3 text-[14px] hover:border-[#111111]"
            >
              {s.title}
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
