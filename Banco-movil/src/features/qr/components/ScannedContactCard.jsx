import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Card } from '../../../shared/components';
import { ACCOUNT_TYPE_LABELS } from '../../../shared/constants';
import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { maskAccountNumber } from '../../../shared/utils/format';

// Tarjeta de confirmación del destinatario escaneado. El nombre del titular es
// el chequeo anti-fraude: el usuario confirma a QUIÉN le va a transferir.
//
// Nota de arquitectura ("guardar contacto", sin UI por ahora): `destino` ya
// contiene todo lo que useFavorites.addFavorite necesita — { cuenta:
// numeroCuenta, tipo: tipoCuenta, alias: titular }. El botón se difiere; el
// punto de enganche queda listo.
export function ScannedContactCard({ destino }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  return (
    <Card style={styles.card}>
      <View style={styles.avatar}>
        <MaterialIcons name="person" size={30} color={colors.primary} />
      </View>
      <Text style={styles.label}>Vas a transferir a</Text>
      <Text style={styles.name}>{destino.titular || 'Titular no disponible'}</Text>
      <Text style={styles.detail}>{maskAccountNumber(destino.numeroCuenta)}</Text>
      <Text style={styles.detailMuted}>
        {ACCOUNT_TYPE_LABELS[destino.tipoCuenta] || destino.tipoCuenta}
        {destino.moneda ? ` · ${destino.moneda}` : ''}
      </Text>
    </Card>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    card: { alignItems: 'center', gap: SPACING.xs },
    avatar: {
      width: 64,
      height: 64,
      borderRadius: RADIUS.pill,
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: SPACING.xs,
    },
    label: {
      fontSize: FONT_SIZE.sm,
      fontFamily: FONTS.body,
      color: colors.textSecondary,
    },
    name: {
      fontSize: FONT_SIZE.xl,
      fontFamily: FONTS.displayBold,
      fontWeight: '800',
      color: colors.text,
      textAlign: 'center',
    },
    detail: {
      fontSize: FONT_SIZE.md,
      fontFamily: FONTS.semibold,
      fontWeight: '700',
      color: colors.text,
    },
    detailMuted: {
      fontSize: FONT_SIZE.sm,
      fontFamily: FONTS.body,
      color: colors.textMuted,
    },
  });
