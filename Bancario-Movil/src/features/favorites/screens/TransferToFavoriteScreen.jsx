import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from 'react-native';

import { Button, Card, GradientCard, Input, Selector } from '../../../shared/components';
import { notify } from '../../../shared/utils/confirm';
import { CURRENCY_OPTIONS, TRANSACTION_LIMITS, TRANSACTION_TYPES } from '../../../shared/constants';
import { COLORS, FONTS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';
import { formatCurrency, maskAccountNumber } from '../../../shared/utils/format';
import { useAccounts } from '../../accounts/hooks/useAccounts';
import { useTransactions } from '../../transactions/hooks/useTransactions';

export function TransferToFavoriteScreen({ navigation, route }) {
  const favorite = route?.params?.favorite;
  const { accounts } = useAccounts();
  const { createTransaction } = useTransactions();

  const [cuentaOrigen, setCuentaOrigen] = useState('');
  const [monto, setMonto] = useState('');
  const [moneda, setMoneda] = useState(CURRENCY_OPTIONS[0].value);
  const [descripcion, setDescripcion] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const accountOptions = useMemo(
    () =>
      accounts.map((a) => ({
        value: String(a.numeroCuenta),
        label: `${a.tipoLabel} · ${maskAccountNumber(a.numeroCuenta)}`,
      })),
    [accounts]
  );

  // Limpia los campos editables tras una transferencia exitosa.
  const resetForm = () => {
    setMonto('');
    setDescripcion('');
    setCuentaOrigen('');
  };

  const onSubmit = async () => {
    const montoNum = Number(monto);
    if (!cuentaOrigen) return notify('Atención', 'Selecciona la cuenta de origen.');
    if (!montoNum || montoNum <= 0) return notify('Atención', 'Ingresa un monto válido.');
    if (montoNum > TRANSACTION_LIMITS.PER_TRANSACTION) {
      return notify(
        'Límite excedido',
        `El monto máximo por transacción es ${formatCurrency(TRANSACTION_LIMITS.PER_TRANSACTION, 'GTQ')}.`
      );
    }
    if (!descripcion.trim()) return notify('Atención', 'La descripción es requerida.');

    // Paso 2 (real): se ejecuta como TRANSFERENCIA hacia la cuenta del favorito.
    setSubmitting(true);
    const result = await createTransaction({
      tipoTransaccion: TRANSACTION_TYPES.TRANSFERENCIA,
      cuentaOrigen,
      cuentaDestino: favorite?.cuenta,
      monto: montoNum,
      moneda,
      descripcion: descripcion.trim(),
    });
    setSubmitting(false);

    if (!result.ok) {
      notify('No se pudo transferir', result.error);
      return;
    }
    notify(
      'Transferencia realizada',
      `Enviaste ${formatCurrency(montoNum, moneda)} a ${favorite?.alias}.`,
      () => {
        resetForm();
        navigation.goBack();
      }
    );
  };

  if (!favorite) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.muted}>Favorito no disponible.</Text>
      </ScrollView>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Tarjeta destino con gradiente de marca (navy → acento), texto en blanco. */}
        <GradientCard contentStyle={styles.destCard}>
          <Text style={styles.destLabel}>Transferir a</Text>
          <Text style={styles.destAlias}>{favorite.alias}</Text>
          <Text style={styles.destCuenta}>{maskAccountNumber(favorite.cuenta)} · {favorite.tipo}</Text>
        </GradientCard>

        <Card>
          {accountOptions.length > 0 ? (
            <Selector label="Cuenta de origen" options={accountOptions} value={cuentaOrigen} onChange={setCuentaOrigen} />
          ) : (
            <Text style={styles.warn}>No tienes cuentas disponibles como origen.</Text>
          )}
          <Input label="Monto" placeholder="0.00" keyboardType="numeric" value={monto} onChangeText={setMonto} />
          <Selector label="Moneda" options={CURRENCY_OPTIONS} value={moneda} onChange={setMoneda} />
          <Input
            label="Descripción (requerida)"
            placeholder="Motivo de la transferencia"
            value={descripcion}
            onChangeText={setDescripcion}
          />
          <Text style={styles.limits}>
            Máx. {formatCurrency(TRANSACTION_LIMITS.PER_TRANSACTION, 'GTQ')} por transacción ·{' '}
            {formatCurrency(TRANSACTION_LIMITS.PER_DAY, 'GTQ')} por día.
          </Text>
          <Button title="Transferir" gradient onPress={onSubmit} loading={submitting} />
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, gap: SPACING.md },
  destCard: { gap: SPACING.xs },
  destLabel: { color: COLORS.white, opacity: 0.85, fontSize: FONT_SIZE.sm, fontFamily: FONTS.medium },
  destAlias: { color: COLORS.white, fontSize: FONT_SIZE.xl, fontFamily: FONTS.displayBold, fontWeight: '800' },
  destCuenta: { color: COLORS.white, opacity: 0.9, fontSize: FONT_SIZE.sm, fontFamily: FONTS.body },
  warn: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.medium, color: COLORS.warning, marginBottom: SPACING.lg },
  limits: { fontSize: FONT_SIZE.xs, fontFamily: FONTS.body, color: COLORS.textMuted, marginBottom: SPACING.lg },
  muted: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.body, color: COLORS.textMuted },
});
