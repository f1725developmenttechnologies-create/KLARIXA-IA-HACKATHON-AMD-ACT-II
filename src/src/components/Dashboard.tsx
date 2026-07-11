import { motion } from 'framer-motion';
import { useStore, MODULES } from '../store/useStore';
import { useCoherence, useCoherenceRing } from '../hooks/useCoherence';
import ModuleCard from './ModuleCard';
import { Activity, Cpu, Battery, Clock, Eye, Shield } from 'lucide-react';

export default function Dashboard() {
  const { coherence, fps, batteryLevel, systemActive, setScreensaverActive } = useStore();
  const { circumference, offset } = useCoherenceRing();
  useCoherence();

  const metrics = [
    { label: 'Coherencia (Φ)', value: `${coherence.toFixed(1)}%`, icon: Activity, color: 'text-primary', change: '+0.3%' },
    { label: 'FPS GPU', value: `${fps}`, icon: Eye, color: 'text-secondary', change: 'Estable' },
    { label: 'Batería', value: `${batteryLevel}%`, icon: Battery, color: 'text-success', change: 'Cargando' },
    { label: 'Sistema', value: systemActive ? 'ACTIVO' : 'DORMIDO', icon: Cpu, color: 'text-success', change: systemActive ? 'En línea' : 'Standby' },
  ];

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <motion.h1
            className="text-2xl md:text-3xl font-heading font-bold"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className="gradient-text">Dashboard</span>
          </motion.h1>
          <p className="text-sm text-muted mt-1 font-sans">
            Sistema de coherencia en tiempo real
          </p>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            className="btn-outline text-xs px-4 py-2 rounded-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setScreensaverActive(true)}
          >
            <Clock size={14} className="inline mr-1.5" />
            Protector
          </motion.button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
        {metrics.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              className="glass rounded-2xl p-4 md:p-5 border border-primary/5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <div className="flex items-start justify-between mb-3">
                <Icon size={18} className={metric.color} />
                <span className="text-xs text-muted font-mono">{metric.change}</span>
              </div>
              <p className="text-2xl md:text-3xl font-heading font-bold text-foreground">
                {metric.value}
              </p>
              <p className="text-xs text-muted mt-1 font-sans">{metric.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Coherence Ring + Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Coherence Visualization */}
        <motion.div
          className="glass rounded-2xl p-6 border border-primary/5 flex flex-col items-center justify-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="relative w-40 h-40 mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Background ring */}
              <circle
                cx="50" cy="50" r="45"
                fill="none"
                stroke="rgba(255, 215, 0, 0.1)"
                strokeWidth="6"
              />
              {/* Coherence arc */}
              <motion.circle
                cx="50" cy="50" r="45"
                fill="none"
                stroke="url(#coherenceGrad)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1, ease: 'easeInOut' }}
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(0, 212, 255, 0.5))',
                }}
              />
              <defs>
                <linearGradient id="coherenceGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFD700" />
                  <stop offset="100%" stopColor="#00D4FF" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <motion.p
                  className="text-3xl font-heading font-bold gradient-text"
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2.3, repeat: Infinity }}
                >
                  {coherence.toFixed(1)}%
                </motion.p>
                <p className="text-[10px] text-muted font-mono mt-1">Φ COHERENCIA</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted font-mono text-center">
            Estado del sistema: <span className="text-success">Óptimo</span>
          </p>
        </motion.div>

        {/* Module Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MODULES.map((mod, i) => (
            <ModuleCard key={mod.id} module={mod} index={i} />
          ))}
        </div>
      </div>

      {/* System Status Bar */}
      <motion.div
        className="glass rounded-2xl p-4 border border-primary/5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <div className="flex items-center gap-4 text-xs font-mono text-muted flex-wrap">
          <Shield size={14} className="text-secondary" />
          <span className="text-primary">KShield</span>
          <span className="text-muted/50">|</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-success inline-block animate-pulse" />
            Firewall activo
          </span>
          <span className="text-muted/50 hidden sm:inline">|</span>
          <span className="hidden sm:inline">Último diagnóstico: hace 2 min</span>
          <span className="text-muted/50 hidden md:inline">|</span>
          <span className="hidden md:inline">GPU: AMD Radeon @ 2.3 GHz</span>
          <span className="ml-auto text-primary/60">
            {new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
      </motion.div>
    </div>
  );
}