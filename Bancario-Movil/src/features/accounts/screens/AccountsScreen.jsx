import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Badge, Button, Card, EmptyState, LoadingSpinner } from '../../../shared/components';
import { COLORS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';
import { maskAccountNumber } from '../../../shared/utils/format';
import { useAccounts } from '../hooks/useAccounts';

export function AccountsScreen({ navigation }) {
  const { accounts, loading, error, refetch } = useAccounts();

  if (loading && accounts.length === 0) {
    return <LoadingSpinner message="Cargando cuentas..." />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={accounts}
        keyExtractor={(item) => String(item.numeroCuenta)}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} tintColor={COLORS.primary} />}
        ListHeaderComponent={
          <Button
            title="+ Solicitar nueva cuenta"
            variant="secondary"
            onPress={() => navigation.navigate('RequestAccount')}
            style={styles.requestBtn}
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
                  <MaterialIcons name="account-balance" size={20} color={COLORS.primary} />
                  <Text style={styles.tipo}>{item.tipoLabel}</Text>
                </View>
                <Badge label={item.estadoLabel} tone={item.estadoTone} />
              </View>
              <Text style={styles.numero}>{maskAccountNumber(item.numeroCuenta)}</Text>
              <Text style={styles.saldoLabel}>Saldo disponible</Text>
              <Text style={styles.saldo}>{item.saldoFmt}</Text>
            </Card>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: SPACING.lg, gap: SPACING.md },
  requestBtn: { marginBottom: SPACING.sm },
  card: { gap: SPACING.xs },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  tipo: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text },
  numero: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, marginTop: SPACING.xs },
  saldoLabel: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted, marginTop: SPACING.sm },
  saldo: { fontSize: FONT_SIZE.xxl, fontWeight: '800', color: COLORS.text },
});
