import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Badge, Button, Card, EmptyState, LoadingSpinner } from '../../../shared/components';
import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { maskAccountNumber } from '../../../shared/utils/format';
import { useAccounts } from '../hooks/useAccounts';

export function AccountsScreen({ navigation }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const { accounts, loading, error, refetch } = useAccounts();

  // Navega a Nueva Transacción con esta cuenta precargada como ORIGEN.
  const goTransfer = (item) =>
    navigation.navigate('Movimientos', {
      screen: 'NewTransaction',
      params: { cuentaOrigen: String(item.numeroCuenta), moneda: item.moneda },
    });

  if (loading && accounts.length === 0) {
    return <LoadingSpinner message="Cargando cuentas..." />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={accounts}
        keyExtractor={(item) => String(item.numeroCuenta)}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} tintColor={colors.primary} />}
        ListHeaderComponent={
          <Button
            title="Solicitar nueva cuenta"
            gradient
            style={styles.requestBtn}
            onPress={() => navigation.navigate('RequestAccount')}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="account-balance-wallet"
            title="Sin cuentas"
            message={error || 'Aún no tienes cuentas. Solicita una para comenzar.'}
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('AccountDetail', { account: item })}>
            <Card style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.row}>
                  <View style={styles.iconCircle}>
                    <MaterialIcons name="account-balance" size={22} color={colors.primary} />
                  </View>
                  <Text style={styles.tipo}>{item.tipoLabel}</Text>
                </View>
                <Badge label={item.estadoLabel} tone={item.estadoTone} />
              </View>
              <Text style={styles.numero}>{maskAccountNumber(item.numeroCuenta)}</Text>
              <Text style={styles.saldoLabel}>Saldo disponible</Text>
              <Text style={styles.saldo}>{item.saldoFmt}</Text>

              {/* Zona "Transferir" en la esquina inferior derecha: redirige a Nueva
                  Transacción con esta cuenta como origen. */}
              <View style={styles.footer}>
                <TouchableOpacity
                  style={styles.transferZone}
                  onPress={() => goTransfer(item)}
                  activeOpacity={0.7}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <MaterialIcons name="swap-horiz" size={18} color={colors.primary} />
                  <Text style={styles.transferText}>Transferir</Text>
                </TouchableOpacity>
              </View>
            </Card>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: SPACING.lg, gap: SPACING.md },
  requestBtn: { marginBottom: SPACING.sm },
  card: { gap: SPACING.xs },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipo: { fontSize: FONT_SIZE.md, fontFamily: FONTS.semibold, fontWeight: '700', color: colors.text },
  numero: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.body, color: colors.textSecondary, marginTop: SPACING.xs },
  saldoLabel: { fontSize: FONT_SIZE.xs, fontFamily: FONTS.medium, color: colors.textMuted, marginTop: SPACING.sm },
  saldo: { fontSize: FONT_SIZE.xxl, fontFamily: FONTS.displayBold, fontWeight: '800', color: colors.text },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  transferZone: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.pill,
  },
  transferText: { color: colors.primary, fontFamily: FONTS.bold, fontWeight: '700', fontSize: FONT_SIZE.sm },
});
