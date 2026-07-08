import { useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card, EmptyState, Input, LoadingSpinner, Selector } from '../../../shared/components';
import { CURRENCY_HISTORY_SUPPORTED, CURRENCY_OPTIONS } from '../../../shared/constants';
import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { formatNumber, normalizeText } from '../../../shared/utils/format';
import { CurrencyHistoryModal } from '../components/CurrencyHistoryModal';
import { CurrencyRateCard } from '../components/CurrencyRateCard';
import { useCurrencies } from '../hooks/useCurrencies';

export function CurrenciesScreen() {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const { base, setBase, rates, lastUpdate, loading, error, refetch } = useCurrencies('GTQ');
  const [amount, setAmount] = useState('1');
  const [query, setQuery] = useState('');
  const [visibleCodes, setVisibleCodes] = useState(() => CURRENCY_OPTIONS.map((opt) => opt.value));
  const [chartPair, setChartPair] = useState(null);

  const filteredOptions = useMemo(() => {
    const normalizedQuery = normalizeText(query);
    if (!normalizedQuery) return CURRENCY_OPTIONS;
    return CURRENCY_OPTIONS.filter(
      (opt) => normalizeText(opt.value).includes(normalizedQuery) || normalizeText(opt.label).includes(normalizedQuery)
    );
  }, [query]);

  const toggleCode = (code) => {
    setVisibleCodes((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]));
  };

  // Conserva el rate crudo (antes se perdía) para poder alimentar el sparkline/tendencia.
  const converted = useMemo(() => {
    const amt = Number(amount) || 0;
    return Object.entries(rates)
      .filter(([code]) => visibleCodes.includes(code))
      .map(([code, rate]) => ({
        code,
        rate,
        value: formatNumber(rate * amt),
      }));
  }, [rates, amount, visibleCodes]);

  const baseChartable = CURRENCY_HISTORY_SUPPORTED.includes(base);

  if (loading && converted.length === 0) {
    return <LoadingSpinner message="Cargando tasas de cambio..." />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} tintColor={colors.primary} />}
    >
      <Card>
        <Input label="Cantidad a convertir" keyboardType="numeric" value={amount} onChangeText={setAmount} />
        <Selector label="Moneda base" options={CURRENCY_OPTIONS} value={base} onChange={setBase} />
        {lastUpdate ? (
          <Text style={styles.update}>Actualizado: {new Date(lastUpdate).toLocaleString('es-GT')}</Text>
        ) : null}
        {!baseChartable ? (
          <Text style={styles.hint}>
            La gráfica solo está disponible entre {CURRENCY_HISTORY_SUPPORTED.join(', ')}. Cambia la moneda base para verla.
          </Text>
        ) : null}
      </Card>

      <Card style={styles.selectorCard}>
        <Input
          label="Buscar moneda"
          leftIcon="search"
          placeholder="Ej: dólar, COP, yen..."
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
        />
        <View style={styles.chipsWrap}>
          {filteredOptions.map((opt) => {
            const selected = visibleCodes.includes(opt.value);
            return (
              <Pressable
                key={opt.value}
                onPress={() => toggleCode(opt.value)}
                style={[styles.chip, selected && styles.chipSelected]}
              >
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{opt.value}</Text>
              </Pressable>
            );
          })}
        </View>
      </Card>

      {converted.length === 0 ? (
        <EmptyState
          icon="currency-exchange"
          title="Sin monedas"
          message={error || 'Selecciona al menos una moneda para ver su tasa.'}
        />
      ) : (
        converted.map((item) => (
          <CurrencyRateCard
            key={item.code}
            code={item.code}
            value={item.value}
            base={base}
            chartable={baseChartable && item.code !== base && CURRENCY_HISTORY_SUPPORTED.includes(item.code)}
            onPressChart={setChartPair}
          />
        ))
      )}

      <CurrencyHistoryModal pair={chartPair} onClose={() => setChartPair(null)} />
    </ScrollView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: SPACING.lg, gap: SPACING.sm },
  update: { fontSize: FONT_SIZE.xs, fontFamily: FONTS.body, color: colors.textMuted },
  hint: { fontSize: FONT_SIZE.xs, fontFamily: FONTS.body, color: colors.textMuted, marginTop: SPACING.xs },
  selectorCard: { gap: SPACING.sm },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
  },
  chipSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  chipText: { fontSize: FONT_SIZE.xs, fontFamily: FONTS.semibold, fontWeight: '600', color: colors.textSecondary },
  chipTextSelected: { color: colors.primary },
});
