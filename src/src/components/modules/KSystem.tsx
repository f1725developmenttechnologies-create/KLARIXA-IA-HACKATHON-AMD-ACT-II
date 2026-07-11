import { motion } from 'framer-motion';
import { Activity, Cpu, HardDrive, Clock, Shield, Layers } from 'lucide-react';
import { useApiHealth } from '../../hooks/useApiHealth';
import type { SystemHealth } from '../../api/types';

/* ── Stat Card ── */
function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  color,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  unit?: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      className="glass rounded-xl p-4 flex items-center gap-4 cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs text-white/50 font-mono uppercase tracking-wider">{label}</p>
        <p className="text-lg font-heading font-bold text-white">
          {value}
          {unit && <span className="text-sm text-white/50 ml-1">{unit}</span>}
        </p>
      </div>
    </motion.div>
  );
}

/* ── Main ── */
export default function KSystem() {
  const { health, available, loading, error, refetch } = useApiHealth(8000);

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  return (
    <div className="min-h-screen bg-black p-6 md:p-10">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-2">
          Sistema KLARIXA
        </h2>
        <div className="flex items-center gap-3">
          <span
            className={`inline-block w-2.5 h-2.5 rounded-full ${
              available === null
                ? 'bg-yellow-400 animate-pulse'
                : available
                ? 'bg-green-400 shadow-[0_0_10px_#4ade80]'
                : 'bg-red-400 shadow-[0_0_10px_#f87171]'
            }`}
          />
          <span className="text-sm text-white/60 font-mono">
            {available === null
              ? 'Conectando...'
              : available
              ? 'Backend conectado · puerto 7860'
              : 'Backend no disponible · modo simulación'}
          </span>
          <button
            onClick={refetch}
            className="ml-auto px-3 py-1 text-xs font-mono text-white/50 hover:text-white/80 border border-white/10 rounded-lg transition-colors cursor-pointer"
          >
            Refresh
          </button>
        </div>
      </motion.div>

      {/* Error */}
      {error && (
        <motion.div
          className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={Activity}
          label="Estado"
          value={health?.status || (loading ? '...' : '—')}
          color="bg-green-500/20 text-green-400"
          delay={0.1}
        />
        <StatCard
          icon={Cpu}
          label="CPU"
          value={health?.cpu_percent ?? '—'}
          unit="%"
          color="bg-blue-500/20 text-blue-400"
          delay={0.15}
        />
        <StatCard
          icon={HardDrive}
          label="Memoria"
          value={health?.memory_usage_mb ?? '—'}
          unit="MB"
          color="bg-purple-500/20 text-purple-400"
          delay={0.2}
        />
        <StatCard
          icon={Clock}
          label="Uptime"
          value={health ? formatUptime(health.uptime_seconds) : '—'}
          color="bg-amber-500/20 text-amber-400"
          delay={0.25}
        />
        <StatCard
          icon={Layers}
          label="Módulos cargados"
          value={health?.modules_loaded?.length ?? '—'}
          color="bg-cyan-500/20 text-cyan-400"
          delay={0.3}
        />
        <StatCard
          icon={Shield}
          label="KSHIELD"
          value={available ? 'Activo' : '—'}
          color="bg-rose-500/20 text-rose-400"
          delay={0.35}
        />
      </div>

      {/* Modules loaded */}
      {health?.modules_loaded && health.modules_loaded.length > 0 && (
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <h3 className="font-heading text-sm text-white/50 uppercase tracking-wider mb-3">
            Módulos en Memoria
          </h3>
          <div className="flex flex-wrap gap-2">
            {health.modules_loaded.map((mod) => (
              <span
                key={mod}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-white/70"
              >
                {mod}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Memory bar */}
      {health && (
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <h3 className="font-heading text-sm text-white/50 uppercase tracking-wider mb-3">
            Uso de Memoria
          </h3>
          <div className="glass rounded-xl p-4">
            <div className="flex justify-between text-xs font-mono text-white/50 mb-2">
              <span>{health.memory_usage_mb} MB</span>
              <span>{health.memory_total_mb} MB</span>
            </div>
            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min((health.memory_usage_mb / health.memory_total_mb) * 100, 100)}%`,
                }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}