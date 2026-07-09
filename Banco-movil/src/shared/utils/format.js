// Utilidades de formato (es-GT) — portadas de Gestor_Bancario_Frontend.

export const formatCurrency = (amount, currency = 'GTQ') => {
  if (amount === undefined || amount === null || Number.isNaN(Number(amount))) {
    return 'N/D';
  }
  try {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(amount));
  } catch {
    // Algunas monedas pueden no estar soportadas por el runtime; fallback simple.
    return `${currency} ${Number(amount).toFixed(2)}`;
  }
};

export const formatNumber = (amount) => {
  if (amount === undefined || amount === null || Number.isNaN(Number(amount))) {
    return 'N/D';
  }
  return new Intl.NumberFormat('es-GT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount));
};

export const formatDate = (value) => {
  if (!value) return 'N/D';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/D';
  return date.toLocaleDateString('es-GT', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const formatDateTime = (value) => {
  if (!value) return 'N/D';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/D';
  return date.toLocaleString('es-GT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Enmascara una cuenta dejando visibles los últimos 4 dígitos.
export const maskAccountNumber = (value) => {
  if (!value) return 'N/D';
  const str = String(value);
  if (str.length <= 4) return str;
  return `•••• ${str.slice(-4)}`;
};

export const getOptionLabel = (value, options = []) => {
  const match = options.find((option) => option.value === value);
  return match?.label || value || 'N/D';
};

// Normaliza para búsqueda: minúsculas, sin acentos, sin espacios.
const DIACRITICS_REGEX = new RegExp('[\\u0300-\\u036f]', 'g');

export const normalizeText = (value) => {
  return String(value || '')
    .normalize('NFD')
    .replace(DIACRITICS_REGEX, '')
    .toLowerCase()
    .replace(/\s+/g, '')
    .trim();
};
