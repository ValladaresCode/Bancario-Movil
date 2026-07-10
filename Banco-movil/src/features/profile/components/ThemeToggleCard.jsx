import { StyleSheet, Switch, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Card } from '../../../shared/components';
import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';

// Tarjeta con el switch de modo oscuro.
export function ThemeToggleCard() {
  const { colors, isDark, toggleTheme } = useThemeStore();
  const styles = createStyles(colors);

  return (
    <Card style={styles.themeCard}>
      <View style={styles.themeRow}>
        <View style={styles.themeLeft}>
          <View style={styles.themeIcon}>
            <MaterialIcons name={isDark ? 'dark-mode' : 'light-mode'} size={20} color={colors.primary} />
          </View>
          <View>
            <Text style={styles.themeLabel}>Modo oscuro</Text>
            <Text style={styles.themeHint}>{isDark ? 'Activado' : 'Desactivado'}</Text>
          </View>
        </View>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={colors.white}
        />
      </View>
    </Card>
  );
}

const createStyles = (colors) => StyleSheet.create({
  themeCard: { gap: SPACING.xs },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  themeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  themeIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.pill,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeLabel: { fontSize: FONT_SIZE.md, fontFamily: FONTS.semibold, fontWeight: '600', color: colors.text },
  themeHint: { fontSize: FONT_SIZE.xs, fontFamily: FONTS.body, color: colors.textMuted, marginTop: 2 },
});
