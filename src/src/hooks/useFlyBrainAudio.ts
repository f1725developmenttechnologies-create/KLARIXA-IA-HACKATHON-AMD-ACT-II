import { useRef, useCallback } from 'react';

const FREQ_BASE = 432;
const FREQ_TRANSFORM = 528;
const FREQ_PULSE = 639;

export type AudioPhase = 'idle' | 'fly' | 'connectome' | 'compress' | 'chip' | 'complete';

const phaseFrequencies: Record<AudioPhase, number> = {
  idle: FREQ_BASE,
  fly: FREQ_BASE,
  connectome: FREQ_TRANSFORM,
  compress: FREQ_TRANSFORM,
  chip: FREQ_PULSE,
  complete: FREQ_PULSE,
};

export default function useFlyBrainAudio() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const currentFreqRef = useRef(FREQ_BASE);

  const initAudio = useCallback(() => {
    if (audioCtxRef.current) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.value = FREQ_BASE;
      gain.gain.value = 0.06;

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      audioCtxRef.current = ctx;
      oscRef.current = osc;
      gainRef.current = gain;
      currentFreqRef.current = FREQ_BASE;
    } catch {
      // Audio not available — continue silently
    }
  }, []);

  const setFrequency = useCallback((hz: number, rampTime = 0.5) => {
    const osc = oscRef.current;
    const ctx = audioCtxRef.current;
    if (!osc || !ctx) return;
    osc.frequency.setTargetAtTime(hz, ctx.currentTime, rampTime);
    currentFreqRef.current = hz;
  }, []);

  const setPhase = useCallback((phase: AudioPhase) => {
    const freq = phaseFrequencies[phase];
    setFrequency(freq, 0.8);
  }, [setFrequency]);

  const pulse = useCallback((duration = 0.3, intensity = 0.15) => {
    const gain = gainRef.current;
    const ctx = audioCtxRef.current;
    if (!gain || !ctx) return;
    gain.gain.setTargetAtTime(intensity, ctx.currentTime, 0.05);
    gain.gain.setTargetAtTime(0.06, ctx.currentTime + duration, 0.1);
  }, []);

  const stopAudio = useCallback(() => {
    try {
      oscRef.current?.stop();
      audioCtxRef.current?.close();
    } catch { /* ignore */ }
    audioCtxRef.current = null;
    oscRef.current = null;
    gainRef.current = null;
  }, []);

  const getCurrentFrequency = useCallback(() => currentFreqRef.current, []);

  return {
    initAudio,
    setFrequency,
    setPhase,
    pulse,
    stopAudio,
    getCurrentFrequency,
    FREQ_BASE,
    FREQ_TRANSFORM,
    FREQ_PULSE,
  };
}