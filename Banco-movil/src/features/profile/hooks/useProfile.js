import { useCallback, useEffect, useState } from 'react';

import { authClient, buildFormData, getApiError } from '../../../shared/api';
import { useAuthStore } from '../../../shared/store/authStore';

const mapToViewModel = (raw) => ({
  id: raw?.id,
  name: raw?.name || '',
  email: raw?.email || '',
  phone: raw?.phone || '',
  profilePicture: raw?.profilePicture || null,
  role: raw?.role,
  fechaNacimiento: raw?.fechaNacimiento || '',
  dpi: raw?.dpi || '',
  ingresosMensuales: raw?.ingreso_mensuales ?? raw?.ingresosMensuales ?? '',
  direccion: raw?.direccion || '',
  nombreTrabajo: raw?.nombreTrabajo ?? raw?.nombre_trabajo ?? '',
});

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await authClient.get('/auth/profile');
      const data = res.data?.data || res.data;
      setProfile(mapToViewModel(data));
    } catch (err) {
      setError(getApiError(err, 'No fue posible cargar tu perfil'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // PATCH /users/me multipart. Puede quedar PENDING de aprobación admin.
  const updateProfile = useCallback(
    async (form) => {
      try {
        const formData = await buildFormData(
          {
            name: form.name,
            ingresosMensuales: form.ingresosMensuales,
            direccion: form.direccion,
            nombreTrabajo: form.nombreTrabajo,
          },
          form.profilePicture ? { uri: form.profilePicture, field: 'profilePicture' } : null
        );
        const res = await authClient.patch('/users/me', formData);
        // Refleja cambios en el store (nombre/foto del header).
        setUser({ name: form.name });
        await fetchProfile();
        return { ok: true, data: res.data };
      } catch (err) {
        return { ok: false, error: getApiError(err, 'No fue posible actualizar tu perfil') };
      }
    },
    [fetchProfile, setUser]
  );

  return { profile, loading, error, refetch: fetchProfile, updateProfile, logout };
}
