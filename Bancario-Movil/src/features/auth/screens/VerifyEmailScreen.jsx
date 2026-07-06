import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { Button, Input } from '../../../shared/components';
import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { useAuth } from '../hooks/useAuth';

export function VerifyEmailScreen({ navigation, route }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const email = route?.params?.email || '';
  const { verifyEmail, resendVerification, loading } = useAuth();
  const [token, setToken] = useState('');

  const onVerify = async () => {
    if (!token.trim()) {
      Alert.alert('Atención', 'Ingresa el código/token recibido en tu correo.');
      return;
    }
    const result = await verifyEmail(token.trim());
    if (!result.ok) {
      Alert.alert('Error', result.error);
      return;
    }
    Alert.alert('¡Verificado!', 'Tu correo fue verificado. Ya puedes iniciar sesión.', [
      { text: 'Ir al login', onPress: () => navigation.navigate('Login') },
    ]);
  };

  const onResend = async () => {
    if (!email) {
      Alert.alert('Atención', 'No hay un correo asociado. Regístrate de nuevo.');
      return;
    }
    const result = await resendVerification(email);
    Alert.alert(result.ok ? 'Listo' : 'Error', result.ok ? 'Correo reenviado. Revisa tu bandeja y spam.' : result.error);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.iconWrap}>
          <View style={styles.iconCircle}>
            <MaterialIcons name="mark-email-read" size={64} color={colors.primary} />
          </View>
        </View>
        <Text style={styles.title}>Verifica tu correo</Text>
        <Text style={styles.subtitle}>
          Enviamos un enlace/código a {email ? <Text style={styles.bold}>{email}</Text> : 'tu correo'}. Tu cuenta
          quedará activa cuando un administrador la apruebe.
        </Text>

        <Input
          label="Código de verificación"
          leftIcon="vpn-key"
          placeholder="Pega aquí el token de tu correo"
          autoCapitalize="none"
          value={token}
          onChangeText={setToken}
        />

        <Button title="Verificar" gradient onPress={onVerify} loading={loading} />

        <TouchableOpacity onPress={onResend} style={styles.resend}>
          <Text style={styles.link}>Reenviar correo de verificación</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.resend}>
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
  subtitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginVertical: SPACING.lg,
    lineHeight: 20,
  },
  bold: { fontFamily: FONTS.semibold, fontWeight: '700', color: colors.text },
  resend: { alignItems: 'center', marginTop: SPACING.lg },
  link: { color: colors.primary, fontFamily: FONTS.bold, fontWeight: '700', fontSize: FONT_SIZE.sm },
  muted: { color: colors.textSecondary, fontFamily: FONTS.body, fontSize: FONT_SIZE.sm },
});
