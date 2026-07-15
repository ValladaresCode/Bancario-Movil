import { StyleSheet, Text, View } from 'react-native';

import { Button, Card } from '../../../shared/components';
import { FONTS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { formatDate, formatCurrency } from '../../../shared/utils/format';

function InfoRow({ label, value, styles }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

// Tarjeta con los datos personales del perfil y el botón de edición.
export function ProfileInfoCard({ profile, onEdit }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  return (
    <Card>
      <InfoRow label="Teléfono" value={profile?.phone || 'N/D'} styles={styles} />
      <InfoRow label="DPI" value={profile?.dpi || 'N/D'} styles={styles} />
      <InfoRow label="Fecha de nacimiento" value={formatDate(profile?.fechaNacimiento)} styles={styles} />
      <InfoRow label="Dirección" value={profile?.direccion || 'N/D'} styles={styles} />
      <InfoRow label="Nombre de trabajo" value={profile?.nombreTrabajo || 'N/D'} styles={styles} />
      <InfoRow label="Ingresos mensuales" value={formatCurrency(profile?.ingresosMensuales)} styles={styles} />
      <Button title="Editar perfil" variant="secondary" onPress={onEdit} style={styles.editBtn} />
    </Card>
  );
}

const createStyles = (colors) => StyleSheet.create({
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  infoLabel: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.body, color: colors.textSecondary },
  infoValue: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.semibold, fontWeight: '700', color: colors.text },
  editBtn: { marginTop: SPACING.md },
});
