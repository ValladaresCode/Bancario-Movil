import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { COLORS, FONTS, FONT_SIZE, RADIUS, SHADOWS, SPACING } from '../constants/theme';

// Spinner centrado a pantalla completa.
export function LoadingSpinner({ message }) {
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      {message ? <Text style={styles.muted}>{message}</Text> : null}
    </View>
  );
}

// Estado vacío para listas (icono en círculo tintado).
export function EmptyState({ icon = 'inbox', title = 'Sin datos', message }) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <MaterialIcons name={icon} size={32} color={COLORS.primary} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      {message ? <Text style={styles.muted}>{message}</Text> : null}
    </View>
  );
}

// Tarjeta contenedora con sombra suave.
export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

// Píldora de estado con color semántico (fondo tintado + texto + borde).
export function Badge({ label, tone = 'info' }) {
  const palette = TONES[tone] || TONES.info;
  return (
    <View style={[styles.badge, { backgroundColor: palette.bg, borderColor: palette.border }]}>
      <Text style={[styles.badgeText, { color: palette.text }]}>{label}</Text>
    </View>
  );
}

const TONES = {
  success: { bg: COLORS.successBg, text: COLORS.success, border: COLORS.successBorder },
  danger: { bg: COLORS.dangerBg, text: COLORS.danger, border: COLORS.dangerBorder },
  warning: { bg: COLORS.warningBg, text: COLORS.warning, border: COLORS.warningBorder },
  info: { bg: COLORS.infoBg, text: COLORS.info, border: COLORS.infoBorder },
  neutral: { bg: COLORS.neutralBg, text: COLORS.neutral, border: COLORS.neutralBorder },
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.background,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxl,
    gap: SPACING.sm,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.displayBold,
    fontWeight: '700',
    color: COLORS.text,
  },
  muted: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.body,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    ...SHADOWS.card,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    paddingHorizontal: SPACING.md,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
