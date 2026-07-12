import { useCallback, useMemo } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { LoadingSpinner } from '../../../shared/components';
import { FONTS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { useAuthStore } from '../../../shared/store/authStore';
import { useAccounts } from '../hooks/useAccounts';
import { AccountListItem, BalanceSummaryCard, QuickActions } from '../components';

// Pantalla de inicio: saludo, saldo total, accesos rápidos y lista de cuentas.
// Cada bloque visual vive como componente en ../components.
export function DashboardScreen({ navigation }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const { accounts, loading, refetch } = useAccounts();
  const user = useAuthStore((state) => state.user);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

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
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} tintColor={colors.primary} />}
    >
      <View style={styles.greetingContainer}>
        <Text style={styles.greeting}>Hola, {user?.name || 'Marcos'} </Text>
        <Text style={styles.subGreeting}>Bienvenido de nuevo</Text>
      </View>

      <BalanceSummaryCard totalsByCurrency={totalsByCurrency} accountCount={accounts.length} />

      <QuickActions navigation={navigation} />

      <Text style={styles.sectionTitle}>Mis cuentas</Text>
      {accounts.length === 0 ? (
        <Text style={styles.muted}>Aún no tienes cuentas. Solicita una desde la pestaña Cuentas.</Text>
      ) : (
        accounts.map((acc) => (
          <AccountListItem
            key={acc.numeroCuenta}
            account={acc}
            onPress={() => navigation.navigate('Cuentas', { screen: 'AccountDetail', params: { account: acc } })}
          />
        ))
      )}
    </ScrollView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: SPACING.lg, gap: SPACING.md },
  greetingContainer: { marginBottom: SPACING.xs, gap: 2 },
  greeting: { fontSize: FONT_SIZE.xl, fontFamily: FONTS.bold, color: colors.text },
  subGreeting: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.body, color: colors.textSecondary },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.displayBold,
    fontWeight: '700',
    color: colors.text,
    marginTop: SPACING.sm,
  },
  muted: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.body, color: colors.textMuted },
});
