import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text } from 'react-native';

import { Button, Card, Selector } from '../../../shared/components';
import { ACCOUNT_TYPE_OPTIONS, CURRENCY_OPTIONS } from '../../../shared/constants';
import { FONTS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { useAccounts } from '../hooks/useAccounts';

export function RequestAccountScreen({ navigation }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const { requestAccount } = useAccounts();
  const [tipoCuenta, setTipoCuenta] = useState(ACCOUNT_TYPE_OPTIONS[0].value);
  const [moneda, setMoneda] = useState(CURRENCY_OPTIONS[0].value);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    setSubmitting(true);
    const result = await requestAccount({ tipoCuenta, moneda });
    setSubmitting(false);
    if (!result.ok) {
      Alert.alert('Error', result.error);
      return;
    }
    Alert.alert('Solicitud enviada', 'Tu cuenta quedó pendiente de aprobación por un administrador.', [
      { text: 'Entendido', onPress: () => navigation.navigate('Accounts') },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card>
        <Text style={styles.title}>Solicitar una cuenta</Text>
        <Text style={styles.subtitle}>Elige el tipo de cuenta y la moneda. Un administrador revisará tu solicitud.</Text>

        <Selector label="Tipo de cuenta" options={ACCOUNT_TYPE_OPTIONS} value={tipoCuenta} onChange={setTipoCuenta} />
        <Selector label="Moneda" options={CURRENCY_OPTIONS} value={moneda} onChange={setMoneda} />

        <Button title="Enviar solicitud" onPress={onSubmit} loading={submitting} />
      </Card>
    </ScrollView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: SPACING.lg },
  title: { fontSize: FONT_SIZE.xl, fontFamily: FONTS.displayBold, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.body, color: colors.textSecondary, marginTop: SPACING.xs, marginBottom: SPACING.lg },
});
