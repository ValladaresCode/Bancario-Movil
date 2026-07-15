import { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '../../../shared/components';
import { FONTS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { QRScannerView } from '../components/QRScannerView';
import { useQRScanner } from '../hooks/useQRScanner';

// Pantalla de escaneo: gestiona permiso y delega la cámara a QRScannerView.
// Al leer un QR navega a la confirmación (que valida contra el backend).
export function ScanQRScreen({ navigation }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  const onResult = useCallback(
    ({ payload, invalidQR }) => {
      navigation.navigate('ConfirmScanTransfer', {
        payload: payload || null,
        invalidQR: !!invalidQR,
      });
    },
    [navigation]
  );

  const { permission, requestPermission, active, handleBarcode } = useQRScanner({
    onResult,
  });

  // Permiso aún cargando (primer render antes de resolver el hook).
  if (!permission) {
    return <View style={styles.center} />;
  }

  // Permiso denegado / no concedido todavía: pedirlo explícitamente.
  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Necesitamos tu cámara</Text>
        <Text style={styles.muted}>
          Para escanear el QR de una cuenta y autocompletar la transferencia.
        </Text>
        <Button
          title="Permitir cámara"
          onPress={requestPermission}
          style={styles.btn}
        />
      </View>
    );
  }

  return (
    <View style={styles.fill}>
      <QRScannerView active={active} onBarcodeScanned={handleBarcode} />
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    fill: { flex: 1, backgroundColor: '#000' },
    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: SPACING.xl,
      gap: SPACING.sm,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: FONT_SIZE.lg,
      fontFamily: FONTS.displayBold,
      fontWeight: '700',
      color: colors.text,
      textAlign: 'center',
    },
    muted: {
      fontSize: FONT_SIZE.sm,
      fontFamily: FONTS.body,
      color: colors.textMuted,
      textAlign: 'center',
    },
    btn: { marginTop: SPACING.md, alignSelf: 'stretch' },
  });
