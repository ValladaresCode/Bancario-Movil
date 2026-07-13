import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card } from '../../../shared/components';
import { ACCOUNT_TYPE_LABELS } from '../../../shared/constants';
import { FONTS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { maskAccountNumber } from '../../../shared/utils/format';
import { AccountQRCode } from '../components/AccountQRCode';

// "Mi QR": muestra el código de una cuenta propia para que otro usuario lo
// escanee y le transfiera. Recibe la cuenta por params (desde AccountDetail).
export function MyQRScreen({ route }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const account = route?.params?.account;

  if (!account) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Cuenta no disponible.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Card style={styles.card}>
        <Text style={styles.title}>Escanea para transferirme</Text>
        <AccountQRCode
          numeroCuenta={account.numeroCuenta}
          tipoCuenta={account.tipoCuenta}
        />
        <Text style={styles.number}>
          {maskAccountNumber(account.numeroCuenta)}
        </Text>
        <Text style={styles.muted}>
          {ACCOUNT_TYPE_LABELS[account.tipoCuenta] || account.tipoCuenta}
          {account.moneda ? ` · ${account.moneda}` : ''}
        </Text>
      </Card>
    </ScrollView>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    content: { padding: SPACING.lg, alignItems: 'stretch' },
    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
    },
    card: { alignItems: 'center', gap: SPACING.md },
    title: {
      fontSize: FONT_SIZE.lg,
      fontFamily: FONTS.displayBold,
      fontWeight: '700',
      color: colors.text,
    },
    number: {
      fontSize: FONT_SIZE.lg,
      fontFamily: FONTS.semibold,
      fontWeight: '700',
      color: colors.text,
      letterSpacing: 1,
    },
    muted: {
      fontSize: FONT_SIZE.sm,
      fontFamily: FONTS.body,
      color: colors.textMuted,
      textAlign: 'center',
    },
  });
