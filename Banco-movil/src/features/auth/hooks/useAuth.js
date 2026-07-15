import { useCallback, useEffect, useRef, useState } from 'react';

import { authClient, buildFormData, getApiError } from '../../../shared/api';
import { useAuthStore } from '../../../shared/store/authStore';

// Toda la lógica de autenticación. Las screens solo hacen wiring.
export function useAuth() {
  const [loading, setLoading] = useState(false);
  const loginToStore = useAuthStore((state) => state.login);

  // Evita setState tras desmontar (la screen puede navegar antes de resolver la petición).
  const mountedRef = useRef(true);
  useEffect(() => () => {
    mountedRef.current = false;
  }, []);
  const stopLoading = () => {
    if (mountedRef.current) setLoading(false);
  };

  const login = useCallback(
    async ({ email, password }) => {
      setLoading(true);
      try {
        const { data } = await authClient.post('/auth/login', { email, password });
        const token = data?.token;
        const user = data?.userDetails || data?.user || null;
        if (!token) {
          return { ok: false, error: 'Respuesta inválida del servidor' };
        }
        await loginToStore({ token, user });
        return { ok: true };
      } catch (error) {
        return { ok: false, error: getApiError(error, 'No se pudo iniciar sesión') };
      } finally {
        stopLoading();
      }
    },
    [loginToStore]
  );

  // Registro multipart → /auth/signup-request. Sin sesión: queda PENDING.
  const register = useCallback(async (form) => {
    setLoading(true);
    try {
      const formData = await buildFormData(
        {
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          fechaNacimiento: form.fechaNacimiento,
          dpi: form.dpi,
          ingresosMensuales: form.ingresosMensuales,
          direccion: form.direccion,
          nombreTrabajo: form.nombreTrabajo,
        },
        form.profilePicture ? { uri: form.profilePicture, field: 'profilePicture' } : null
      );
      // NO forzamos Content-Type: Axios/RN ponen el boundary multipart.
      const { data } = await authClient.post('/auth/signup-request', formData);
      return { ok: true, data };
    } catch (error) {
      return { ok: false, error: getApiError(error, 'No se pudo crear la cuenta') };
    } finally {
      stopLoading();
    }
  }, []);

  const verifyEmail = useCallback(async (token) => {
    setLoading(true);
    try {
      const { data } = await authClient.post('/auth/verify-email', { token });
      return { ok: true, data };
    } catch (error) {
      return { ok: false, error: getApiError(error, 'No se pudo verificar el correo') };
    } finally {
      stopLoading();
    }
  }, []);

  const resendVerification = useCallback(async (email) => {
    setLoading(true);
    try {
      const { data } = await authClient.post('/auth/resend-verification', { email });
      return { ok: true, data };
    } catch (error) {
      return { ok: false, error: getApiError(error, 'No se pudo reenviar el correo') };
    } finally {
      stopLoading();
    }
  }, []);

  const forgotPassword = useCallback(async (email) => {
    setLoading(true);
    try {
      const { data } = await authClient.post('/auth/forgot-password', { email });
      return { ok: true, data };
    } catch (error) {
      return { ok: false, error: getApiError(error, 'No se pudo enviar el enlace') };
    } finally {
      stopLoading();
    }
  }, []);

  const resetPassword = useCallback(async (token, newPassword) => {
    setLoading(true);
    try {
      const { data } = await authClient.post('/auth/reset-password', { token, newPassword });
      return { ok: true, data };
    } catch (error) {
      return { ok: false, error: getApiError(error, 'No se pudo restablecer la contraseña') };
    } finally {
      stopLoading();
    }
  }, []);

  // Polling silencioso (no toca `loading`, no debe mostrar spinner en el botón).
  // Devuelve el status ('pending'|'used'|'expired'|'invalid') o null si la petición falló.
  const checkResetPasswordStatus = useCallback(async (token) => {
    try {
      const { data } = await authClient.get('/auth/reset-password/status', { params: { token } });
      return data?.data?.status || null;
    } catch {
      return null;
    }
  }, []);

  return {
    loading,
    login,
    register,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    checkResetPasswordStatus,
  };
}
