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

export function QuickActions({ navigation }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  return (
    <View style={styles.actionsRow}>
      {QUICK_ACTIONS.map((action) => (
        <TouchableOpacity
          key={action.label}
          style={styles.actionCard}
          activeOpacity={0.85}
          onPress={() => navigation.navigate(action.tab, { screen: action.screen })}
        >
          <MaterialIcons name={action.icon} size={24} color={colors.primary} />
          <Text style={styles.actionLabel}>{action.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: SPACING.sm },
  actionCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    backgroundColor: colors.surface,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  actionLabel: { fontSize: 10, color: colors.text, fontFamily: FONTS.medium, textAlign: 'center' },
});
