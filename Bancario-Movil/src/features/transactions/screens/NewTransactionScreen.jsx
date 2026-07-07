import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';

import { Button, Card, Input, Selector } from '../../../shared/components';
import { notify } from '../../../shared/utils/confirm';
import { CURRENCY_OPTIONS, TRANSACTION_TYPES, TRANSACTION_TYPE_OPTIONS } from '../../../shared/constants';
import { SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { maskAccountNumber } from '../../../shared/utils/format';
import { useAccounts } from '../../accounts/hooks/useAccounts';
import { useTransactions } from '../hooks/useTransactions';
import { DestinationFields, OriginAccountField, TransactionLimitsInfo } from '../components';
import {
  originIsSelected,
  destinoIsSelected,
  descripcionIsRequired,
  validateTransactionForm,
  buildTransactionPayload,
} from '../utils/transactionForm';

// Pantalla de nueva transacción: la validación y armado del payload viven en
// ../utils/transactionForm, y las secciones del formulario en ../components.
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

  const onSubmit = async () => {
    const formValues = { tipo, monto, cuentaOrigen, selectedAccount, cuentaDestino, tipoCuentaDestino, descripcion };
    const validationError = validateTransactionForm(formValues);
    if (validationError) {
      notify('Revisa los datos', validationError);
      return;
    }

    setSubmitting(true);
    const result = await createTransaction(buildTransactionPayload({ ...formValues, moneda }));
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
            <OriginAccountField
              accountOptions={accountOptions}
              selectedAccount={selectedAccount}
              value={cuentaOrigen}
              onChange={setCuentaOrigen}
            />
          ) : null}

          {needsDestino ? (
            <DestinationFields
              tipo={tipo}
              cuentaDestino={cuentaDestino}
              onChangeCuenta={setCuentaDestino}
              tipoCuentaDestino={tipoCuentaDestino}
              onChangeTipoCuenta={setTipoCuentaDestino}
            />
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

          <TransactionLimitsInfo />

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
});
