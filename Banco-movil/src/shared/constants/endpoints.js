// URLs base leídas de variables EXPO_PUBLIC_* (.env) con fallback a localhost.
// En dispositivo físico SIEMPRE usar la IP LAN del backend (no localhost).

const resolveUrl = (preferred, legacy, fallback) => {
  const value = preferred || legacy || fallback;
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
};

export const ENDPOINTS = {
  AUTH: resolveUrl(process.env.EXPO_PUBLIC_AUTH_URL, process.env.EXPO_PUBLIC_AUTH_BASE_URL, 'http://localhost:4000/api/v1'),
  BANK: resolveUrl(process.env.EXPO_PUBLIC_BANK_URL, process.env.EXPO_PUBLIC_BANKING_URL, 'http://localhost:3006/gestionBancaria/api/v1'),
  BANK_HEALTH: resolveUrl(process.env.EXPO_PUBLIC_BANK_HEALTH_URL, process.env.EXPO_PUBLIC_BANKING_HEALTH_URL, 'http://localhost:3006/health'),
};
