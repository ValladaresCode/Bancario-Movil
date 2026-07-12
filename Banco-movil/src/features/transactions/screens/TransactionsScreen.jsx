import { useMemo } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Badge, Button, Card, EmptyState, LoadingSpinner } from '../../../shared/components';
import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { useAccounts } from '../../accounts/hooks/useAccounts';
import { useTransactions } from '../hooks/useTransactions';

export function TransactionsScreen({ navigation }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const { accounts } = useAccounts();
  const myAccountNumbers = useMemo(() => accounts.map((a) => String(a.numeroCuenta)), [accounts]);
  const { transactions, loading, error, refetch } = useTransactions(myAccountNumbers);

  if (loading && transactions.length === 0) {
    return <LoadingSpinner message="Cargando movimientos..." />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        keyExtractor={(item, index) => String(item.id || index)}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} tintColor={colors.primary} />}
        ListHeaderComponent={
          <Button
            title="+ Nueva transacción"
            onPress={() => navigation.navigate('NewTransaction')}
            style={styles.newBtn}
          />
        }
        ListEmptyComponent={
          <EmptyState icon="receipt-long" title="Sin movimientos" message={error || 'Aún no registras transacciones.'} />
        }
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View style={styles.iconWrap}>
              <MaterialIcons name={item.icon} size={22} color={item.incoming ? colors.success : colors.danger} />
            </View>
            <View style={styles.middle}>
              <Text style={styles.tipo}>{item.tipoLabel}</Text>
              {item.descripcion ? <Text style={styles.muted} numberOfLines={1}>{item.descripcion}</Text> : null}
              <Text style={styles.date}>{item.fecha}</Text>
            </View>
            <View style={styles.right}>
              <Text style={[styles.monto, { color: item.incoming ? colors.success : colors.danger }]}>
                {item.montoFmt}
              </Text>
              {item.estado ? <Badge label={item.estado} tone={item.estadoTone} /> : null}
            </View>
          </Card>
        )}
      />
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: SPACING.lg, gap: SPACING.md },
  newBtn: { marginBottom: SPACING.sm },
  card: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.pill,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  middle: { flex: 1 },
  tipo: { fontSize: FONT_SIZE.md, fontFamily: FONTS.semibold, fontWeight: '700', color: colors.text },
  muted: { fontSize: FONT_SIZE.xs, fontFamily: FONTS.body, color: colors.textSecondary },
  date: { fontSize: FONT_SIZE.xs, fontFamily: FONTS.body, color: colors.textMuted, marginTop: SPACING.xs },
  right: { alignItems: 'flex-end', gap: SPACING.xs },
  monto: { fontSize: FONT_SIZE.md, fontFamily: FONTS.bold, fontWeight: '800' },
});
