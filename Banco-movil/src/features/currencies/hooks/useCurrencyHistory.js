import { useCallback, useEffect, useState } from 'react';

import { bankClient, getApiError } from '../../../shared/api';

// Histórico de 30 días para un par de monedas (solo CURRENCY_HISTORY_SUPPORTED).
// enabled=false evita disparar la petición cuando el par no aplica (p. ej. base=GTQ).
export function useCurrencyHistory(base, target, enabled) {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchHistory = useCallback(async () => {
    if (!enabled || !base || !target || base === target) {
      setPoints([]);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await bankClient.get('/currencies/history', { params: { base, target, days: 30 } });
      const data = res.data?.data || res.data || {};
      setPoints(data.points || []);
    } catch (err) {
      setError(getApiError(err, 'No fue posible cargar el histórico'));
      setPoints([]);
    } finally {
      setLoading(false);
    }
  }, [base, target, enabled]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { points, loading, error, refetch: fetchHistory };
}
