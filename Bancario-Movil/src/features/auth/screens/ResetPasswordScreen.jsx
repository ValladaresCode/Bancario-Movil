import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { Button, Input } from '../../../shared/components';
import { notify } from '../../../shared/utils/confirm';
import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { useAuth } from '../hooks/useAuth';

// Pantalla de nueva contraseña. Se abre por deep link (bancariomovil://reset-password?token=...)
// con el token prellenado, o manualmente desde ForgotPassword.
export function ResetPasswordScreen({ navigation, route }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const { resetPassword, loading } = useAuth();

  const tokenFromLink = route?.params?.token || '';
  const [token, setToken] = useState(tokenFromLink);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const onReset = async () => {
    if (!token.trim()) {
      notify('Atención', 'Falta el código de recuperación. Abre el enlace de tu correo.');
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      notify('Atención', 'La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      notify('Atención', 'Las contraseñas no coinciden.');
      return;
    }
    const result = await resetPassword(token.trim(), newPassword);
    if (!result.ok) {
      notify('Error', result.error);
      return;
    }
    notify('Listo', 'Tu contraseña fue restablecida. Inicia sesión.', () =>
      navigation.navigate('Login')
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.iconWrap}>
          <View style={styles.iconCircle}>
            <MaterialIcons name="lock-reset" size={64} color={colors.primary} />
          </View>
        </View>

        <Text style={styles.title}>Nueva contraseña</Text>
        <Text style={styles.subtitle}>Elige una contraseña segura para tu cuenta.</Text>

        {!tokenFromLink ? (
          <Input
            label="Código de recuperación"
            leftIcon="vpn-key"
            autoCapitalize="none"
            value={token}
            onChangeText={setToken}
          />
        ) : null}

        <Input
          label="Nueva contraseña"
          leftIcon="lock-outline"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <Input
          label="Confirmar contraseña"
          leftIcon="lock-outline"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <Button title="Restablecer contraseña" gradient onPress={onReset} loading={loading} />

        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.toggle}>
          <Text style={styles.muted}>Volver al inicio de sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: SPACING.xl, flexGrow: 1, justifyContent: 'center' },
  iconWrap: { alignItems: 'center', marginBottom: SPACING.lg },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.pill,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: FONT_SIZE.xxl, fontFamily: FONTS.displayBold, fontWeight: '800', color: colors.text, textAlign: 'center' },
  subtitle: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.body, color: colors.textSecondary, textAlign: 'center', marginTop: SPACING.xs, marginBottom: SPACING.xl },
  toggle: { alignItems: 'center', marginTop: SPACING.lg },
  muted: { color: colors.textSecondary, fontFamily: FONTS.body, fontSize: FONT_SIZE.sm },
});
