import { NavLink } from "react-router-dom";

const modules = [
  { path: "/", label: "Dashboard", icon: "◈" },
  { path: "/flybrain", label: "FlyBrain", icon: "◇" },
  { path: "/ktech", label: "KTECH", icon: "◎" },
  { path: "/nonacortex", label: "Nonacortex", icon: "○" },
  { path: "/kshield", label: "KSHIELD", icon: "▣" },
  { path: "/settings", label: "Settings", icon: "⚙" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-[#14141A] border-r border-[#1E1E2A] transition-all duration-200 ${
          collapsed ? "w-16" : "w-56"
        }`}
      >
        {/* Brand */}
        <div className="h-14 flex items-center gap-3 px-4 border-b border-[#1E1E2A]">
          <button
            onClick={onToggle}
            className="flex items-center gap-2 min-w-0"
          >
            <div className="w-3 h-3 rounded-full bg-[#00FF88] shadow-[0_0_8px_#00FF88] animate-pulse-glow flex-shrink-0" />
            {!collapsed && (
              <span className="text-white font-bold tracking-wider text-sm whitespace-nowrap">
                KLARIXA
              </span>
            )}
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-3 space-y-0.5 px-2">
          {modules.map((m) => (
            <NavLink
              key={m.path}
              to={m.path}
              end={m.path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                  isActive
                    ? "bg-[#00FF88]/10 text-[#00FF88] font-medium"
                    : "text-[#8888AA] hover:text-[#E0E0E0] hover:bg-[#1E1E2A]/50"
                }`
              }
            >
              <span className="text-lg w-5 text-center flex-shrink-0">{m.icon}</span>
              {!collapsed && <span className="truncate">{m.label}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#14141A] border-t border-[#1E1E2A] z-50 flex justify-around items-center h-14 px-1 safe-area-bottom">
        {modules.map((m) => (
          <NavLink
            key={m.path}
            to={m.path}
            end={m.path === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-lg transition-all duration-150 min-w-0 flex-1 ${
                isActive
                  ? "text-[#00FF88]"
                  : "text-[#555577] hover:text-[#8888AA]"
              }`
            }
          >
            <span className="text-lg">{m.icon}</span>
            <span className="text-[10px] leading-tight truncate max-w-full">
              {m.label}
            </span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}