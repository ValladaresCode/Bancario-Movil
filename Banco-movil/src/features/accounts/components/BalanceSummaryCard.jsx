import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { FONTS, FONT_SIZE, RADIUS, SHADOWS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { formatCurrency } from '../../../shared/utils/format';

// Tarjeta que muestra el saldo total por moneda.
export function BalanceSummaryCard({ totalsByCurrency, accountCount }) {
  const { colors, isDark } = useThemeStore();
  const styles = createStyles(colors, isDark);

  const gradientColors = isDark 
    ? [colors.surface, colors.surface, 'rgba(59, 130, 246, 0.3)'] 
    : [colors.surface, colors.surface, 'rgba(26, 86, 219, 0.15)'];

  return (
    <View style={styles.shadow}>
      <LinearGradient
        colors={gradientColors}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.balanceTop}>
          <Text style={styles.balanceLabel}>Saldo total</Text>
          <View style={styles.balanceChip}>
            <MaterialIcons name="account-balance-wallet" size={16} color={isDark ? '#cbd5e1' : '#475569'} />
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
        <Text style={styles.balanceSub}>{accountCount} cuenta{accountCount !== 1 ? 's' : ''} activa{accountCount !== 1 ? 's' : ''}</Text>
      </LinearGradient>
    </View>
  );
}

const createStyles = (colors, isDark) => StyleSheet.create({
  shadow: { borderRadius: RADIUS.lg, ...SHADOWS.card },
  card: { borderRadius: RADIUS.lg, padding: SPACING.xl, overflow: 'hidden', gap: SPACING.xs },
  balanceTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xs },
  balanceLabel: {
    color: isDark ? '#cbd5e1' : '#334155',
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.sm,
    letterSpacing: 0.5,
  },
  balanceChip: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.pill,
    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceMain: { color: colors.text, fontSize: FONT_SIZE.xxxl, fontFamily: FONTS.displayBold, fontWeight: '800' },
  balanceSub: { color: isDark ? '#94a3b8' : '#475569', fontFamily: FONTS.body, fontSize: FONT_SIZE.xs, marginTop: SPACING.xs },
});
