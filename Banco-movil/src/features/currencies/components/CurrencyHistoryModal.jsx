import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { LoadingSpinner } from '../../../shared/components';
import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { formatDate } from '../../../shared/utils/format';
import { useCurrencyHistory } from '../hooks/useCurrencyHistory';
import { Sparkline } from './Sparkline';

// Vista ampliada de una gráfica de divisa. pair=null la mantiene cerrada.
// pair = { base, target }. Sigue el mismo patrón que EditAliasModal.
export function CurrencyHistoryModal({ pair, onClose }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const { points, loading, error } = useCurrencyHistory(pair?.base, pair?.target, !!pair);

  const first = points[0];
  const last = points[points.length - 1];
  const trendUp = first && last ? last.rate >= first.rate : true;
  const trendColor = trendUp ? colors.success : colors.danger;

  return (
    <Modal visible={!!pair} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        {/* Pressable interior evita que el toque dentro de la tarjeta cierre el modal */}
        <Pressable style={styles.sheet}>
          <Text style={styles.title}>{pair?.base} / {pair?.target}</Text>
          <Text style={styles.subtitle}>Últimos 30 días</Text>

          {loading ? (
            <LoadingSpinner message="Cargando histórico..." />
          ) : points.length < 2 ? (
            <Text style={styles.empty}>{error || 'Sin datos suficientes para graficar.'}</Text>
          ) : (
            <>
              <View style={styles.chartWrap}>
                <Sparkline points={points} color={trendColor} width={272} height={140} strokeWidth={2.5} filled />
              </View>
              <View style={styles.range}>
                <Text style={styles.rangeText}>
                  {formatDate(first.date)} · {first.rate.toFixed(4)}
                </Text>
                <Text style={[styles.rangeText, styles.rangeTextEnd, { color: trendColor }]}>
                  {formatDate(last.date)} · {last.rate.toFixed(4)}
                </Text>
              </View>
            </>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const createStyles = (colors) => StyleSheet.create({
  overlay: { flex: 1, backgroundColor: colors.overlay || 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: SPACING.xl },
  sheet: {
    backgroundColor: colors.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: SPACING.lg,
  },
  title: { fontSize: FONT_SIZE.lg, fontFamily: FONTS.displayBold, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: FONT_SIZE.xs, fontFamily: FONTS.body, color: colors.textSecondary, marginTop: SPACING.xs, marginBottom: SPACING.md },
  empty: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.body, color: colors.textSecondary, textAlign: 'center', paddingVertical: SPACING.xl },
  chartWrap: { alignItems: 'center', marginVertical: SPACING.sm },
  range: { flexDirection: 'row', justifyContent: 'space-between', marginTop: SPACING.sm },
  rangeText: { fontSize: FONT_SIZE.xs, fontFamily: FONTS.medium, color: colors.textSecondary },
  rangeTextEnd: { fontFamily: FONTS.bold, fontWeight: '700' },
});
