import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button, Card, Input, Selector } from '../../../shared/components';
import { notify } from '../../../shared/utils/confirm';
import {
  ACCOUNT_TYPE_OPTIONS,
  CURRENCY_OPTIONS,
  TRANSACTION_LIMITS,
  TRANSACTION_TYPES,
  TRANSACTION_TYPE_OPTIONS,
} from '../../../shared/constants';
import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { formatCurrency, maskAccountNumber } from '../../../shared/utils/format';
import { useAccounts } from '../../accounts/hooks/useAccounts';
import { useTransactions } from '../hooks/useTransactions';

const originIsSelected = (tipo) =>
  tipo === TRANSACTION_TYPES.TRANSFERENCIA || tipo === TRANSACTION_TYPES.RETIRO;

const destinoIsSelected = (tipo) =>
  tipo === TRANSACTION_TYPES.TRANSFERENCIA || tipo === TRANSACTION_TYPES.DEPOSITO;

const descripcionIsRequired = (tipo) =>
  tipo === TRANSACTION_TYPES.TRANSFERENCIA;

export function NewTransactionScreen({ navigation, route }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const presetOrigen = route?.params?.cuentaOrigen;
  const presetMoneda = route?.params?.moneda;

  const { accounts } = useAccounts();
  const { createTransaction } = useTransactions();

  const [tipo, setTipo] = useState(TRANSACTION_TYPES.TRANSFERENCIA);
  const [cuentaOrigen, setCuentaOrigen] = useState(presetOrigen || '');
  const [cuentaDestino, setCuentaDestino] = useState('');
  const [tipoCuentaDestino, setTipoCuentaDestino] = useState('');
  const [monto, setMonto] = useState('');
  const [moneda, setMoneda] = useState(presetMoneda || CURRENCY_OPTIONS[0].value);
  const [descripcion, setDescripcion] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const needsOrigen = originIsSelected(tipo);
  const needsDestino = destinoIsSelected(tipo);
  const needsDescripcion = descripcionIsRequired(tipo);

  const accountOptions = useMemo(
    () =>
      accounts.map((a) => ({
        value: String(a.numeroCuenta),
        label: `${a.tipoLabel} · ${maskAccountNumber(a.numeroCuenta)}`,
      })),
    [accounts]
  );

  const selectedAccount = useMemo(
    () => accounts.find((a) => String(a.numeroCuenta) === cuentaOrigen),
    [accounts, cuentaOrigen]
  );

  const resetForm = () => {
    setCuentaDestino('');
    setTipoCuentaDestino('');
    setMonto('');
    setDescripcion('');
  };

  const validate = () => {
    const montoNum = Number(monto);
    if (!montoNum || montoNum <= 0) return 'Ingresa un monto válido.';
    if (montoNum > TRANSACTION_LIMITS.PER_TRANSACTION) {
      return `El monto máximo por transacción es ${formatCurrency(TRANSACTION_LIMITS.PER_TRANSACTION, 'GTQ')}.`;
    }
    if (needsOrigen) {
      if (!cuentaOrigen) return 'Selecciona la cuenta de origen.';
      if (selectedAccount && montoNum > selectedAccount.saldo) {
        return `Saldo insuficiente. Disponible: ${selectedAccount.saldoFmt}.`;
      }
    }
    if (needsDestino) {
      if (!cuentaDestino.trim()) return 'Ingresa el número de cuenta de destino.';
      if (tipo === TRANSACTION_TYPES.TRANSFERENCIA && !tipoCuentaDestino) {
        return 'Selecciona el tipo de cuenta de destino.';
      }
    }
    if (needsDescripcion && !descripcion.trim()) return 'La descripción es requerida para transferencias.';
    return null;
  };

  const onSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      notify('Revisa los datos', validationError);
      return;
    }

    const payload = {
      tipoTransaccion: tipo,
      monto: Number(monto),
      moneda,
    };
    if (needsOrigen) payload.cuentaOrigen = cuentaOrigen;
    if (needsDestino) {
      payload.cuentaDestino = cuentaDestino.trim();
      payload.tipoCuenta = tipoCuentaDestino;
    }
    if (descripcion.trim()) payload.descripcion = descripcion.trim();

    setSubmitting(true);
    const result = await createTransaction(payload);
    setSubmitting(false);

    if (!result.ok) {
      notify('No se pudo completar', result.error);
      return;
    }
    notify('Transacción registrada', 'Tu movimiento se procesó correctamente.', () => {
      resetForm();
      navigation.goBack();
    });
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Card>
          <Selector label="Tipo de transacción" options={TRANSACTION_TYPE_OPTIONS} value={tipo} onChange={setTipo} />

          {needsOrigen ? (
            accountOptions.length > 0 ? (
              <>
                <Selector label="Cuenta de origen" options={accountOptions} value={cuentaOrigen} onChange={setCuentaOrigen} />
                {selectedAccount ? (
                  <View style={styles.balanceRow}>
                    <Text style={styles.balanceLabel}>Saldo disponible</Text>
                    <Text style={styles.balanceValue}>{selectedAccount.saldoFmt}</Text>
                  </View>
                ) : null}
              </>
            ) : (
              <Text style={styles.warn}>No tienes cuentas disponibles como origen.</Text>
            )
          ) : null}

          {needsDestino ? (
            <>
              <Input
                label="Cuenta de destino"
                placeholder="Número de cuenta"
                keyboardType="number-pad"
                leftIcon="account-balance"
                value={cuentaDestino}
                onChangeText={setCuentaDestino}
              />
              {tipo === TRANSACTION_TYPES.TRANSFERENCIA ? (
                <Selector
                  label="Tipo de cuenta destino"
                  options={ACCOUNT_TYPE_OPTIONS}
                  value={tipoCuentaDestino}
                  onChange={setTipoCuentaDestino}
                  horizontal={false}
                />
              ) : null}
            </>
          ) : null}

          <Input
            label="Monto"
            placeholder="0.00"
            keyboardType="numeric"
            leftIcon="attach-money"
            value={monto}
            onChangeText={setMonto}
          />

          <Selector label="Moneda" options={CURRENCY_OPTIONS} value={moneda} onChange={setMoneda} />

          <Input
            label={needsDescripcion ? 'Descripción (requerida)' : 'Descripción (opcional)'}
            placeholder="Motivo de la transacción"
            leftIcon="notes"
            value={descripcion}
            onChangeText={setDescripcion}
          />

          <View style={styles.limitsBox}>
            <Text style={styles.limitsTitle}>Límites de transferencia</Text>
            <Text style={styles.limitsItem}>
              • Máximo {formatCurrency(TRANSACTION_LIMITS.PER_TRANSACTION, 'GTQ')} por transacción
            </Text>
            <Text style={styles.limitsItem}>
              • Máximo {formatCurrency(TRANSACTION_LIMITS.PER_DAY, 'GTQ')} por día
            </Text>
            <Text style={styles.limitsItem}>
              • No puede exceder el saldo disponible de la cuenta origen
            </Text>
          </View>

          <Button title="Registrar transacción" onPress={onSubmit} loading={submitting} gradient />
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: SPACING.lg },
  warn: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.medium,
    color: colors.warning,
    marginBottom: SPACING.lg,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: colors.primaryLight,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.lg,
  },
  balanceLabel: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.semibold,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  balanceValue: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    fontWeight: '800',
    color: colors.primary,
  },
  limitsBox: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  limitsTitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.semibold,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: SPACING.sm,
  },
  limitsItem: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.body,
    color: colors.textMuted,
    lineHeight: 18,
  },
});
