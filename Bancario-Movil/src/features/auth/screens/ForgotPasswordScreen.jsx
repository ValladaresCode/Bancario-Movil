import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Input } from '../../../shared/components';
import { COLORS, FONTS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';
import { useAuth } from '../hooks/useAuth';

export function ForgotPasswordScreen({ navigation }) {
  const { forgotPassword, resetPassword, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const onSendLink = async () => {
    if (!email.trim()) {
      Alert.alert('Atención', 'Ingresa tu correo.');
      return;
    }
    const result = await forgotPassword(email.trim());
    if (!result.ok) {
      Alert.alert('Error', result.error);
      return;
    }
    Alert.alert('Revisa tu correo', 'Te enviamos un enlace/código para restablecer tu contraseña.');
    setShowReset(true);
  };

  const onReset = async () => {
    if (!token.trim() || !newPassword) {
      Alert.alert('Atención', 'Completa el código y la nueva contraseña.');
      return;
    }
    const result = await resetPassword(token.trim(), newPassword);
    if (!result.ok) {
      Alert.alert('Error', result.error);
      return;
    }
    Alert.alert('Listo', 'Tu contraseña fue restablecida. Inicia sesión.', [
      { text: 'Ir al login', onPress: () => navigation.navigate('Login') },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Recuperar contraseña</Text>
        <Text style={styles.subtitle}>Te enviaremos un enlace para restablecerla.</Text>

        <Input
          label="Correo electrónico"
          leftIcon="mail-outline"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Button title="Enviar enlace" gradient onPress={onSendLink} loading={loading} />

        <TouchableOpacity onPress={() => setShowReset((v) => !v)} style={styles.toggle}>
          <Text style={styles.link}>{showReset ? 'Ocultar' : 'Ya tengo un código'}</Text>
        </TouchableOpacity>

        {showReset ? (
          <View style={styles.resetBox}>
            <Input
              label="Código de recuperación"
              leftIcon="vpn-key"
              autoCapitalize="none"
              value={token}
              onChangeText={setToken}
            />
            <Input
              label="Nueva contraseña"
              leftIcon="lock-outline"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <Button title="Restablecer contraseña" variant="secondary" onPress={onReset} loading={loading} />
          </View>
        ) : null}

        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.toggle}>
          <Text style={styles.muted}>Volver al inicio de sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.xl, flexGrow: 1, justifyContent: 'center' },
  title: { fontSize: FONT_SIZE.xxl, fontFamily: FONTS.displayBold, fontWeight: '800', color: COLORS.brand },
  subtitle: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.body, color: COLORS.textSecondary, marginBottom: SPACING.xl, marginTop: SPACING.xs },
  toggle: { alignItems: 'center', marginTop: SPACING.lg },
  resetBox: { marginTop: SPACING.lg },
  link: { color: COLORS.primary, fontFamily: FONTS.bold, fontWeight: '700', fontSize: FONT_SIZE.sm },
  muted: { color: COLORS.textSecondary, fontFamily: FONTS.body, fontSize: FONT_SIZE.sm },
});
