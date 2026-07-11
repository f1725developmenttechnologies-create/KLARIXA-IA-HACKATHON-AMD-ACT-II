import { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';

export function useCoherence() {
  const coherence = useStore((s) => s.coherence);
  const setCoherence = useStore((s) => s.setCoherence);
  const setFps = useStore((s) => s.setFps);
  const coherenceRef = useRef(coherence);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Keep ref in sync
  coherenceRef.current = coherence;

  useEffect(() => {
    // Simulate real-time coherence fluctuations
    intervalRef.current = setInterval(() => {
      const current = coherenceRef.current;
      const variation = (Math.random() - 0.5) * 0.4; // +/- 0.2%
      const newCoherence = Math.min(100, Math.max(60, current + variation));
      setCoherence(parseFloat(newCoherence.toFixed(1)));

      // Simulate FPS variation
      setFps(Math.floor(55 + Math.random() * 10));
    }, 2000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [setCoherence, setFps]);

  return { coherence };
}

export function useCoherenceRing() {
  const circumference = 2 * Math.PI * 45; // r=45
  const coherence = useStore((s) => s.coherence);
  const offset = circumference - (coherence / 100) * circumference;

  return { circumference, offset };
}