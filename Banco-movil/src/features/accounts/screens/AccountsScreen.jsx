import { useCallback } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { Button, EmptyState, LoadingSpinner } from '../../../shared/components';
import { SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { useAccounts } from '../hooks/useAccounts';
import { AccountListItem } from '../components';

export function AccountsScreen({ navigation }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const { accounts, loading, error, refetch } = useAccounts();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

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
          <AccountListItem
            account={item}
            onPress={() => navigation.navigate('AccountDetail', { account: item })}
          />
        )}
      />
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: SPACING.lg, gap: SPACING.md },
  requestBtn: { marginBottom: SPACING.sm },
});
