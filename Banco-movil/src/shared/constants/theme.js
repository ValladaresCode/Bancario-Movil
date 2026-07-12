// Tokens de diseño de la app bancaria. NADA de colores/espaciados hardcodeados
// fuera de este archivo. Paleta replicada del frontend web "KINAL BANC":
// navy de marca #08316d + acento #1a56db, superficies claras y estados tintados.

export const LIGHT_COLORS = {
  // Marca / acento interactivo
  primary: '#1a56db', // acento: botones, links, estados activos
  primaryDark: '#08316d', // navy de marca
  primaryLight: '#E8EFFD', // tinte claro del acento (contenedores de iconos)
  secondary: '#0b4b8f',
  secondaryDark: '#02183f',

  // Navy de marca (para gradientes/hero/headers)
  brandDeep: '#02183f',
  brand: '#08316d',
  brandMid: '#07306a',
  brandBright: '#0b4b8f',
  accentStrong: '#011743',

  // Superficies / fondo
  background: '#f5f6f8',
  surface: '#ffffff',
  surfaceAlt: '#f1f3f7',
  overlay: 'rgba(2, 24, 63, 0.55)',

  // Texto
  text: '#0b0b0b',
  textSecondary: '#334155', // slate-700
  textMuted: 'rgba(15, 23, 42, 0.6)',
  textOnPrimary: '#ffffff',

  // Bordes / divisores
  border: 'rgba(15, 23, 42, 0.12)',
  borderStrong: 'rgba(15, 23, 42, 0.22)',

  // Estados (sistema tintado: texto sólido + fondo 15% + borde 30%)
  success: '#047857', // emerald-700 (montos +, depósitos)
  successBg: 'rgba(16, 185, 129, 0.15)',
  successBorder: 'rgba(16, 185, 129, 0.3)',
  danger: '#be123c', // rose-700 (montos -, errores)
  dangerBg: 'rgba(244, 63, 94, 0.15)',
  dangerBorder: 'rgba(244, 63, 94, 0.3)',
  warning: '#b45309', // amber-800
  warningBg: 'rgba(245, 158, 11, 0.15)',
  warningBorder: 'rgba(245, 158, 11, 0.3)',
  info: '#0369a1', // sky-700
  infoBg: 'rgba(14, 165, 233, 0.15)',
  infoBorder: 'rgba(14, 165, 233, 0.3)',
  neutral: '#334155', // slate
  neutralBg: 'rgba(100, 116, 139, 0.15)',
  neutralBorder: 'rgba(100, 116, 139, 0.3)',

  // Neutrales utilitarios
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const DARK_COLORS = {
  // Marca / acento interactivo (ajustados para dark mode)
  primary: '#3b82f6', // blue-500, más claro para contraste
  primaryDark: '#2563eb', // blue-600
  primaryLight: 'rgba(59, 130, 246, 0.2)',
  secondary: '#60a5fa', // blue-400
  secondaryDark: '#3b82f6', // blue-500

  // Navy de marca - en dark mode se cambian por grises azulados profundos
  brandDeep: '#020617', // slate-950
  brand: '#0f172a', // slate-900
  brandMid: '#1e293b', // slate-800
  brandBright: '#334155', // slate-700
  accentStrong: '#020617',

  // Superficies / fondo
  background: '#161618', // darker background to match mockup
  surface: '#212124', // slightly lighter for cards
  surfaceAlt: '#334155', // slate-700
  overlay: 'rgba(2, 6, 23, 0.7)',

  // Texto
  text: '#f8fafc', // slate-50
  textSecondary: '#94a3b8', // slate-400
  textMuted: 'rgba(248, 250, 252, 0.5)',
  textOnPrimary: '#ffffff',

  // Bordes / divisores
  border: 'rgba(248, 250, 252, 0.1)',
  borderStrong: 'rgba(248, 250, 252, 0.2)',

  // Estados
  success: '#10b981', // emerald-500
  successBg: 'rgba(16, 185, 129, 0.15)',
  successBorder: 'rgba(16, 185, 129, 0.3)',
  danger: '#f43f5e', // rose-500
  dangerBg: 'rgba(244, 63, 94, 0.15)',
  dangerBorder: 'rgba(244, 63, 94, 0.3)',
  warning: '#f59e0b', // amber-500
  warningBg: 'rgba(245, 158, 11, 0.15)',
  warningBorder: 'rgba(245, 158, 11, 0.3)',
  info: '#0ea5e9', // sky-500
  infoBg: 'rgba(14, 165, 233, 0.15)',
  infoBorder: 'rgba(14, 165, 233, 0.3)',
  neutral: '#94a3b8', // slate-400
  neutralBg: 'rgba(148, 163, 184, 0.15)',
  neutralBorder: 'rgba(148, 163, 184, 0.3)',

  // Neutrales utilitarios
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

// Gradientes de marca para <LinearGradient />.
export const GRADIENTS = {
  brand: ['#02183f', '#07306a', '#0b4b8f'], // navbar/headers (horizontal)
  brandLocations: [0, 0.48, 1],
  hero: ['#02183f', '#08316d', '#0b4b8f'], // fondo de login (diagonal)
  balance: ['#08316d', '#1a56db'], // tarjeta de saldo (navy → acento)
  start: { x: 0, y: 0 },
  endHorizontal: { x: 1, y: 0 },
  endDiagonal: { x: 1, y: 1 },
  endVertical: { x: 0, y: 1 },
};

// Familias tipográficas de sistema: SF Pro Display (títulos) y SF Pro Text (cuerpo).
export const FONTS = {
  body: 'SF Pro Text',
  medium: 'SF Pro Text',
  semibold: 'SF Pro Text',
  bold: 'SF Pro Text',
  display: 'SF Pro Display',
  displayBold: 'SF Pro Display',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const FONT_SIZE = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 22,
  xxl: 28,
  xxxl: 34,
};

export const RADIUS = {
  sm: 10,
  md: 12,
  lg: 18, // tarjetas (rounded-[18px] del web)
  xl: 24,
  pill: 999,
};

export const SHADOWS = {
  // Sombra suave grande del web: 0 16px 40px rgba(15,23,42,0.12)
  card: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 4,
  },
  // Sombra ligera para tiles pequeños (shadow-sm).
  subtle: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  floating: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.18,
    shadowRadius: 32,
    elevation: 10,
  },
  // Sombra coloreada navy para tarjetas con gradiente de marca.
  brand: {
    shadowColor: '#08316d',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 10,
  },
};
