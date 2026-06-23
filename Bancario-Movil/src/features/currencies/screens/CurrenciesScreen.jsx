import { useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Card, EmptyState, Input, LoadingSpinner, Selector } from '../../../shared/components';
import { CURRENCY_OPTIONS } from '../../../shared/constants';
import { COLORS, FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { formatNumber } from '../../../shared/utils/format';
import { useCurrencies } from '../hooks/useCurrencies';

export function CurrenciesScreen() {
  const { base, setBase, rates, lastUpdate, loading, error, refetch } = useCurrencies('GTQ');
  const [amount, setAmount] = useState('1');

  const converted = useMemo(() => {
    const amt = Number(amount) || 0;
    return Object.entries(rates).map(([code, rate]) => ({
      code,
      value: formatNumber(rate * amt),
    }));
  }, [rates, amount]);

  if (loading && converted.length === 0) {
    return <LoadingSpinner message="Cargando tasas de cambio..." />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} tintColor={COLORS.primary} />}
    >
      <Card>
        <Input label="Cantidad a convertir" keyboardType="numeric" value={amount} onChangeText={setAmount} />
        <Selector label="Moneda base" options={CURRENCY_OPTIONS} value={base} onChange={setBase} />
        {lastUpdate ? (
          <Text style={styles.update}>Actualizado: {new Date(lastUpdate).toLocaleString('es-GT')}</Text>
        ) : null}
      </Card>

      {converted.length === 0 ? (
        <EmptyState icon="currency-exchange" title="Sin tasas" message={error || 'No hay tasas disponibles.'} />
      ) : (
        converted.map((item) => (
          <Card key={item.code} style={styles.rateRow}>
            <View style={styles.codeWrap}>
              <View style={styles.iconCircle}>
                <MaterialIcons name="currency-exchange" size={18} color={COLORS.primary} />
              </View>
              <Text style={styles.code}>{item.code}</Text>
            </View>
            <Text style={styles.value}>{item.value}</Text>
          </Card>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, gap: SPACING.sm },
  update: { fontSize: FONT_SIZE.xs, fontFamily: FONTS.body, color: COLORS.textMuted },
  rateRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  codeWrap: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  code: { fontSize: FONT_SIZE.lg, fontFamily: FONTS.bold, fontWeight: '800', color: COLORS.text },
  value: { fontSize: FONT_SIZE.lg, fontFamily: FONTS.semibold, fontWeight: '700', color: COLORS.primary },
});
