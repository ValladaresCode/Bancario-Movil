import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Badge, Button, Card, GradientCard } from '../../../shared/components';
import { FONTS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { formatDate } from '../../../shared/utils/format';

export function AccountDetailScreen({ route, navigation }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const account = route?.params?.account;

  function DetailRow({ label, value }) {
    return (
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    );
  }

  if (!account) {
    return (
      <View style={styles.center}>
        <Text style={styles.detailLabel}>Cuenta no disponible.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <GradientCard contentStyle={styles.heroCard}>
        <Text style={styles.heroLabel}>Saldo disponible</Text>
        <Text style={styles.heroSaldo}>{account.saldoFmt}</Text>
        <Badge label={account.estadoLabel} tone={account.estadoTone} />
      </GradientCard>

      <Card>
        <DetailRow label="Número de cuenta" value={account.numeroCuenta} />
        <DetailRow label="Tipo" value={account.tipoLabel} />
        <DetailRow label="Moneda" value={account.moneda} />
        <DetailRow label="Estado" value={account.estadoLabel} />
        <DetailRow label="Creada" value={formatDate(account.createdAt)} />
      </Card>

      <Button
        title="Nueva transacción desde esta cuenta"
        onPress={() =>
          navigation.navigate('Movimientos', {
            screen: 'NewTransaction',
            params: { cuentaOrigen: account.numeroCuenta, moneda: account.moneda },
          })
        }
        style={styles.action}
      />
    </ScrollView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: SPACING.lg, gap: SPACING.md },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  heroCard: { alignItems: 'center', gap: SPACING.sm },
  heroLabel: { color: 'rgba(255,255,255,0.85)', fontFamily: FONTS.medium, fontSize: FONT_SIZE.sm },
  heroSaldo: { color: colors.white, fontSize: FONT_SIZE.xxxl, fontFamily: FONTS.displayBold, fontWeight: '800' },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  detailLabel: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.body, color: colors.textSecondary },
  detailValue: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.semibold, fontWeight: '700', color: colors.text },
  action: { marginTop: SPACING.sm },
});
