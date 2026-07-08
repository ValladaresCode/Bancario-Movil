// Constantes de dominio (copiadas 1:1 de Gestor_Bancario_Frontend para mantener
// los literales exactos que espera el backend). Case-sensitive.

export { SPACING, FONT_SIZE, RADIUS, SHADOWS } from './theme';
export { ENDPOINTS } from './endpoints';

// --- Roles ---
export const ROLES = {
  ADMIN: 'ADMIN_ROLE',
  USER: 'USER_ROLE',
  EMPLOYEE: 'EMPLOYEE_ROLE',
  CLIENT: 'CLIENT_ROLE',
};

// --- Tipos de cuenta ---
export const ACCOUNT_TYPES = {
  AHORRO: 'AHORRO',
  MONETARIA: 'MONETARIA',
};

export const ACCOUNT_TYPE_OPTIONS = [
  { value: ACCOUNT_TYPES.AHORRO, label: 'Cuenta de Ahorro' },
  { value: ACCOUNT_TYPES.MONETARIA, label: 'Cuenta Monetaria' },
];

export const ACCOUNT_TYPE_LABELS = {
  AHORRO: 'Ahorro',
  MONETARIA: 'Monetaria',
};

// --- Monedas ---
export const CURRENCIES = ['GTQ', 'USD', 'EUR', 'MXN', 'COP', 'JPY'];

export const CURRENCY_OPTIONS = [
  { value: 'GTQ', label: 'GTQ — Quetzal' },
  { value: 'USD', label: 'USD — Dólar' },
  { value: 'EUR', label: 'EUR — Euro' },
  { value: 'MXN', label: 'MXN — Peso mexicano' },
  { value: 'COP', label: 'COP — Peso colombiano' },
  { value: 'JPY', label: 'JPY — Yen japonés' },
];

// Monedas con histórico real disponible (Frankfurter/ECB no cubre GTQ ni COP).
// Debe reflejar HISTORY_SUPPORTED_CURRENCIES en Gestor_Bancario_Backend/helpers/currency-logic.js.
export const CURRENCY_HISTORY_SUPPORTED = ['USD', 'EUR', 'MXN', 'JPY'];

// --- Tipos de transacción ---
export const TRANSACTION_TYPES = {
  DEPOSITO: 'DEPOSITO',
  TRANSFERENCIA: 'TRANSFERENCIA',
  RETIRO: 'RETIRO',
};

export const TRANSACTION_TYPE_OPTIONS = [
  { value: TRANSACTION_TYPES.DEPOSITO, label: 'Depósito' },
  { value: TRANSACTION_TYPES.TRANSFERENCIA, label: 'Transferencia' },
  { value: TRANSACTION_TYPES.RETIRO, label: 'Retiro' },
];

// --- Límites del backend (Q) para validación en UI ---
export const TRANSACTION_LIMITS = {
  PER_TRANSACTION: 2000,
  PER_DAY: 10000,
};

// --- Estados genéricos de solicitudes / recursos ---
export const REQUEST_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};
