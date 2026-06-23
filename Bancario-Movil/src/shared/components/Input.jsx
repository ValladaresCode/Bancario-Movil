import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { COLORS, FONTS, FONT_SIZE, RADIUS, SPACING } from '../constants/theme';

// Wrapper de TextInput con label, error e icono opcional.
// Reenvía ...props (secureTextEntry, keyboardType, etc.).
export function Input({ label, error, leftIcon, style, ...props }) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.wrapper, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.field, focused && styles.fieldFocused, error && styles.fieldError]}>
        {leftIcon ? (
          <MaterialIcons
            name={leftIcon}
            size={20}
            color={focused ? COLORS.primary : COLORS.textMuted}
            style={styles.icon}
          />
        ) : null}
        <TextInput
          placeholderTextColor={COLORS.textMuted}
          style={styles.input}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: SPACING.lg },
  label: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.semibold,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.surfaceAlt,
  },
  fieldFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
  },
  fieldError: { borderColor: COLORS.danger },
  icon: { marginRight: SPACING.sm },
  input: {
    flex: 1,
    height: '100%',
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.body,
    color: COLORS.text,
    // react-native-web: quita el outline azul del navegador al enfocar.
    outlineStyle: 'none',
  },
  error: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.danger,
    marginTop: SPACING.xs,
  },
});
