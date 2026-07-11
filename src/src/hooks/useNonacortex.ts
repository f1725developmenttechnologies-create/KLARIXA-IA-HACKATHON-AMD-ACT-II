import { useState, useCallback } from 'react';
import { nonacortexDecide } from '../api/klarixaClient';
import type { NonacortexInput, NonacortexResponse } from '../api/types';

export function useNonacortex() {
  const [response, setResponse] = useState<NonacortexResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const decide = useCallback(async (input: NonacortexInput) => {
    setLoading(true);
    setError(null);
    try {
      const res = await nonacortexDecide(input);
      setResponse(res);
      return res;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error en Nonacortex';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResponse(null);
    setError(null);
  }, []);

  return { response, loading, error, decide, reset };
}