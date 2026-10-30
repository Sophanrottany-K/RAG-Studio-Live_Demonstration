import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ChartPie, ChevronsUpDown, FlaskConical, Lock, LogOut, MessagesSquare, PanelLeft, Share2 } from "lucide-react";
import { useGo } from "../../lib/nav";

// Left sidebar, ported from the RAG Studio web app (components/layout/user-sidebar.tsx and
// user-account-menu.tsx): logo, main tabs and the signed-in user, collapsible to an icon rail.
// Width comes from --app-sidebar-w (index.css), so absolutely positioned layouts can pad by it too.

// Collapse state, shared by every screen and kept across reloads. It is mirrored on
// <html data-sidebar="collapsed"> so CSS (the --app-sidebar-w variable) follows it.
const KEY = "sidebar-collapsed";
const listeners = new Set<() => void>();

function read() {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

let collapsed = read();
apply();

function apply() {
  if (collapsed) document.documentElement.dataset.sidebar = "collapsed";
  else delete document.documentElement.dataset.sidebar;
}

function toggleCollapsed() {
  collapsed = !collapsed;
  try {
    localStorage.setItem(KEY, collapsed ? "1" : "0");
  } catch {
    /* storage unavailable: state just won't survive a reload */
  }
  apply();
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export type SidebarItem = "analytics" | "chatbots" | "playground" | "channels";

const ITEMS = [
  { key: "analytics", label: "Analytics", icon: ChartPie },
  { key: "chatbots", label: "Chatbots", icon: MessagesSquare },
  { key: "playground", label: "Playground", icon: FlaskConical },
  { key: "channels", label: "Channels", icon: Share2 },
] as const;

/** Where each tab goes; screens override the ones the Figma prototype links elsewhere (e.g. the tour). */
const DEFAULT_LINKS: Record<SidebarItem, string> = {
  analytics: "/",
  chatbots: "/list",
  playground: "/pg",
  channels: "/ch0",
};

// MOCK: the prototype has no sign-in; this is the user the Figma frames show.
const USER = { name: "Rottany", email: "rottany@gmail.com" };
const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

export function AppSidebar({
  active,
  links,
  className = "h-full shrink-0",
}: {
  active?: SidebarItem;
  links?: Partial<Record<SidebarItem, string>>;
  /** Placement; the absolutely positioned layouts pass "absolute left-0 top-0 h-full". */
  className?: string;
}) {
  const go = useGo();
  const isCollapsed = useSyncExternalStore(subscribe, () => collapsed);
  const to = { ...DEFAULT_LINKS, ...links };

  // Ctrl/Cmd+B toggles the sidebar, as in the web app.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "b" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleCollapsed();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <aside
      className={`${className} bg-page border-line z-20 flex w-(--app-sidebar-w) flex-col border-r font-gabarito transition-[width] duration-200 ease-linear`}
    >
      <div className={`flex items-center gap-2 pt-7 pb-8 ${isCollapsed ? "flex-col px-3" : "flex-row px-6"}`}>
        <button
          type="button"
          aria-label="RAGStudio home"
          className="flex cursor-pointer items-center"
          onClick={go(to.analytics)}
        >
          {isCollapsed ? (
            <img src="icons/ragstudio-icon-light.png" alt="" className="size-9" />
          ) : (
            <img src="icons/ragstudio-logo-light.png" alt="" className="h-9 w-auto" />
          )}
        </button>
        <button
          type="button"
          aria-label="Toggle Sidebar"
          title={`${isCollapsed ? "Expand" : "Collapse"} sidebar (Ctrl+B)`}
          className={`text-ink-muted rounded-tag hover:bg-subtle hover:text-ink flex size-8 shrink-0 cursor-pointer items-center justify-center transition-colors ${isCollapsed ? "" : "ml-auto"}`}
          onClick={toggleCollapsed}
        >
          <PanelLeft className="size-5" aria-hidden />
        </button>
      </div>

      <nav className="flex min-h-0 flex-1 flex-col px-4">
        {!isCollapsed && <div className="text-eyebrow text-ink-secondary mb-3 px-3 font-mono uppercase">{"Main"}</div>}
        <ul className="flex flex-col gap-1">
          {ITEMS.map(({ key, label, icon: Icon }) => {
            const current = key === active;
            return (
              <li key={key} className="group relative">
                <button
                  type="button"
                  aria-current={current ? "page" : undefined}
                  className={`rounded-small text-p2 flex h-12 cursor-pointer items-center gap-3 overflow-hidden transition-colors [&>svg]:size-5 [&>svg]:shrink-0 ${
                    isCollapsed ? "w-12 justify-center" : "w-full px-4"
                  } ${current ? "bg-inverse text-on-inverse font-bold" : "text-ink-body hover:bg-subtle hover:text-ink"}`}
                  onClick={go(to[key])}
                >
                  <Icon aria-hidden />
                  {!isCollapsed && <span className="truncate">{label}</span>}
                </button>
                {isCollapsed && (
                  <span className="bg-inverse text-on-inverse text-c2 rounded-tag pointer-events-none absolute top-1/2 left-full z-30 ml-3 -translate-y-1/2 px-2.5 py-1.5 whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100">
                    {label}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-line mx-4 border-t py-5">
        <AccountMenu collapsed={isCollapsed} />
      </div>
    </aside>
  );
}

/** User box at the bottom of the sidebar; click it to open the account popup. */
function AccountMenu({ collapsed }: { collapsed: boolean }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-label={`Account menu: ${USER.name}`}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`rounded-small hover:bg-subtle flex w-full cursor-pointer items-center gap-3 text-left transition-colors ${
          open ? "bg-subtle" : ""
        } ${collapsed ? "justify-center p-1" : "p-2"}`}
        onClick={() => setOpen((o) => !o)}
      >
        <span
          className="bg-accent-tint text-c2 text-accent flex size-10 shrink-0 items-center justify-center rounded-full"
          aria-hidden
        >
          {initials(USER.name)}
        </span>
        {!collapsed && (
          <>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="text-s2 text-ink truncate">{USER.name}</span>
                <span className="bg-inverse text-on-inverse text-c3 rounded-xs px-1.5 py-0.5 uppercase">{"User"}</span>
              </span>
              <span className="text-c1 text-ink-secondary block truncate">{USER.email}</span>
            </span>
            <ChevronsUpDown className="text-ink-muted size-4 shrink-0" aria-hidden />
          </>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="bg-card border-line shadow-elevated rounded-card-sm absolute bottom-full left-0 z-30 mb-2 w-62 border p-2"
        >
          <div className="flex items-center gap-4 px-3 py-3">
            <span
              className="bg-muted text-s2 text-ink flex size-14 shrink-0 items-center justify-center rounded-full"
              aria-hidden
            >
              {initials(USER.name)}
            </span>
            <span className="min-w-0">
              <span className="text-s1 text-ink block truncate">{USER.name}</span>
              <span className="text-p3 text-ink-secondary block">{"User"}</span>
            </span>
          </div>
          <div className="bg-line mx-1 my-1 h-px" />
          {/* The prototype has no account page or sign-in, so these only close the menu. */}
          <button
            type="button"
            role="menuitem"
            className="rounded-small text-p2 text-ink hover:bg-subtle flex w-full cursor-pointer items-center gap-3 px-3 py-3 text-left"
            onClick={() => setOpen(false)}
          >
            <Lock className="size-5" aria-hidden />
            {"Account and security"}
          </button>
          <button
            type="button"
            role="menuitem"
            className="rounded-small text-p2 text-danger-text hover:bg-danger-tint flex w-full cursor-pointer items-center gap-3 px-3 py-3 text-left"
            onClick={() => setOpen(false)}
          >
            <LogOut className="size-5" aria-hidden />
            {"Sign out"}
          </button>
        </div>
      )}
    </div>
  );
}
