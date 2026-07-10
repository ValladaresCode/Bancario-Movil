import { useCallback, useEffect, useState } from 'react';

import { bankClient, getApiError } from '../../../shared/api';

// Coerciona a texto renderizable; si llega un objeto/array inesperado, lo descarta
// (evita el crash "Objects are not valid as a React child" → página en blanco).
const toText = (v, fallback = '') => {
  if (v === null || v === undefined) return fallback;
  if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') return String(v);
  return fallback;
};
const toNum = (v) =>
  typeof v === 'number' || (typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Number(v)))
    ? Number(v)
    : undefined;

const mapToViewModel = (promo) => ({
  raw: promo,
  id: promo?._id || promo?.id,
  name: toText(promo?.name) || toText(promo?.title) || 'Promoción',
  description: toText(promo?.description),
  imageUrl: promo?.imageUrl && promo.imageUrl !== 'null' ? promo.imageUrl : null,
  terms: toText(promo?.terms) || toText(promo?.termsAndConditions),
  startDate: promo?.startDate,
  endDate: promo?.endDate,
  discount: toNum(promo?.discount),
});

export function usePromotions() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPromotions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await bankClient.get('/promotions', { params: { status: 'ACTIVE', page: 1, limit: 50 } });
      const list = res.data?.data || res.data || [];
      setPromotions(Array.isArray(list) ? list.map(mapToViewModel) : []);
    } catch (err) {
      setError(getApiError(err, 'No fue posible cargar las promociones'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  const getPromotionById = useCallback(async (id) => {
    try {
      const res = await bankClient.get(`/promotions/${id}`);
      const data = res.data?.data || res.data;
      return { ok: true, data: mapToViewModel(data) };
    } catch (err) {
      return { ok: false, error: getApiError(err, 'No fue posible cargar la promoción') };
    }
  }, []);

  return { promotions, loading, error, refetch: fetchPromotions, getPromotionById };
}
