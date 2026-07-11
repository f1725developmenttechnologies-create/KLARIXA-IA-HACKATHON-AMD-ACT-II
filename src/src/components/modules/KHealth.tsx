import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Activity, Brain, Waves, Thermometer, Zap, AlertCircle } from 'lucide-react';
import { useStore } from '../store/useStore';

interface Biomarker {
  label: string;
  value: string;
  unit: string;
  status: 'optimal' | 'warning' | 'critical';
  icon: React.ElementType;
}

export default function KHealth() {
  const { coherence, setCoherence } = useStore();
  const [resonatorActive, setResonatorActive] = useState(false);
  const [resonatorProgress, setResonatorProgress] = useState(0);

  const biomarkers: Biomarker[] = [
    { label: 'Frecuencia Base', value: '432', unit: 'Hz', status: 'optimal', icon: Activity },
    { label: 'Coherencia Neural', value: '94.2', unit: '%', status: 'optimal', icon: Brain },
    { label: 'Campo Biomagnético', value: '2.7', unit: 'μT', status: 'optimal', icon: Waves },
    { label: 'Temperatura Corporal', value: '36.8', unit: '°C', status: 'optimal', icon: Thermometer },
    { label: 'Energía Vital', value: '88', unit: '%', status: 'optimal', icon: Zap },
    { label: 'Estrés Oxidativo', value: '12', unit: 'UA', status: 'warning', icon: AlertCircle },
  ];

  const startResonator = () => {
    setResonatorActive(true);
    setResonatorProgress(0);

    const interval = setInterval(() => {
      setResonatorProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setResonatorActive(false);
          setCoherence(Math.min(100, coherence + Math.random() * 2));
          return 100;
        }
        return prev + 2;
      });
    }, 150);
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      {/* Header */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 p-2 flex items-center justify-center">
            <Heart size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold">
              <span className="gradient-text">KHealth</span>
            </h1>
            <p className="text-xs text-muted font-mono">Diagnóstico de coherencia biomagnética</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coherence Main */}
        <motion.div
          className="lg:col-span-2 glass rounded-2xl p-6 border border-primary/5"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <h2 className="text-sm font-heading font-semibold text-foreground mb-6">
            Diagnóstico de Coherencia
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {biomarkers.map((bio, i) => {
              const Icon = bio.icon;
              const statusColor = {
                optimal: 'text-success',
                warning: 'text-yellow-400',
                critical: 'text-destructive',
              }[bio.status];

              return (
                <motion.div
                  key={bio.label}
                  className="p-4 rounded-xl bg-white/5 border border-primary/5"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Icon size={16} className={`${statusColor} mb-2`} />
                  <p className="text-lg font-heading font-bold text-foreground">{bio.value}</p>
                  <p className="text-[10px] text-muted font-mono">{bio.unit}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${statusColor} ${bio.status === 'optimal' ? 'animate-pulse' : ''}`} />
                    <span className="text-[10px] text-muted">{bio.label}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Coherence Chart */}
          <div className="mt-6 p-4 rounded-xl bg-white/5 border border-primary/5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted font-mono">Onda de Coherencia (Φ)</span>
              <span className="text-xs text-primary font-mono">{coherence.toFixed(1)}%</span>
            </div>
            <div className="h-24 flex items-end gap-1">
              {Array.from({ length: 60 }, (_, i) => {
                const height = 20 + Math.sin(i * 0.3) * 15 + Math.sin(i * 0.7) * 10 + Math.random() * 10;
                const isHigh = height > 35;
                return (
                  <motion.div
                    key={i}
                    className={`flex-1 rounded-t-sm ${
                      isHigh ? 'bg-gradient-to-t from-primary to-secondary' : 'bg-primary/10'
                    }`}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: i * 0.02, duration: 0.3 }}
                  />
                );
              })}
            </div>
          </div>

          {/* Recommendations */}
          <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10">
            <p className="text-xs font-heading font-semibold text-primary mb-2">Diagnóstico</p>
            <p className="text-sm text-muted">
              Estado de coherencia <span className="text-success">óptimo</span>. Los biomarcadores principales
              muestran alineación armónica. Se recomienda una sesión de <span className="text-primary">Resonador Áureo</span> para
              mantener la frecuencia de 432 Hz.
            </p>
          </div>
        </motion.div>

        {/* Right Panel - Resonator */}
        <motion.div
          className="glass rounded-2xl p-6 border border-primary/5 flex flex-col"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h2 className="text-sm font-heading font-semibold text-foreground mb-4">
            Resonador Áureo
          </h2>

          <div className="flex-1 flex flex-col items-center justify-center py-6">
            {/* Resonance circle */}
            <div className="relative w-48 h-48 mb-6">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255, 215, 0, 0.1)" strokeWidth="2" />
                <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(0, 212, 255, 0.1)" strokeWidth="1.5" />
                <circle cx="50" cy="50" r="25" fill="none" stroke="rgba(255, 215, 0, 0.15)" strokeWidth="1" />

                {resonatorActive && (
                  <>
                    <motion.circle
                      cx="50" cy="50" r="45"
                      fill="none"
                      stroke="#FFD700"
                      strokeWidth="2"
                      strokeDasharray="283"
                      strokeDashoffset={283 - (resonatorProgress / 100) * 283}
                      animate={{ strokeDashoffset: 283 - (resonatorProgress / 100) * 283 }}
                      transition={{ duration: 0.3 }}
                      style={{ filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))' }}
                    />
                    <motion.circle
                      cx="50" cy="50" r="35"
                      fill="none"
                      stroke="#00D4FF"
                      strokeWidth="1.5"
                      strokeDasharray="220"
                      strokeDashoffset={220 - (resonatorProgress / 100) * 220}
                      animate={{ strokeDashoffset: 220 - (resonatorProgress / 100) * 220 }}
                      transition={{ duration: 0.3 }}
                      style={{ filter: 'drop-shadow(0 0 10px rgba(0, 212, 255, 0.5))' }}
                    />
                  </>
                )}

                {/* Center */}
                <circle cx="50" cy="50" r="8" fill="#FFD700" opacity={resonatorActive ? 0.8 : 0.3}>
                  {resonatorActive && (
                    <animate attributeName="r" values="8;12;8" dur="1s" repeatCount="indefinite" />
                  )}
                </circle>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-xl font-heading font-bold gradient-text">432</p>
                  <p className="text-[10px] text-muted font-mono">Hz</p>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            {resonatorActive && (
              <div className="w-full mb-4">
                <div className="flex justify-between text-xs text-muted font-mono mb-1">
                  <span>Resonando...</span>
                  <span>{resonatorProgress}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                    initial={{ width: '0%' }}
                    animate={{ width: `${resonatorProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}

            <button
              onClick={startResonator}
              disabled={resonatorActive}
              className={`btn-gradient text-sm py-3 px-8 rounded-xl w-full ${
                resonatorActive ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {resonatorActive ? 'RESONANDO...' : 'INICIAR RESONADOR'}
            </button>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-white/5 border border-primary/5">
            <p className="text-[10px] text-muted font-mono text-center">
              Sesión de resonancia a 432 Hz · 30 segundos
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}