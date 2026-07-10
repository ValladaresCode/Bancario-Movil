import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Card } from '../../../shared/components';
import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { maskAccountNumber } from '../../../shared/utils/format';

// Fila de una cuenta: tipo, número enmascarado y saldo, con navegación al detalle.
export function AccountListItem({ account, onPress }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <Card style={styles.accountRow}>
        <View style={styles.accountIcon}>
          <MaterialIcons name="credit-card" size={22} color={colors.primary} />
        </View>
        <View style={styles.accountInfo}>
          <Text style={styles.accountType}>{account.tipoLabel}</Text>
          <Text style={styles.muted}>{maskAccountNumber(account.numeroCuenta)}</Text>
        </View>
        <Text style={styles.accountBalance}>{account.saldoFmt}</Text>
        <MaterialIcons name="chevron-right" size={22} color={colors.textMuted} />
      </Card>
    </TouchableOpacity>
  );
}

const createStyles = (colors) => StyleSheet.create({
  accountRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  accountIcon: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountInfo: { flex: 1 },
  accountType: { fontSize: FONT_SIZE.md, fontFamily: FONTS.semibold, fontWeight: '700', color: colors.text },
  accountBalance: { fontSize: FONT_SIZE.md, fontFamily: FONTS.bold, fontWeight: '800', color: colors.primary },
  muted: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.body, color: colors.textMuted },
});
