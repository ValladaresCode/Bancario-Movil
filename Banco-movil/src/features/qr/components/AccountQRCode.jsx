import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { FONTS, FONT_SIZE } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { buildAccountQR, ensureTextEncoder } from '../services/qrPayload';

// node-qrcode necesita TextEncoder. Se garantiza de forma aislada e idempotente
// (ver qrPayload.js) al importar este componente — sin polyfill global en el entry.
ensureTextEncoder();

// Genera y muestra el QR de una cuenta propia. Presentación pura: recibe
// numeroCuenta + tipoCuenta y construye el payload versionado.
export function AccountQRCode({ numeroCuenta, tipoCuenta, size = 220 }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  const value = useMemo(() => {
    try {
      return buildAccountQR({ numeroCuenta, tipoCuenta });
    } catch {
      return null;
    }
  }, [numeroCuenta, tipoCuenta]);

  if (!value) {
    return (
      <Text style={styles.error}>No se pudo generar el QR de esta cuenta.</Text>
    );
  }

  return (
    <View style={styles.wrap}>
      <QRCode
        value={value}
        size={size}
        backgroundColor="transparent"
        color={colors.text}
      />
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    wrap: { alignItems: 'center', justifyContent: 'center' },
    error: {
      fontSize: FONT_SIZE.sm,
      fontFamily: FONTS.body,
      color: colors.danger,
      textAlign: 'center',
    },
  });
