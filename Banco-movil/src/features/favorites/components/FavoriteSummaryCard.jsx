import { StyleSheet, Text } from 'react-native';

import { GradientCard } from '../../../shared/components';
import { FONTS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { maskAccountNumber } from '../../../shared/utils/format';

// Encabezado con gradiente que muestra el destino de la transferencia rápida.
export function FavoriteSummaryCard({ favorite }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  return (
    <GradientCard contentStyle={styles.card}>
      <Text style={styles.label}>Transferir a</Text>
      <Text style={styles.alias}>{favorite.alias}</Text>
      <Text style={styles.cuenta}>
        {maskAccountNumber(favorite.cuenta)} · {favorite.tipo}
      </Text>
    </GradientCard>
  );
}

const createStyles = (colors) => StyleSheet.create({
  card: { gap: SPACING.xs },
  label: { color: colors.white, opacity: 0.85, fontSize: FONT_SIZE.sm, fontFamily: FONTS.medium },
  alias: { color: colors.white, fontSize: FONT_SIZE.xl, fontFamily: FONTS.displayBold, fontWeight: '800' },
  cuenta: { color: colors.white, opacity: 0.9, fontSize: FONT_SIZE.sm, fontFamily: FONTS.body },
});
