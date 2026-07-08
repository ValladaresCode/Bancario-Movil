import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Card } from '../../../shared/components';
import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { useCurrencyHistory } from '../hooks/useCurrencyHistory';
import { Sparkline } from './Sparkline';

// Fila de tasa de cambio. Cuando `chartable`, trae su propio histórico de 30 días
// y muestra un mini-sparkline (sin agrandar la card); tocarlo abre el modal ampliado.
export function CurrencyRateCard({ code, value, base, chartable, onPressChart }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const { points } = useCurrencyHistory(base, code, chartable);

  const trendUp = points.length >= 2 ? points[points.length - 1].rate >= points[0].rate : true;
  const trendColor = trendUp ? colors.success : colors.danger;
  const hasChart = chartable && points.length >= 2;

  return (
    <Card style={styles.rateRow}>
      <View style={styles.codeWrap}>
        <View style={styles.iconCircle}>
          <MaterialIcons name="currency-exchange" size={18} color={colors.primary} />
        </View>
        <Text style={styles.code}>{code}</Text>
      </View>

      <View style={styles.right}>
        {hasChart ? (
          <Pressable
            onPress={() => onPressChart({ base, target: code })}
            hitSlop={8}
            style={styles.chartPressable}
          >
            <MaterialIcons name={trendUp ? 'trending-up' : 'trending-down'} size={16} color={trendColor} />
            <Sparkline points={points} color={trendColor} />
          </Pressable>
        ) : null}
        <Text style={styles.value}>{value}</Text>
      </View>
    </Card>
  );
}

const createStyles = (colors) => StyleSheet.create({
  rateRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  codeWrap: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.pill,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  code: { fontSize: FONT_SIZE.lg, fontFamily: FONTS.bold, fontWeight: '800', color: colors.text },
  right: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  chartPressable: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  value: { fontSize: FONT_SIZE.lg, fontFamily: FONTS.semibold, fontWeight: '700', color: colors.primary },
});
