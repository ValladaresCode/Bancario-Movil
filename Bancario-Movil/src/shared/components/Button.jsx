import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { COLORS, FONTS, FONT_SIZE, GRADIENTS, RADIUS, SPACING } from '../constants/theme';

// Botón reutilizable.
//  variant: 'primary' | 'secondary' | 'ghost' | 'danger'
//  gradient: true → CTA con degradado de marca (solo variant primary)
export function Button({
  title,
  onPress,
  variant = 'primary',
  gradient = false,
  loading = false,
  disabled = false,
  style,
  ...props
}) {
  const isDisabled = disabled || loading;
  const palette = VARIANTS[variant] || VARIANTS.primary;
  const useGradient = gradient && variant === 'primary' && !isDisabled;

  const content = loading ? (
    <ActivityIndicator color={palette.text} />
  ) : (
    <Text style={[styles.label, { color: palette.text }]}>{title}</Text>
  );

  if (useGradient) {
    return (
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        style={({ pressed }) => [styles.shadowPrimary, pressed && styles.pressed, style]}
        {...props}
      >
        <LinearGradient
          colors={GRADIENTS.brand}
          locations={GRADIENTS.brandLocations}
          start={GRADIENTS.start}
          end={GRADIENTS.endHorizontal}
          style={styles.gradient}
        >
          {content}
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: palette.bg, borderColor: palette.border },
        variant === 'primary' && !isDisabled && styles.shadowPrimary,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
      {...props}
    >
      {content}
    </Pressable>
  );
}

const VARIANTS = {
  primary: { bg: COLORS.primary, border: COLORS.primary, text: COLORS.white },
  secondary: { bg: COLORS.surfaceAlt, border: COLORS.border, text: COLORS.primary },
  ghost: { bg: COLORS.transparent, border: COLORS.transparent, text: COLORS.primary },
  danger: { bg: COLORS.danger, border: COLORS.danger, text: COLORS.white },
};

const BASE = {
  height: 52,
  borderRadius: RADIUS.md,
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: SPACING.lg,
};

const styles = StyleSheet.create({
  base: { ...BASE, borderWidth: 1 },
  gradient: { ...BASE },
  pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
  disabled: { opacity: 0.5 },
  shadowPrimary: {
    borderRadius: RADIUS.md,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 6,
  },
  label: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
