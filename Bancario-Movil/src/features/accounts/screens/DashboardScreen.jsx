import { useMemo } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Card, LoadingSpinner } from '../../../shared/components';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useAuthStore } from '../../../shared/store/authStore';
import { formatCurrency, maskAccountNumber } from '../../../shared/utils/format';
import { useAccounts } from '../hooks/useAccounts';

const QUICK_ACTIONS = [
  { icon: 'swap-horiz', label: 'Transferir', tab: 'Movimientos', screen: 'NewTransaction' },
  { icon: 'star', label: 'Favoritos', tab: 'Perfil', screen: 'Favorites' },
  { icon: 'local-offer', label: 'Servicios', tab: 'Servicios', screen: 'Services' },
  { icon: 'currency-exchange', label: 'Divisas', tab: 'Perfil', screen: 'Currencies' },
];

export function DashboardScreen({ navigation }) {
  const { accounts, loading, refetch } = useAccounts();
  const user = useAuthStore((state) => state.user);

  // Totales por moneda (no se pueden sumar monedas distintas).
  const totalsByCurrency = useMemo(() => {
    const map = {};
    accounts.forEach((acc) => {
      map[acc.moneda] = (map[acc.moneda] || 0) + acc.saldo;
    });
    return Object.entries(map);
  }, [accounts]);

  if (loading && accounts.length === 0) {
    return <LoadingSpinner message="Cargando tu resumen..." />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} tintColor={COLORS.primary} />}
    >
      <Text style={styles.greeting}>Hola, {user?.name || 'cliente'} 👋</Text>

      <Card style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Saldo total</Text>
        {totalsByCurrency.length === 0 ? (
          <Text style={styles.balanceMain}>{formatCurrency(0, 'GTQ')}</Text>
        ) : (
          totalsByCurrency.map(([moneda, total]) => (
            <Text key={moneda} style={styles.balanceMain}>
              {formatCurrency(total, moneda)}
            </Text>
          ))
        )}
        <Text style={styles.balanceSub}>{accounts.length} cuenta(s)</Text>
      </Card>

      <View style={styles.actionsRow}>
        {QUICK_ACTIONS.map((action) => (
          <TouchableOpacity
            key={action.label}
            style={styles.action}
            onPress={() => navigation.navigate(action.tab, { screen: action.screen })}
          >
            <View style={styles.actionIcon}>
              <MaterialIcons name={action.icon} size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Mis cuentas</Text>
      {accounts.length === 0 ? (
        <Text style={styles.muted}>Aún no tienes cuentas. Solicita una desde la pestaña Cuentas.</Text>
      ) : (
        accounts.map((acc) => (
          <TouchableOpacity
            key={acc.numeroCuenta}
            onPress={() => navigation.navigate('Cuentas', { screen: 'AccountDetail', params: { account: acc } })}
          >
            <Card style={styles.accountRow}>
              <View>
                <Text style={styles.accountType}>{acc.tipoLabel}</Text>
                <Text style={styles.muted}>{maskAccountNumber(acc.numeroCuenta)}</Text>
              </View>
              <Text style={styles.accountBalance}>{acc.saldoFmt}</Text>
            </Card>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, gap: SPACING.md },
  greeting: { fontSize: FONT_SIZE.xl, fontWeight: '800', color: COLORS.text },
  balanceCard: { backgroundColor: COLORS.primary, gap: SPACING.xs },
  balanceLabel: { color: COLORS.white, opacity: 0.85, fontSize: FONT_SIZE.sm },
  balanceMain: { color: COLORS.white, fontSize: FONT_SIZE.xxxl, fontWeight: '800' },
  balanceSub: { color: COLORS.white, opacity: 0.85, fontSize: FONT_SIZE.xs, marginTop: SPACING.xs },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  action: { alignItems: 'center', gap: SPACING.xs, flex: 1 },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, fontWeight: '600' },
  sectionTitle: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.text, marginTop: SPACING.sm },
  accountRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  accountType: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text },
  accountBalance: { fontSize: FONT_SIZE.lg, fontWeight: '800', color: COLORS.primary },
  muted: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted },
});
