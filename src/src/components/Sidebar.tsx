import { motion } from 'framer-motion';
import { Home, Grid3X3, Monitor, Settings, HelpCircle } from 'lucide-react';
import { useStore, MODULES } from '../store/useStore';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { activeModule, setActiveModule, setScreensaverActive } = useStore();

  const navItems = [
    { id: 'dashboard', label: 'Inicio', icon: Home },
    { id: 'modules', label: 'Módulos', icon: Grid3X3 },
    { id: 'screensaver', label: 'Protector', icon: Monitor },
    { id: 'settings', label: 'Configuración', icon: Settings },
    { id: 'help', label: 'Ayuda', icon: HelpCircle },
  ];

  const handleNav = (id: string) => {
    if (id === 'screensaver') {
      setScreensaverActive(true);
      return;
    }
    if (id === 'dashboard') {
      setActiveModule(null);
      return;
    }
    setActiveModule(id);
  };

  return (
    <motion.aside
      className="fixed left-0 top-0 h-full z-30 glass border-r border-primary/10 flex flex-col"
      initial={false}
      animate={{ width: isOpen ? 240 : 72 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b border-primary/10">
        <motion.div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setActiveModule(null)}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
            <span className="text-black font-heading font-bold text-xs">K</span>
          </div>
          {isOpen && (
            <motion.span
              className="font-heading font-bold text-sm gradient-text whitespace-nowrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              KLARIXA
            </motion.span>
          )}
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = (item.id === 'dashboard' && !activeModule) || activeModule === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-primary/20 to-secondary/10 text-primary border border-primary/20'
                  : 'text-muted hover:text-foreground hover:bg-white/5'
              }`}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.97 }}
            >
              <Icon size={20} className="flex-shrink-0" />
              {isOpen && (
                <motion.span
                  className="text-sm font-medium whitespace-nowrap"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {item.label}
                </motion.span>
              )}
            </motion.button>
          );
        })}

        {/* Module shortcuts */}
        {isOpen && (
          <div className="pt-4 mt-4 border-t border-primary/10 px-3">
            <p className="text-xs font-mono text-muted mb-3 tracking-wider uppercase">Módulos</p>
          </div>
        )}

        {MODULES.map((mod) => {
          const isActive = activeModule === mod.id;
          return (
            <motion.button
              key={mod.id}
              onClick={() => setActiveModule(mod.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-primary/20 to-secondary/10 text-primary border border-primary/20'
                  : 'text-muted hover:text-foreground hover:bg-white/5'
              }`}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${mod.gradient} flex-shrink-0`} />
              {isOpen && (
                <span className="text-xs font-medium whitespace-nowrap">{mod.name}</span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Toggle button */}
      <div className="p-2 border-t border-primary/10">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-muted hover:text-foreground hover:bg-white/5 transition-all cursor-pointer"
        >
          <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          {isOpen && (
            <motion.span
              className="text-xs whitespace-nowrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Colapsar
            </motion.span>
          )}
        </button>
      </div>
    </motion.aside>
  );
}