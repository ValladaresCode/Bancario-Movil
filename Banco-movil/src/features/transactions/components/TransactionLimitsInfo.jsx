import { StyleSheet, Text, View } from 'react-native';

import { TRANSACTION_LIMITS } from '../../../shared/constants';
import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { formatCurrency } from '../../../shared/utils/format';

// Recuadro informativo con los límites de transferencia vigentes.
export function TransactionLimitsInfo() {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  return (
    <View style={styles.limitsBox}>
      <Text style={styles.limitsTitle}>Límites de transferencia</Text>
      <Text style={styles.limitsItem}>
        • Máximo {formatCurrency(TRANSACTION_LIMITS.PER_TRANSACTION, 'GTQ')} por transacción
      </Text>
      <Text style={styles.limitsItem}>
        • Máximo {formatCurrency(TRANSACTION_LIMITS.PER_DAY, 'GTQ')} por día
      </Text>
      <Text style={styles.limitsItem}>
        • No puede exceder el saldo disponible de la cuenta origen
      </Text>
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  limitsBox: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  limitsTitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.semibold,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: SPACING.sm,
  },
  limitsItem: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.body,
    color: colors.textMuted,
    lineHeight: 18,
  },
});
