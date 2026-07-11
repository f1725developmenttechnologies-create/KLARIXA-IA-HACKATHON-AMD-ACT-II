import { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';

export function useInactivity(timeout: number = 30000) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const systemActiveRef = useRef(false);
  const screensaverActiveRef = useRef(false);
  const { setScreensaverActive, screensaverActive, systemActive } = useStore();

  // Keep refs in sync
  systemActiveRef.current = systemActive;
  screensaverActiveRef.current = screensaverActive;

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (systemActiveRef.current) {
      timerRef.current = setTimeout(() => {
        setScreensaverActive(true);
      }, timeout);
    }
  };

  useEffect(() => {
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'wheel'];

    const handleActivity = () => {
      if (screensaverActiveRef.current && systemActiveRef.current) {
        setScreensaverActive(false);
      }
      resetTimer();
    };

    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    resetTimer();

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeout, setScreensaverActive]);

  return { screensaverActive };
}