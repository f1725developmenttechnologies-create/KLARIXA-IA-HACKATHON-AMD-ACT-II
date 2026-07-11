import { motion, AnimatePresence } from 'framer-motion';

interface FlyBrainOverlayProps {
  phase: string;
  message: string;
  frequency: number;
  started: boolean;
  onStart: () => void;
  onRestart: () => void;
}

const phaseLabels: Record<string, string> = {
  idle: '⚡ KLARIXA — LISTA PARA CREAR',
  fly: '🧬 FASE 1 — OBSERVANDO LA MOSCA',
  connectome: '🔬 FASE 2 — DECODIFICANDO EL CONECTOMA',
  compress: '💠 FASE 3 — CONCENTRANDO ENERGÍA',
  chip: '🛡️ FASE 4 — MATERIALIZANDO EL FLY-BRAIN',
  complete: '✅ KLARIXA — FLY-BRAIN COMPLETADO',
};

export default function FlyBrainOverlay({ phase, message, frequency, started, onStart, onRestart }: FlyBrainOverlayProps) {
  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Status bar */}
      <div className="absolute top-4 left-4 pointer-events-auto">
        <motion.div
          className="px-4 py-2 rounded-xl glass text-xs font-mono text-primary/80"
          key={phase}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {phaseLabels[phase] || phaseLabels.idle}
        </motion.div>
      </div>

      {/* Frequency display */}
      <div className="absolute top-4 right-4 pointer-events-auto">
        <motion.div
          className="px-4 py-2 rounded-xl glass text-xs font-mono text-secondary/80 flex items-center gap-2"
          animate={phase === 'chip' || phase === 'complete' ? { boxShadow: '0 0 20px rgba(0,180,255,0.3)' } : {}}
        >
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          {frequency} Hz
        </motion.div>
      </div>

      {/* Central message */}
      <AnimatePresence mode="wait">
        <motion.div
          key={message}
          className="absolute bottom-32 left-0 right-0 text-center px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm md:text-base font-heading text-primary/70 tracking-wider"
            style={{ textShadow: '0 0 20px rgba(255,215,0,0.3)' }}
          >
            {message}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Start / Restart button */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-auto">
        {!started ? (
          <motion.button
            onClick={onStart}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border-2 border-primary text-primary font-heading text-sm tracking-wider cursor-pointer backdrop-blur-md"
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255,215,0,0.3)' }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            ▶ INICIAR SIMULACIÓN
          </motion.button>
        ) : phase === 'complete' ? (
          <motion.button
            onClick={onRestart}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border-2 border-primary text-primary font-heading text-sm tracking-wider cursor-pointer backdrop-blur-md"
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255,215,0,0.3)' }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            🔄 REINICIAR SIMULACIÓN
          </motion.button>
        ) : null}
      </div>
    </div>
  );
}