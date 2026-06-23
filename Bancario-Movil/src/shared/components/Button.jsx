import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { COLORS, FONT_SIZE, RADIUS, SPACING } from '../constants/theme';

// Botón reutilizable. variant: 'primary' | 'secondary' | 'ghost' | 'danger'.
export function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  ...props
}) {
  const isDisabled = disabled || loading;
  const palette = VARIANTS[variant] || VARIANTS.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: palette.bg, borderColor: palette.border },
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={palette.text} />
      ) : (
        <Text style={[styles.label, { color: palette.text }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const VARIANTS = {
  primary: { bg: COLORS.primary, border: COLORS.primary, text: COLORS.white },
  secondary: { bg: COLORS.surfaceAlt, border: COLORS.border, text: COLORS.primary },
  ghost: { bg: COLORS.transparent, border: COLORS.transparent, text: COLORS.primary },
  danger: { bg: COLORS.danger, border: COLORS.danger, text: COLORS.white },
};

const styles = StyleSheet.create({
  base: {
    height: 50,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.5 },
  label: { fontSize: FONT_SIZE.md, fontWeight: '700' },
});
