import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { FONT_SIZE, FONTS, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';

const QUICK_ACTIONS = [
  { icon: 'swap-horiz', label: 'Transferir', tab: 'Movimientos', screen: 'NewTransaction' },
  { icon: 'star', label: 'Favoritos', tab: 'Perfil', screen: 'Favorites' },
  { icon: 'local-offer', label: 'Servicios', tab: 'Servicios', screen: 'Services' },
  { icon: 'currency-exchange', label: 'Divisas', tab: 'Perfil', screen: 'Currencies' },
];

// Fila de accesos rápidos del dashboard (transferir, favoritos, etc.).
export function QuickActions({ navigation }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  return (
    <View style={styles.actionsRow}>
      {QUICK_ACTIONS.map((action) => (
        <TouchableOpacity
          key={action.label}
          style={styles.action}
          activeOpacity={0.85}
          onPress={() => navigation.navigate(action.tab, { screen: action.screen })}
        >
          <View style={styles.actionIcon}>
            <MaterialIcons name={action.icon} size={24} color={colors.primary} />
          </View>
          <Text style={styles.actionLabel}>{action.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: SPACING.sm },
  action: { alignItems: 'center', gap: SPACING.xs, flex: 1 },
  actionIcon: {
    width: 58,
    height: 58,
    borderRadius: RADIUS.lg,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: { fontSize: FONT_SIZE.xs, color: colors.textSecondary, fontFamily: FONTS.semibold, fontWeight: '600' },
});
