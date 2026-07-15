import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';

import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../constants/theme';
import { useThemeStore } from '../hooks/useThemeStore';

const pad = (n) => String(n).padStart(2, '0');
// 'YYYY-MM-DD' en hora LOCAL (no toISOString, que puede correr un día en
// UTC-6 si se usara medianoche local). Es el formato que espera el backend.
const toISODate = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const parseISODate = (value) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }
  const [y, m, d] = value.split('-').map(Number);
  const parsed = new Date(y, m - 1, d);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

// Máximo 18 años atrás desde hoy (coincide con la validación 18+ del backend);
// mínimo una fecha razonable para evitar el "wheel" infinito de años.
const today = new Date();
const MAX_DATE = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
const MIN_DATE = new Date(today.getFullYear() - 100, 0, 1);

// Selector de fecha nativo (calendario del sistema), sin tipeo libre. Expone
// el mismo contrato que Input (value: string 'YYYY-MM-DD', onChangeText) para
// enchufarse directo en FormField sin tocar react-hook-form.
export function DateField({ label, error, leftIcon = 'event', value, onChangeText, placeholder }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const [showIOS, setShowIOS] = useState(false);

  const selectedDate = parseISODate(value) || MAX_DATE;

  const handlePick = (event, date) => {
    setShowIOS(Platform.OS === 'ios' && event?.type !== 'dismissed');
    if (event?.type === 'dismissed' || !date) return;
    onChangeText(toISODate(date));
  };

  const open = () => {
    if (Platform.OS === 'android') {
      // API imperativa: la recomendada por la librería para Android (el
      // diálogo nativo se abre y cierra solo).
      DateTimePickerAndroid.open({
        value: selectedDate,
        mode: 'date',
        maximumDate: MAX_DATE,
        minimumDate: MIN_DATE,
        onChange: handlePick,
      });
    } else {
      setShowIOS(true);
    }
  };

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Pressable
        onPress={open}
        style={[styles.field, error && styles.fieldError]}
      >
        <MaterialIcons name={leftIcon} size={20} color={colors.textMuted} style={styles.icon} />
        <Text style={value ? styles.value : styles.placeholder}>
          {value || placeholder || 'Selecciona una fecha'}
        </Text>
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {Platform.OS === 'ios' && showIOS ? (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="spinner"
          maximumDate={MAX_DATE}
          minimumDate={MIN_DATE}
          onChange={handlePick}
        />
      ) : null}
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  wrapper: { marginBottom: SPACING.lg },
  label: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.semibold,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: SPACING.xs,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    backgroundColor: colors.surfaceAlt,
  },
  fieldError: { borderColor: colors.danger },
  icon: { marginRight: SPACING.sm },
  value: { fontSize: FONT_SIZE.md, fontFamily: FONTS.body, color: colors.text },
  placeholder: { fontSize: FONT_SIZE.md, fontFamily: FONTS.body, color: colors.textMuted },
  error: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: colors.danger,
    marginTop: SPACING.xs,
  },
});
