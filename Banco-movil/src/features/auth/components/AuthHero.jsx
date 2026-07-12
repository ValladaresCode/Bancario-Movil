import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FONTS, FONT_SIZE, GRADIENTS, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';

// Encabezado con gradiente de marca para las pantallas de autenticación.
export function AuthHero() {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={GRADIENTS.hero}
      start={GRADIENTS.start}
      end={GRADIENTS.endDiagonal}
      style={[styles.hero, { paddingTop: insets.top + SPACING.xxl }]}
    >
      <View style={styles.brandBadge}>
        <MaterialIcons name="account-balance" size={30} color={colors.white} />
      </View>
      <Text style={styles.brand}>KINAL BANC</Text>
      <Text style={styles.tagline}>Tu banca, en tu bolsillo</Text>
    </LinearGradient>
  );
}

const createStyles = (colors) => StyleSheet.create({
  hero: {
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xxxl,
  },
  brandBadge: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.pill,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  brand: {
    fontSize: FONT_SIZE.xxl,
    fontFamily: FONTS.displayBold,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.body,
    color: 'rgba(255,255,255,0.8)',
    marginTop: SPACING.xs,
  },
});
