import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { COLORS, FONT_SIZE, RADIUS, SHADOWS, SPACING } from '../constants/theme';

// Spinner centrado a pantalla completa.
export function LoadingSpinner({ message }) {
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      {message ? <Text style={styles.muted}>{message}</Text> : null}
    </View>
  );
}

// Estado vacío para listas.
export function EmptyState({ icon = 'inbox', title = 'Sin datos', message }) {
  return (
    <View style={styles.empty}>
      <MaterialIcons name={icon} size={48} color={COLORS.textMuted} />
      <Text style={styles.emptyTitle}>{title}</Text>
      {message ? <Text style={styles.muted}>{message}</Text> : null}
    </View>
  );
}

// Tarjeta contenedora con sombra.
export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

// Píldora de estado con color semántico.
export function Badge({ label, tone = 'info' }) {
  const palette = TONES[tone] || TONES.info;
  return (
    <View style={[styles.badge, { backgroundColor: palette.bg }]}>
      <Text style={[styles.badgeText, { color: palette.text }]}>{label}</Text>
    </View>
  );
}

const TONES = {
  success: { bg: COLORS.successBg, text: COLORS.success },
  danger: { bg: COLORS.dangerBg, text: COLORS.danger },
  warning: { bg: COLORS.warningBg, text: COLORS.warning },
  info: { bg: COLORS.infoBg, text: COLORS.info },
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
  emptyTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.sm,
  },
  muted: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.card,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  badgeText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
  },
});
