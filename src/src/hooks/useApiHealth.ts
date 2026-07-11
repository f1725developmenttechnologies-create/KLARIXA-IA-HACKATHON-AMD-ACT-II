import { useState, useEffect, useCallback } from 'react';
import { getHealth, isBackendAvailable } from '../api/klarixaClient';
import type { SystemHealth } from '../api/types';

export function useApiHealth(pollInterval = 5000) {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHealth = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getHealth();
      setHealth(data);
      setAvailable(true);
      setError(null);
    } catch (err) {
      setAvailable(false);
      setError(err instanceof Error ? err.message : 'Backend no disponible');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial check
    isBackendAvailable().then(setAvailable);
    fetchHealth();

    if (pollInterval > 0) {
      const id = setInterval(fetchHealth, pollInterval);
      return () => clearInterval(id);
    }
  }, [fetchHealth, pollInterval]);

  return { health, available, error, loading, refetch: fetchHealth };
}