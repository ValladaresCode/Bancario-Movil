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

const mapToViewModel = (service) => ({
  raw: service,
  id: service?._id || service?.id,
  name: toText(service?.name, 'Servicio'),
  description: toText(service?.description),
  price: toNum(service?.price),
  currency: toText(service?.currency, 'GTQ'),
  imageUrl: service?.imageUrl && service.imageUrl !== 'null' ? service.imageUrl : null,
  category: toText(service?.category, 'General'),
  type: toText(service?.type, 'SERVICE'),
  discount: toNum(service?.discount),
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
