// URLs base leídas de variables EXPO_PUBLIC_* (.env) con fallback a localhost.
// En dispositivo físico SIEMPRE usar la IP LAN del backend (no localhost).

export const ENDPOINTS = {
  AUTH: process.env.EXPO_PUBLIC_AUTH_URL || 'http://localhost:4000/api/v1',
  BANK: process.env.EXPO_PUBLIC_BANK_URL || 'http://localhost:3006/gestionBancaria/api/v1',
  BANK_HEALTH: process.env.EXPO_PUBLIC_BANK_HEALTH_URL || 'http://localhost:3006/health',
};
