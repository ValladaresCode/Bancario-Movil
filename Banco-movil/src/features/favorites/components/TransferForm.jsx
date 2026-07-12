import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { Button, Card, Input, Selector } from '../../../shared/components';
import { CURRENCY_OPTIONS, TRANSACTION_LIMITS } from '../../../shared/constants';
import { FONTS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { formatCurrency } from '../../../shared/utils/format';
import { notify } from '../../../shared/utils/confirm';

// Formulario de transferencia rápida: cuenta origen, monto, moneda y descripción.
// Valida los límites establecidos antes de delegar el envío al padre vía onSubmit.
export function TransferForm({ accountOptions, submitting, onSubmit }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  const [cuentaOrigen, setCuentaOrigen] = useState('');
  const [monto, setMonto] = useState('');
  const [moneda, setMoneda] = useState(CURRENCY_OPTIONS[0].value);
  const [descripcion, setDescripcion] = useState('');

  const onPress = () => {
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

    onSubmit({ cuentaOrigen, monto: montoNum, moneda, descripcion: descripcion.trim() });
  };

  return (
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
      <Button title="Transferir" gradient onPress={onPress} loading={submitting} />
    </Card>
  );
}

const createStyles = (colors) => StyleSheet.create({
  warn: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.medium, color: colors.warning, marginBottom: SPACING.lg },
  limits: { fontSize: FONT_SIZE.xs, fontFamily: FONTS.body, color: colors.textMuted, marginBottom: SPACING.lg },
});
