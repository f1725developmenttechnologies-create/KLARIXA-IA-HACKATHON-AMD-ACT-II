import { useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from './store/useStore';
import { useInactivity } from './hooks/useInactivity';
import ParticleBackground from './components/ParticleBackground';
import Screensaver from './components/Screensaver';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';

// Lazy-loaded modules
const KBeauty = lazy(() => import('./components/modules/KBeauty'));
const KHealth = lazy(() => import('./components/modules/KHealth'));
const KFinance = lazy(() => import('./components/modules/KFinance'));
const KAvatar = lazy(() => import('./components/modules/KAvatar'));
const KShield = lazy(() => import('./components/modules/KShield'));
const KFlyBrain = lazy(() => import('./components/modules/KFlyBrain'));
const KSystem = lazy(() => import('./components/modules/KSystem'));
const KDefense = lazy(() => import('./components/modules/KDefense'));

// Loading component
function ModuleLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-4" />
        <p className="text-sm text-muted font-mono">Cargando módulo...</p>
      </div>
    </div>
  );
}

// Placeholder components for settings & help
function SettingsPlaceholder() {
  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        </div>
        <h2 className="text-lg font-heading font-bold gradient-text mb-2">Configuración</h2>
        <p className="text-sm text-muted">Panel de configuración del sistema</p>
        <p className="text-xs text-muted/60 mt-2">Próximamente disponible</p>
      </div>
    </div>
  );
}

function HelpPlaceholder() {
  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
            <path d="M12 17h.01" />
          </svg>
        </div>
        <h2 className="text-lg font-heading font-bold gradient-text mb-2">Ayuda</h2>
        <p className="text-sm text-muted">Centro de ayuda y documentación</p>
        <p className="text-xs text-muted/60 mt-2">Próximamente disponible</p>
      </div>
    </div>
  );
}

export default function App() {
  const { screensaverActive, systemActive, setSystemActive, setScreensaverActive, activeModule } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Inactivity timer (30s)
  useInactivity(30000);

  // Show screensaver on first load
  const handleEnter = () => {
    setScreensaverActive(false);
    setSystemActive(true);
  };

  const renderModule = () => {
    if (!activeModule) return <Dashboard />;

    const moduleComponents: Record<string, React.ReactNode> = {
      modules: <Dashboard />,
      settings: <SettingsPlaceholder />,
      help: <HelpPlaceholder />,
    };

    const actualModules: Record<string, React.ReactNode> = {
      kbeauty: <KBeauty />,
      khealth: <KHealth />,
      kfinance: <KFinance />,
      kavatar: <KAvatar />,
      kshield: <KShield />,
      kflybrain: <KFlyBrain />,
      ksystem: <KSystem />,
      kdefense: <KDefense />,
    };

    return (
      <Suspense fallback={<ModuleLoader />}>
        {actualModules[activeModule] || moduleComponents[activeModule] || <Dashboard />}
      </Suspense>
    );
  };

  // First-time screensaver
  if (!systemActive && screensaverActive) {
    return (
      <div className="relative">
        <Screensaver />
        <div
          className="fixed inset-0 z-[60] cursor-pointer"
          onClick={handleEnter}
          onMouseMove={handleEnter}
          onTouchStart={handleEnter}
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* Skip to main content for accessibility */}
      <a href="#main-content" className="skip-to-main">
        Saltar al contenido
      </a>

      <ParticleBackground />

      <AnimatePresence>
        {screensaverActive && <Screensaver />}
      </AnimatePresence>

      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main
        id="main-content"
        className="relative z-10 min-h-screen"
        style={{ marginLeft: sidebarOpen ? 240 : 72 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeModule || 'dashboard'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderModule()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile bottom nav */}
      <MobileNav sidebarOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
    </div>
  );
}

function MobileNav({ sidebarOpen, onToggle }: { sidebarOpen: boolean; onToggle: () => void }) {
  const { activeModule, setActiveModule, setScreensaverActive } = useStore();

  const navItems = [
    { id: null, label: 'Inicio', icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
    )},
    { id: 'kbeauty', label: 'Beauty', icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" /><path d="M8 12l2 2 4-4" /></svg>
    )},
    { id: 'khealth', label: 'Health', icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
    )},
    { id: 'kshield', label: 'Shield', icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
    )},
    { id: 'kflybrain', label: 'FlyBrain', icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" /><line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" /><line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" /></svg>
    )},
    { id: 'ksystem', label: 'Sistema', icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /><circle cx="12" cy="10" r="2" /></svg>
    )},
    { id: 'kdefense', label: 'Defensa', icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>
    )},
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-primary/10 block lg:hidden">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => {
              if (item.id === null) setActiveModule(null);
              else setActiveModule(item.id);
            }}
            className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-colors cursor-pointer ${
              (item.id === null && !activeModule) || activeModule === item.id
                ? 'text-primary'
                : 'text-muted'
            }`}
          >
            {item.icon({})}
            <span className="text-[9px] font-mono">{item.label}</span>
          </button>
        ))}
        <button
          onClick={() => setScreensaverActive(true)}
          className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl text-muted hover:text-foreground transition-colors cursor-pointer"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
          <span className="text-[9px] font-mono">Pantalla</span>
        </button>
        <button
          onClick={onToggle}
          className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl text-muted hover:text-foreground transition-colors cursor-pointer"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
          <span className="text-[9px] font-mono">Menú</span>
        </button>
      </div>
    </nav>
  );
}