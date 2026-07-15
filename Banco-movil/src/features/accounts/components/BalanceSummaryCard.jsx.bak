import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { GradientCard } from '../../../shared/components';
import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { formatCurrency } from '../../../shared/utils/format';

// Tarjeta con gradiente que muestra el saldo total por moneda.
export function BalanceSummaryCard({ totalsByCurrency, accountCount }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  return (
    <GradientCard contentStyle={styles.balanceInner}>
      <View style={styles.balanceTop}>
        <Text style={styles.balanceLabel}>Saldo total</Text>
        <View style={styles.balanceChip}>
          <MaterialIcons name="account-balance-wallet" size={16} color={colors.white} />
        </View>
      </View>
      {totalsByCurrency.length === 0 ? (
        <Text style={styles.balanceMain}>{formatCurrency(0, 'GTQ')}</Text>
      ) : (
        totalsByCurrency.map(([moneda, total]) => (
          <Text key={moneda} style={styles.balanceMain}>
            {formatCurrency(total, moneda)}
          </Text>
        ))
      )}
      <Text style={styles.balanceSub}>{accountCount} cuenta(s) activas</Text>
    </GradientCard>
  );
}

const createStyles = (colors) => StyleSheet.create({
  balanceInner: { gap: SPACING.xs },
  balanceTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  balanceLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.sm,
    letterSpacing: 0.5,
  },
  balanceChip: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.pill,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceMain: { color: colors.white, fontSize: FONT_SIZE.xxxl, fontFamily: FONTS.displayBold, fontWeight: '800' },
  balanceSub: { color: 'rgba(255,255,255,0.85)', fontFamily: FONTS.body, fontSize: FONT_SIZE.xs, marginTop: SPACING.xs },
});
