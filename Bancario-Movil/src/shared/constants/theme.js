// Tokens de diseño de la app bancaria. NADA de colores/espaciados hardcodeados
// fuera de este archivo. Paleta basada en el primario #208AEF (splash de app.json).

export const COLORS = {
  // Marca
  primary: '#208AEF',
  primaryDark: '#1565C0',
  primaryLight: '#E6F4FE',
  secondary: '#00C2A8',
  secondaryDark: '#009B86',

  // Superficies / fondo
  background: '#F4F6FA',
  surface: '#FFFFFF',
  surfaceAlt: '#EEF2F7',
  overlay: 'rgba(16, 24, 40, 0.45)',

  // Texto
  text: '#1A2233',
  textSecondary: '#60646C',
  textMuted: '#8A93A6',
  textOnPrimary: '#FFFFFF',

  // Bordes / divisores
  border: '#E0E4EB',
  borderStrong: '#C9D0DB',

  // Estados
  success: '#1FAE63',
  successBg: '#E3F7EC',
  danger: '#E5484D',
  dangerBg: '#FCE9E9',
  warning: '#F5A623',
  warningBg: '#FDF1DC',
  info: '#208AEF',
  infoBg: '#E6F4FE',

  // Neutrales utilitarios (bug del ref: faltaba white)
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
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
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
};

export const SHADOWS = {
  card: {
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  floating: {
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 8,
  },
};
