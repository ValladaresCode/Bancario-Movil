import { useCallback, useEffect, useState } from 'react';

import { bankClient, getApiError } from '../../../shared/api';

// Conversor de divisas (endpoint público). GET /currencies?base=GTQ
export function useCurrencies(initialBase = 'GTQ') {
  const normalizedInitialBase = String(initialBase || 'GTQ').toUpperCase();
  const [base, setBase] = useState(normalizedInitialBase);
  const [rates, setRates] = useState({});
  const [lastUpdate, setLastUpdate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRates = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const normalizedBase = String(base || 'GTQ').toUpperCase();
      const res = await bankClient.get('/currencies', { params: { base: normalizedBase } });
      const data = res.data?.data || res.data || {};
      setRates(data.rates || {});
      setLastUpdate(data.lastUpdate || null);
    } catch (err) {
      setError(getApiError(err, 'No fue posible cargar las tasas de cambio'));
    } finally {
      setLoading(false);
    }
  }, [base]);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  return { base, setBase, rates, lastUpdate, loading, error, refetch: fetchRates };
}
