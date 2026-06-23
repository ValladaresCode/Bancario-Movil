import { useCallback, useEffect, useState } from 'react';

import { bankClient, getApiError } from '../../../shared/api';

const mapToViewModel = (promo) => ({
  raw: promo,
  id: promo?._id || promo?.id,
  name: promo?.name || promo?.title || 'Promoción',
  description: promo?.description || '',
  imageUrl: promo?.imageUrl && promo.imageUrl !== 'null' ? promo.imageUrl : null,
  terms: promo?.terms || promo?.termsAndConditions || '',
  startDate: promo?.startDate,
  endDate: promo?.endDate,
  discount: promo?.discount,
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
