import { StyleSheet, Text, View } from 'react-native';
import { CameraView } from 'expo-camera';

import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';

// Vista de cámara con marco/overlay. Presentación pura: no conoce el permiso ni
// el lock; recibe `active` (si escanear está habilitado) y el handler.
export function QRScannerView({ active, onBarcodeScanned }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  return (
    <View style={styles.fill}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        // Solo escuchar cuando la pantalla está enfocada (evita lecturas en 2º plano).
        onBarcodeScanned={active ? onBarcodeScanned : undefined}
      />
      <View style={styles.overlay} pointerEvents="none">
        <View style={styles.frame} />
        <Text style={styles.hint}>Apunta al código QR de la cuenta destino</Text>
      </View>
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    fill: { flex: 1, backgroundColor: '#000' },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      justifyContent: 'center',
      gap: SPACING.lg,
    },
    frame: {
      width: 240,
      height: 240,
      borderRadius: RADIUS.lg,
      borderWidth: 3,
      borderColor: colors.white,
      backgroundColor: 'transparent',
    },
    hint: {
      color: colors.white,
      fontSize: FONT_SIZE.sm,
      fontFamily: FONTS.semibold,
      fontWeight: '600',
      textAlign: 'center',
      paddingHorizontal: SPACING.xl,
      textShadowColor: 'rgba(0,0,0,0.6)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },
  });
