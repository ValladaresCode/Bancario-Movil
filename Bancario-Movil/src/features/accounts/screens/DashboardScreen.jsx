import { useMemo } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Card, GradientCard, LoadingSpinner } from '../../../shared/components';
import { COLORS, FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
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

      <GradientCard contentStyle={styles.balanceInner}>
        <View style={styles.balanceTop}>
          <Text style={styles.balanceLabel}>Saldo total</Text>
          <View style={styles.balanceChip}>
            <MaterialIcons name="account-balance-wallet" size={16} color={COLORS.white} />
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
        <Text style={styles.balanceSub}>{accounts.length} cuenta(s) activas</Text>
      </GradientCard>

      <View style={styles.actionsRow}>
        {QUICK_ACTIONS.map((action) => (
          <TouchableOpacity
            key={action.label}
            style={styles.action}
            activeOpacity={0.85}
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
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Cuentas', { screen: 'AccountDetail', params: { account: acc } })}
          >
            <Card style={styles.accountRow}>
              <View style={styles.accountIcon}>
                <MaterialIcons name="credit-card" size={22} color={COLORS.primary} />
              </View>
              <View style={styles.accountInfo}>
                <Text style={styles.accountType}>{acc.tipoLabel}</Text>
                <Text style={styles.muted}>{maskAccountNumber(acc.numeroCuenta)}</Text>
              </View>
              <Text style={styles.accountBalance}>{acc.saldoFmt}</Text>
              <MaterialIcons name="chevron-right" size={22} color={COLORS.textMuted} />
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
  greeting: { fontSize: FONT_SIZE.xl, fontFamily: FONTS.displayBold, fontWeight: '800', color: COLORS.text },

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
  balanceMain: { color: COLORS.white, fontSize: FONT_SIZE.xxxl, fontFamily: FONTS.displayBold, fontWeight: '800' },
  balanceSub: { color: 'rgba(255,255,255,0.85)', fontFamily: FONTS.body, fontSize: FONT_SIZE.xs, marginTop: SPACING.xs },

  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: SPACING.sm },
  action: { alignItems: 'center', gap: SPACING.xs, flex: 1 },
  actionIcon: {
    width: 58,
    height: 58,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, fontFamily: FONTS.semibold, fontWeight: '600' },

  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.displayBold,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.sm,
  },
  accountRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  accountIcon: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountInfo: { flex: 1 },
  accountType: { fontSize: FONT_SIZE.md, fontFamily: FONTS.semibold, fontWeight: '700', color: COLORS.text },
  accountBalance: { fontSize: FONT_SIZE.md, fontFamily: FONTS.bold, fontWeight: '800', color: COLORS.primary },
  muted: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.body, color: COLORS.textMuted },
});
