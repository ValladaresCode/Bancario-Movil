import { useCallback, useEffect, useState } from 'react';

import { bankClient, getApiError } from '../../../shared/api';

const mapToViewModel = (service) => ({
  raw: service,
  id: service?._id || service?.id,
  name: service?.name || 'Servicio',
  description: service?.description || '',
  price: service?.price,
  currency: service?.currency || 'GTQ',
  imageUrl: service?.imageUrl && service.imageUrl !== 'null' ? service.imageUrl : null,
  category: service?.category || 'General',
  type: service?.type || 'SERVICE',
  discount: service?.discount,
});

export function useServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // El cliente solo ve servicios ACTIVE; internalNote viene oculto.
      const res = await bankClient.get('/services', { params: { status: 'ACTIVE', page: 1, limit: 50 } });
      const list = res.data?.data || res.data || [];
      setServices(Array.isArray(list) ? list.map(mapToViewModel) : []);
    } catch (err) {
      setError(getApiError(err, 'No fue posible cargar los servicios'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const getServiceById = useCallback(async (id) => {
    try {
      const res = await bankClient.get(`/services/${id}`);
      const data = res.data?.data || res.data;
      return { ok: true, data: mapToViewModel(data) };
    } catch (err) {
      return { ok: false, error: getApiError(err, 'No eres elegible para este servicio') };
    }
  }, []);

  return { services, loading, error, refetch: fetchServices, getServiceById };
}
