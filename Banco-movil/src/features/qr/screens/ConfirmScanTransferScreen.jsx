import { useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button, Card, LoadingSpinner } from '../../../shared/components';
import { FONTS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { ScannedContactCard } from '../components/ScannedContactCard';
import {
  ERROR_KIND,
  RESOLVE_STATUS,
  useScannedDestination,
} from '../hooks/useScannedDestination';

// Copy + acción por tipo de error (NO mensajes genéricos). action:
//   'retry' → reintentar la validación · 'scan' → volver a escanear.
const ERROR_COPY = {
  [ERROR_KIND.SELF]: {
    title: 'Es tu propia cuenta',
    message: 'No puedes transferirte a ti mismo.',
    action: 'scan',
  },
  [ERROR_KIND.NOT_FOUND]: {
    title: 'Cuenta no encontrada',
    message: 'La cuenta del código QR no existe.',
    action: 'scan',
  },
  [ERROR_KIND.INACTIVE]: {
    title: 'Cuenta inactiva',
    message: 'La cuenta está inactiva o bloqueada y no puede recibir transferencias.',
    action: 'scan',
  },
  [ERROR_KIND.NETWORK]: {
    title: 'Sin conexión',
    message: 'No pudimos contactar al servidor. Revisa tu conexión e inténtalo de nuevo.',
    action: 'retry',
  },
  [ERROR_KIND.SERVER]: {
    title: 'Error del servidor',
    message: 'Ocurrió un problema al validar la cuenta. Inténtalo de nuevo.',
    action: 'retry',
  },
  [ERROR_KIND.INVALID_QR]: {
    title: 'Código QR no válido',
    message: 'Este QR no pertenece a la aplicación o está dañado.',
    action: 'scan',
  },
};

// Confirmación del destino escaneado: valida contra el backend (vía hook) y
// renderiza el estado exacto. "Continuar" solo aparece en éxito y prellena la
// transferencia.
export function ConfirmScanTransferScreen({ navigation, route }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const payload = route?.params?.payload || null;
  const invalidQR = !!route?.params?.invalidQR;

  const { status, destino, errorKind, retry } = useScannedDestination(payload, {
    invalidQR,
  });

  const onContinue = useCallback(() => {
    navigation.navigate('NewTransaction', {
      cuentaDestino: destino.numeroCuenta,
      tipoCuentaDestino: destino.tipoCuenta,
      moneda: destino.moneda,
    });
  }, [navigation, destino]);

  if (status === RESOLVE_STATUS.LOADING) {
    return <LoadingSpinner message="Validando cuenta…" />;
  }

  if (status === RESOLVE_STATUS.ERROR) {
    const copy = ERROR_COPY[errorKind] || ERROR_COPY[ERROR_KIND.SERVER];
    return (
      <View style={styles.center}>
        <Card style={styles.errorCard}>
          <Text style={styles.title}>{copy.title}</Text>
          <Text style={styles.muted}>{copy.message}</Text>
          {copy.action === 'retry' ? (
            <Button title="Reintentar" onPress={retry} style={styles.btn} />
          ) : (
            <Button
              title="Escanear otro"
              onPress={() => navigation.goBack()}
              style={styles.btn}
            />
          )}
        </Card>
      </View>
    );
  }

  // SUCCESS
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <ScannedContactCard destino={destino} />
      <Button
        title="Continuar a la transferencia"
        onPress={onContinue}
        gradient
        style={styles.btn}
      />
      <Button
        title="Escanear otro"
        variant="secondary"
        onPress={() => navigation.goBack()}
        style={styles.btn}
      />
    </ScrollView>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    content: { padding: SPACING.lg, gap: SPACING.md },
    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: SPACING.lg,
      backgroundColor: colors.background,
    },
    errorCard: { alignItems: 'center', gap: SPACING.sm, alignSelf: 'stretch' },
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
    btn: { alignSelf: 'stretch' },
  });
