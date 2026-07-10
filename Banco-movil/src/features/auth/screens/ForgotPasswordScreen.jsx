import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Input } from '../../../shared/components';
import { notify } from '../../../shared/utils/confirm';
import { FONTS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { useAuth } from '../hooks/useAuth';

export function ForgotPasswordScreen({ navigation }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const { forgotPassword, loading } = useAuth();
  const [email, setEmail] = useState('');

  const onSendLink = async () => {
    if (!email.trim()) {
      Alert.alert('Atención', 'Ingresa tu correo.');
      return;
    }
    const result = await forgotPassword(email.trim());
    if (!result.ok) {
      notify('Error', result.error);
      return;
    }
    // Avisa y pasa a la pantalla que espera el código (deep link lo prellena si el
    // usuario abre el correo en este mismo teléfono; si no, lo pega manualmente ahí).
    notify(
      'Revisa tu correo',
      'Te enviamos un enlace para restablecer tu contraseña. Ábrelo en este teléfono para continuar automáticamente, o pega el código en la siguiente pantalla.',
      () => navigation.navigate('ResetPassword')
    );
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

        <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')} style={styles.toggle}>
          <Text style={styles.link}>Ya tengo un código</Text>
        </TouchableOpacity>

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
  title: { fontSize: FONT_SIZE.xxl, fontFamily: FONTS.displayBold, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.body, color: colors.textSecondary, marginBottom: SPACING.xl, marginTop: SPACING.xs },
  toggle: { alignItems: 'center', marginTop: SPACING.lg },
  link: { color: colors.primary, fontFamily: FONTS.bold, fontWeight: '700', fontSize: FONT_SIZE.sm },
  muted: { color: colors.textSecondary, fontFamily: FONTS.body, fontSize: FONT_SIZE.sm },
});
