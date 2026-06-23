import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Badge, Button, Card } from '../../../shared/components';
import { COLORS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';
import { formatDate } from '../../../shared/utils/format';

function DetailRow({ label, value }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

export function AccountDetailScreen({ route, navigation }) {
  const account = route?.params?.account;

  if (!account) {
    return (
      <View style={styles.center}>
        <Text style={styles.detailLabel}>Cuenta no disponible.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.heroCard}>
        <Text style={styles.heroLabel}>Saldo disponible</Text>
        <Text style={styles.heroSaldo}>{account.saldoFmt}</Text>
        <Badge label={account.estadoLabel} tone={account.estadoTone} />
      </Card>

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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, gap: SPACING.md },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background },
  heroCard: { alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary },
  heroLabel: { color: COLORS.white, opacity: 0.85, fontSize: FONT_SIZE.sm },
  heroSaldo: { color: COLORS.white, fontSize: FONT_SIZE.xxxl, fontWeight: '800' },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  detailLabel: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary },
  detailValue: { fontSize: FONT_SIZE.sm, fontWeight: '700', color: COLORS.text },
  action: { marginTop: SPACING.sm },
});
