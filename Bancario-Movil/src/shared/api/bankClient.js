import axios from 'axios';

import { ENDPOINTS } from '../constants/endpoints';
import { useAuthStore } from '../store/authStore';

// Cliente del Gestor Bancario (:3006/gestionBancaria/api/v1): cuentas, transacciones,
// favoritos, servicios, promociones, divisas, chatbot.
const bankClient = axios.create({
  baseURL: ENDPOINTS.BANK,
  timeout: 30000, // el chatbot (Gemini) puede tardar; el resto responde mucho antes.
});

bankClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers['x-token'] = token;
  }
  return config;
});

bankClient.interceptors.response.use(
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

export default bankClient;
