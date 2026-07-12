import axios from 'axios';

import { ENDPOINTS } from '../constants/endpoints';
import { useAuthStore } from '../store/authStore';

// Cliente del AuthService (:4000/api/v1): login, registro, verificación, perfil.
const authClient = axios.create({
  baseURL: ENDPOINTS.AUTH,
  timeout: 8000,
});

// Request: inyecta el token en los DOS headers que exige el backend.
authClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers['x-token'] = token;
  }
  return config;
});

// Response: en 401 cerramos sesión (NO hay refresh-token). Propaga mensaje legible.
authClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    error.readableMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Ocurrió un error de red';
    return Promise.reject(error);
  }
);

export default authClient;
