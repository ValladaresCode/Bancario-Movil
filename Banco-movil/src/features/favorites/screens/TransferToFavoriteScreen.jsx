import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from 'react-native';

import { TRANSACTION_TYPES } from '../../../shared/constants';
import { FONTS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { notify } from '../../../shared/utils/confirm';
import { formatCurrency, maskAccountNumber } from '../../../shared/utils/format';
import { useAccounts } from '../../accounts/hooks/useAccounts';
import { useTransactions } from '../../transactions/hooks/useTransactions';
import { FavoriteSummaryCard, TransferForm } from '../components';

// Transferencia rápida hacia un favorito. El formulario y su validación de
// límites viven en ../components/TransferForm; aquí solo se envía al backend.
export function TransferToFavoriteScreen({ navigation, route }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const favorite = route?.params?.favorite;
  const { accounts } = useAccounts();
  const { createTransaction } = useTransactions();
  const [submitting, setSubmitting] = useState(false);

  const accountOptions = useMemo(
    () =>
      accounts.map((a) => ({
        value: String(a.numeroCuenta),
        label: `${a.tipoLabel} · ${maskAccountNumber(a.numeroCuenta)}`,
      })),
    [accounts]
  );

  const onTransfer = async ({ cuentaOrigen, monto, moneda, descripcion }) => {
    setSubmitting(true);
    const result = await createTransaction({
      tipoTransaccion: TRANSACTION_TYPES.TRANSFERENCIA,
      cuentaOrigen,
      cuentaDestino: favorite?.cuenta,
      monto,
      moneda,
      descripcion,
    });
    setSubmitting(false);

    if (!result.ok) {
      notify('No se pudo transferir', result.error);
      return;
    }
    notify('Transferencia realizada', `Enviaste ${formatCurrency(monto, moneda)} a ${favorite?.alias}.`, () =>
      navigation.goBack()
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
        <FavoriteSummaryCard favorite={favorite} />
        <TransferForm accountOptions={accountOptions} submitting={submitting} onSubmit={onTransfer} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: SPACING.lg, gap: SPACING.md },
  muted: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.body, color: colors.textMuted },
});
