import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Badge, Card } from '../../../shared/components';
import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { maskAccountNumber } from '../../../shared/utils/format';

// Tarjeta de un favorito: alias, cuenta enmascarada, tipo y acciones
// (transferencia rápida, editar alias, eliminar).
export function FavoriteCard({ favorite, onTransfer, onEdit, onDelete }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  return (
    <Card style={styles.card}>
      <View style={styles.iconWrap}>
        <MaterialIcons name="star" size={22} color={colors.warning} />
      </View>
      <View style={styles.middle}>
        <Text style={styles.alias}>{favorite.alias}</Text>
        <Text style={styles.muted}>{maskAccountNumber(favorite.cuenta)}</Text>
        <View style={styles.badgeRow}>
          <Badge label={favorite.tipo} tone="neutral" />
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={onTransfer} style={[styles.actionBtn, { backgroundColor: colors.primaryLight }]}>
          <MaterialIcons name="send" size={18} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onEdit} style={[styles.actionBtn, { backgroundColor: colors.neutralBg }]}>
          <MaterialIcons name="edit" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={[styles.actionBtn, { backgroundColor: colors.dangerBg }]}>
          <MaterialIcons name="delete-outline" size={18} color={colors.danger} />
        </TouchableOpacity>
      </View>
    </Card>
  );
}

const createStyles = (colors) => StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.pill,
    backgroundColor: colors.warningBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  middle: { flex: 1 },
  alias: { fontSize: FONT_SIZE.md, fontFamily: FONTS.semibold, fontWeight: '700', color: colors.text },
  muted: { fontSize: FONT_SIZE.xs, fontFamily: FONTS.body, color: colors.textSecondary, marginTop: SPACING.xs },
  badgeRow: { marginTop: SPACING.xs },
  actions: { flexDirection: 'row', gap: SPACING.sm },
  actionBtn: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
