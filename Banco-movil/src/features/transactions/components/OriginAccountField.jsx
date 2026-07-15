import { StyleSheet, Text, View } from 'react-native';

import { Selector } from '../../../shared/components';
import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';

// Selector de cuenta de origen con el saldo disponible de la cuenta elegida.
export function OriginAccountField({ accountOptions, selectedAccount, value, onChange }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  if (accountOptions.length === 0) {
    return <Text style={styles.warn}>No tienes cuentas disponibles como origen.</Text>;
  }

  return (
    <>
      <Selector label="Cuenta de origen" options={accountOptions} value={value} onChange={onChange} />
      {selectedAccount ? (
        <View style={styles.balanceRow}>
          <Text style={styles.balanceLabel}>Saldo disponible</Text>
          <Text style={styles.balanceValue}>{selectedAccount.saldoFmt}</Text>
        </View>
      ) : null}
    </>
  );
}

const createStyles = (colors) => StyleSheet.create({
  warn: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.medium,
    color: colors.warning,
    marginBottom: SPACING.lg,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: colors.primaryLight,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.lg,
  },
  balanceLabel: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.semibold,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  balanceValue: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    fontWeight: '800',
    color: colors.primary,
  },
});
