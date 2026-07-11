import { useState, useCallback } from 'react';
import { defenseAnalyze } from '../api/klarixaClient';
import type { DefenseAnalysis } from '../api/types';

export function useDefense() {
  const [analysis, setAnalysis] = useState<DefenseAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (text: string) => {
    if (!text.trim()) {
      setError('Ingresa un texto para analizar');
      return null;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await defenseAnalyze(text);
      setAnalysis(res);
      return res;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error en Defensa Perceptual';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setAnalysis(null);
    setError(null);
  }, []);

  return { analysis, loading, error, analyze, reset };
}