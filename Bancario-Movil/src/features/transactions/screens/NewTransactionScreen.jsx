import { useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from 'react-native';

import { Button, Card, Input, Selector } from '../../../shared/components';
import {
  CURRENCY_OPTIONS,
  TRANSACTION_LIMITS,
  TRANSACTION_TYPES,
  TRANSACTION_TYPE_OPTIONS,
} from '../../../shared/constants';
import { COLORS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';
import { formatCurrency, maskAccountNumber } from '../../../shared/utils/format';
import { useAccounts } from '../../accounts/hooks/useAccounts';
import { useTransactions } from '../hooks/useTransactions';

export function NewTransactionScreen({ navigation, route }) {
  const presetOrigen = route?.params?.cuentaOrigen;
  const presetMoneda = route?.params?.moneda;

  const { accounts } = useAccounts();
  const { createTransaction } = useTransactions();

  const [tipo, setTipo] = useState(TRANSACTION_TYPES.TRANSFERENCIA);
  const [cuentaOrigen, setCuentaOrigen] = useState(presetOrigen || '');
  const [cuentaDestino, setCuentaDestino] = useState('');
  const [monto, setMonto] = useState('');
  const [moneda, setMoneda] = useState(presetMoneda || CURRENCY_OPTIONS[0].value);
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

  const needsOrigen = tipo === TRANSACTION_TYPES.TRANSFERENCIA || tipo === TRANSACTION_TYPES.RETIRO;
  const needsDestino = tipo === TRANSACTION_TYPES.TRANSFERENCIA || tipo === TRANSACTION_TYPES.DEPOSITO;
  const needsDescripcion = tipo === TRANSACTION_TYPES.TRANSFERENCIA;

  const validate = () => {
    const montoNum = Number(monto);
    if (!montoNum || montoNum <= 0) return 'Ingresa un monto válido.';
    if (montoNum > TRANSACTION_LIMITS.PER_TRANSACTION) {
      return `El monto máximo por transacción es ${formatCurrency(TRANSACTION_LIMITS.PER_TRANSACTION, 'GTQ')}.`;
    }
    if (needsOrigen && !cuentaOrigen) return 'Selecciona la cuenta de origen.';
    if (needsDestino && !cuentaDestino.trim()) return 'Ingresa la cuenta de destino.';
    if (needsDescripcion && !descripcion.trim()) return 'La descripción es requerida para transferencias.';
    return null;
  };

  const onSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      Alert.alert('Revisa los datos', validationError);
      return;
    }

    const payload = {
      tipoTransaccion: tipo,
      monto: Number(monto),
      moneda,
    };
    if (needsOrigen) payload.cuentaOrigen = cuentaOrigen;
    if (needsDestino) payload.cuentaDestino = cuentaDestino.trim();
    if (descripcion.trim()) payload.descripcion = descripcion.trim();

    setSubmitting(true);
    const result = await createTransaction(payload);
    setSubmitting(false);

    if (!result.ok) {
      // Muestra el mensaje del backend (límites diarios, saldo insuficiente, etc.).
      Alert.alert('No se pudo completar', result.error);
      return;
    }
    Alert.alert('Transacción registrada', 'Tu movimiento se procesó correctamente.', [
      { text: 'Ver movimientos', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Card>
          <Selector label="Tipo de transacción" options={TRANSACTION_TYPE_OPTIONS} value={tipo} onChange={setTipo} />

          {needsOrigen ? (
            accountOptions.length > 0 ? (
              <Selector
                label="Cuenta de origen"
                options={accountOptions}
                value={cuentaOrigen}
                onChange={setCuentaOrigen}
              />
            ) : (
              <Text style={styles.warn}>No tienes cuentas disponibles como origen.</Text>
            )
          ) : null}

          {needsDestino ? (
            <Input
              label="Cuenta de destino"
              placeholder="Número de cuenta"
              keyboardType="number-pad"
              value={cuentaDestino}
              onChangeText={setCuentaDestino}
            />
          ) : null}

          <Input
            label="Monto"
            placeholder="0.00"
            keyboardType="numeric"
            value={monto}
            onChangeText={setMonto}
          />

          <Selector label="Moneda" options={CURRENCY_OPTIONS} value={moneda} onChange={setMoneda} />

          <Input
            label={needsDescripcion ? 'Descripción (requerida)' : 'Descripción (opcional)'}
            placeholder="Motivo de la transacción"
            value={descripcion}
            onChangeText={setDescripcion}
          />

          <Text style={styles.limits}>
            Límites: máx. {formatCurrency(TRANSACTION_LIMITS.PER_TRANSACTION, 'GTQ')} por transacción ·{' '}
            {formatCurrency(TRANSACTION_LIMITS.PER_DAY, 'GTQ')} por día.
          </Text>

          <Button title="Registrar transacción" onPress={onSubmit} loading={submitting} />
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg },
  warn: { fontSize: FONT_SIZE.sm, color: COLORS.warning, marginBottom: SPACING.lg },
  limits: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted, marginBottom: SPACING.lg },
});
