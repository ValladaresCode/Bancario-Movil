import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

import { Button, Input } from '../../../shared/components';
import { notify } from '../../../shared/utils/confirm';
import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { useAuth } from '../hooks/useAuth';

// Longitud mínima aproximada de un token de reset real (~43 chars); evita
// disparar el polling de estado con entradas incompletas mientras se teclea.
const MIN_TOKEN_LENGTH_FOR_POLLING = 20;

// Pantalla de nueva contraseña. Se abre por deep link (bancariomovil://reset-password?token=...)
// con el token prellenado, o manualmente desde ForgotPassword. Mientras haya un token
// presente, hace polling silencioso del estado: si detecta que ya se usó (p. ej. el
// usuario terminó el reset desde la web) sale sola a Login sin que el usuario haga nada.
export function ResetPasswordScreen({ navigation, route }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const { resetPassword, checkResetPasswordStatus, loading } = useAuth();

  const tokenFromLink = route?.params?.token || '';
  const [token, setToken] = useState(tokenFromLink);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const onPaste = async () => {
    const clipboardText = await Clipboard.getStringAsync();
    if (clipboardText) setToken(clipboardText.trim());
  };

  // Polling de estado (debounced + intervalo), mismo patrón que useUnifiedAuth.js (web):
  // flag de closure `isPolling` (no state) para evitar carreras y setState tras cancelar.
  useEffect(() => {
    const trimmed = token.trim();
    if (trimmed.length < MIN_TOKEN_LENGTH_FOR_POLLING) return undefined;

    let isPolling = true;
    let intervalId;

    const checkStatus = async () => {
      if (!isPolling) return;
      const status = await checkResetPasswordStatus(trimmed);
      if (!isPolling) return;

      if (status === 'used') {
        isPolling = false;
        clearInterval(intervalId);
        notify(
          'Contraseña actualizada',
          'Tu contraseña ya fue actualizada desde otro dispositivo. Inicia sesión.',
          () => navigation.navigate('Login')
        );
      } else if (status === 'expired' || status === 'invalid') {
        isPolling = false;
        clearInterval(intervalId);
      }
    };

    const debounceId = setTimeout(() => {
      checkStatus();
      intervalId = setInterval(checkStatus, 3000);
    }, 600);

    return () => {
      isPolling = false;
      clearTimeout(debounceId);
      clearInterval(intervalId);
    };
  }, [token, checkResetPasswordStatus, navigation]);

  const onReset = async () => {
    const trimmedToken = token.trim();
    if (!trimmedToken) {
      notify('Atención', 'Falta el código de recuperación. Abre el enlace de tu correo.');
      return;
    }
    // El token real mide ~43 caracteres. Si es más corto, casi siempre es una
    // selección incompleta al copiar (el doble-toque corta en los guiones del código).
    if (trimmedToken.length < 40) {
      notify(
        'Código incompleto',
        'El código parece incompleto. En el correo, mantén presionado y arrastra para seleccionarlo completo (no toques dos veces).'
      );
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
    const result = await resetPassword(trimmedToken, newPassword);
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
          <View>
            <Input
              label="Código de recuperación"
              leftIcon="vpn-key"
              autoCapitalize="none"
              value={token}
              onChangeText={setToken}
            />
            <TouchableOpacity onPress={onPaste} style={styles.pasteBtn}>
              <MaterialIcons name="content-paste" size={16} color={colors.primary} />
              <Text style={styles.pasteText}>Pegar código copiado</Text>
            </TouchableOpacity>
          </View>
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
  pasteBtn: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginTop: -SPACING.sm, marginBottom: SPACING.sm },
  pasteText: { color: colors.primary, fontFamily: FONTS.bold, fontWeight: '700', fontSize: FONT_SIZE.xs },
});
