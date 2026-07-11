import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import FlyBrainSimulation from '../flybrain/FlyBrainSimulation';
import FlyBrainOverlay from '../flybrain/FlyBrainOverlay';

type Phase = 'idle' | 'fly' | 'connectome' | 'compress' | 'chip' | 'complete';

export default function KFlyBrain() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [message, setMessage] = useState('✦ La naturaleza no diseña con planos. Diseña con frecuencias. ✦');
  const [frequency, setFrequency] = useState(432);
  const [started, setStarted] = useState(false);
  const [simKey, setSimKey] = useState(0); // remount key for restart
  const [triggerStart, setTriggerStart] = useState(0); // increment triggers sequence
  const phaseRef = useRef<Phase>('idle');

  const handlePhaseChange = useCallback((newPhase: Phase, msg: string) => {
    setPhase(newPhase);
    setMessage(msg);
    phaseRef.current = newPhase;
  }, []);

  const handleFrequencyChange = useCallback((hz: number) => {
    setFrequency(hz);
  }, []);

  const handleStart = useCallback(() => {
    setStarted(true);
    setTriggerStart(t => t + 1);
  }, []);

  const handleRestart = useCallback(() => {
    setStarted(false);
    setPhase('idle');
    setMessage('✦ La naturaleza no diseña con planos. Diseña con frecuencias. ✦');
    setFrequency(432);
    setSimKey(k => k + 1);
  }, []);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Simulation canvas */}
      <FlyBrainSimulation
        key={simKey}
        onPhaseChange={handlePhaseChange}
        onFrequencyChange={handleFrequencyChange}
        autoStart={false}
        triggerStart={triggerStart}
      />

      {/* UI Overlay */}
      <FlyBrainOverlay
        phase={phase}
        message={message}
        frequency={frequency}
        started={started}
        onStart={handleStart}
        onRestart={handleRestart}
      />

      {/* KLARIXA logo watermark */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'idle' ? 0.15 : 0 }}
        transition={{ duration: 0.8 }}
      >
        <span className="font-heading font-bold text-4xl md:text-6xl gradient-text tracking-[0.3em]">
          KLARIXA
        </span>
      </motion.div>
    </div>
  );
}