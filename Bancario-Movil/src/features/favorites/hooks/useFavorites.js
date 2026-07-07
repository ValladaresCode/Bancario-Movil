import { useCallback, useEffect, useState } from 'react';

import { bankClient, getApiError } from '../../../shared/api';

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFavorites = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await bankClient.get('/favorites');
      const list = res.data?.favorites || res.data?.data?.favorites || res.data || [];
      setFavorites(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(getApiError(err, 'No fue posible cargar tus favoritos'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const addFavorite = useCallback(
    async ({ cuenta, tipo, alias }) => {
      try {
        await bankClient.post('/favorites', { cuenta, tipo, alias });
        await fetchFavorites();
        return { ok: true };
      } catch (err) {
        return { ok: false, error: getApiError(err, 'No fue posible agregar el favorito') };
      }
    },
    [fetchFavorites]
  );

  const updateFavorite = useCallback(
    async (id, { alias }) => {
      try {
        const res = await bankClient.put(`/favorites/${id}`, { alias });
        const updated = res.data?.favorite || { alias };
        setFavorites((current) => current.map((item) => (item._id === id ? { ...item, ...updated } : item)));
        return { ok: true };
      } catch (err) {
        return { ok: false, error: getApiError(err, 'No fue posible actualizar el alias') };
      }
    },
    []
  );

  const removeFavorite = useCallback(
    async (id) => {
      try {
        await bankClient.delete(`/favorites/${id}`);
        setFavorites((current) => current.filter((item) => item._id !== id));
        return { ok: true };
      } catch (err) {
        return { ok: false, error: getApiError(err, 'No fue posible eliminar el favorito') };
      }
    },
    []
  );

  return { favorites, loading, error, refetch: fetchFavorites, addFavorite, updateFavorite, removeFavorite };
}
