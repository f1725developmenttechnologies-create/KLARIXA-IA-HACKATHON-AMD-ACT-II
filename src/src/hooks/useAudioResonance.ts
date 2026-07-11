import { useCallback, useEffect, useRef, useState } from 'react';

export type ResonanceFrequency = 432 | 528 | 639 | 741 | 852 | 963;

interface AudioResonanceState {
  isPlaying: boolean;
  currentFrequency: ResonanceFrequency;
  volume: number;
}

export function useAudioResonance() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const [state, setState] = useState<AudioResonanceState>({
    isPlaying: false,
    currentFrequency: 432,
    volume: 0.08,
  });

  // Initialize audio context on first user interaction
  const init = useCallback(() => {
    if (audioCtxRef.current) return;

    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.value = state.currentFrequency;
      gain.gain.value = state.volume;

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      audioCtxRef.current = ctx;
      oscillatorRef.current = osc;
      gainNodeRef.current = gain;

      setState((prev) => ({ ...prev, isPlaying: true }));
    } catch (err) {
      console.warn('Audio context could not be initialized:', err);
    }
  }, [state.currentFrequency, state.volume]);

  const setFrequency = useCallback(
    (hz: ResonanceFrequency, rampTime = 0.15) => {
      if (!oscillatorRef.current || !audioCtxRef.current) return;

      oscillatorRef.current.frequency.setTargetAtTime(
        hz,
        audioCtxRef.current.currentTime,
        rampTime
      );
      setState((prev) => ({ ...prev, currentFrequency: hz }));
    },
    []
  );

  const setVolume = useCallback(
    (vol: number) => {
      if (!gainNodeRef.current || !audioCtxRef.current) return;

      gainNodeRef.current.gain.setTargetAtTime(
        Math.max(0, Math.min(1, vol)),
        audioCtxRef.current.currentTime,
        0.1
      );
      setState((prev) => ({ ...prev, volume: vol }));
    },
    []
  );

  const stop = useCallback(() => {
    try {
      oscillatorRef.current?.stop();
    } catch {
      // oscillator may already be stopped
    }
    audioCtxRef.current?.close();
    audioCtxRef.current = null;
    oscillatorRef.current = null;
    gainNodeRef.current = null;
    setState((prev) => ({ ...prev, isPlaying: false }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      try {
        oscillatorRef.current?.stop();
      } catch {
        /* already stopped */
      }
      audioCtxRef.current?.close();
    };
  }, []);

  return { ...state, init, setFrequency, setVolume, stop };
}