// Servicio PURO del payload QR de cuenta. Sin React ni React Native: solo
// construcción, parseo y validación del contenido del QR. Testeable en Node.
//
// Formato (JSON compacto y versionado, NO secreto):
//   { v: 1, t: 'pay', c: '<numeroCuenta>', k: 'AHORRO' | 'MONETARIA' }
// El número de cuenta es un identificador de recepción público (como un IBAN);
// la seguridad real vive en la revalidación server-side de la transferencia.

export const QR_VERSION = 1;
const VALID_TIPOS = ['AHORRO', 'MONETARIA'];
// Numérico y hasta 10 dígitos (coincide con maxlength de account.model.js).
const ACCOUNT_NUMBER_RE = /^\d{1,10}$/;

// Error tipado: distingue "QR inválido/ajeno" de fallos aguas arriba (red, 404…).
export class InvalidQRError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidQRError';
  }
}

// node-qrcode (usado por react-native-qrcode-svg) requiere TextEncoder. En vez
// de un polyfill global en el entry point (contamina el entorno y puede chocar
// con React 19 / Hermes de RN 0.83), lo resolvemos aislado aquí: si el motor ya
// lo trae, no se toca; si falta, se define una vez, de forma idempotente. Nada
// fuera de este módulo depende de este side-effect.
export const ensureTextEncoder = () => {
  if (typeof globalThis.TextEncoder !== 'undefined') return;
  globalThis.TextEncoder = class TextEncoderPolyfill {
    encode(str = '') {
      // UTF-8 mínimo, suficiente para el contenido del QR (JSON ASCII/latino).
      const utf8 = unescape(encodeURIComponent(str));
      const bytes = new Uint8Array(utf8.length);
      for (let i = 0; i < utf8.length; i += 1) bytes[i] = utf8.charCodeAt(i);
      return bytes;
    }
  };
};

// Construye el string que se codifica en el QR de "mi cuenta".
export const buildAccountQR = ({ numeroCuenta, tipoCuenta } = {}) => {
  const c = String(numeroCuenta ?? '').trim();
  const k = String(tipoCuenta ?? '')
    .trim()
    .toUpperCase();
  if (!ACCOUNT_NUMBER_RE.test(c)) {
    throw new InvalidQRError('Número de cuenta inválido para generar el QR.');
  }
  if (!VALID_TIPOS.includes(k)) {
    throw new InvalidQRError('Tipo de cuenta inválido para generar el QR.');
  }
  return JSON.stringify({ v: QR_VERSION, t: 'pay', c, k });
};

// Parsea y valida un QR escaneado. Lanza InvalidQRError si el QR no es de esta
// app o está corrupto. Devuelve { numeroCuenta, tipoCuenta }.
export const parseAccountQR = (raw) => {
  if (typeof raw !== 'string' || !raw.trim()) {
    throw new InvalidQRError('QR vacío o ilegible.');
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new InvalidQRError('El QR no pertenece a esta aplicación.');
  }

  if (!data || typeof data !== 'object') {
    throw new InvalidQRError('El QR no pertenece a esta aplicación.');
  }
  if (data.v !== QR_VERSION || data.t !== 'pay') {
    throw new InvalidQRError('Versión de QR no compatible.');
  }

  const numeroCuenta = String(data.c ?? '').trim();
  const tipoCuenta = String(data.k ?? '')
    .trim()
    .toUpperCase();

  if (!ACCOUNT_NUMBER_RE.test(numeroCuenta)) {
    throw new InvalidQRError('El QR no contiene un número de cuenta válido.');
  }
  if (!VALID_TIPOS.includes(tipoCuenta)) {
    throw new InvalidQRError('El QR no contiene un tipo de cuenta válido.');
  }

  return { numeroCuenta, tipoCuenta };
};
