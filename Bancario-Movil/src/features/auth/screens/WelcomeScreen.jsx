import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS, FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';

export function WelcomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <ImageBackground
      source={require('../../../../assets/images/Fondo Principal.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(2,24,63,0.15)', 'rgba(2,24,63,0.82)']}
        style={[styles.overlay, { paddingTop: insets.top + SPACING.xl }]}
      >
        <View style={styles.content}>
          <View style={styles.brandBadge}>
            <MaterialIcons name="account-balance" size={34} color={COLORS.white} />
          </View>

          <Text style={styles.title}>Bienvenido a KINAL BANC</Text>
          <Text style={styles.subtitle}>
            Gestiona tus cuentas, movimientos y servicios desde una sola app.
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.primaryButtonText}>Iniciar sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  content: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xxl + 16,
  },
  brandBadge: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.pill,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZE.xxxl,
    fontFamily: FONTS.displayBold,
    color: COLORS.white,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.body,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: SPACING.xl,
    lineHeight: 24,
    maxWidth: 320,
  },
  actions: {
    gap: SPACING.md,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    fontWeight: '700',
  },
});
