import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Input } from '../../../shared/components';
import { COLORS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';
import { useAuth } from '../hooks/useAuth';

export function LoginScreen({ navigation }) {
  const { login, loading } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: '', password: '' } });

  const onSubmit = async (values) => {
    // El form envía `email` (no emailOrUsername).
    const result = await login({ email: values.email.trim(), password: values.password });
    if (!result.ok) {
      Alert.alert('Error', result.error);
    }
    // En éxito, el authStore cambia isAuthenticated y AppNavigator monta los Tabs.
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.brand}>Bancario</Text>
            <Text style={styles.subtitle}>Tu banca, en tu bolsillo</Text>
          </View>

          <Controller
            control={control}
            name="email"
            rules={{
              required: 'El correo es requerido',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Correo inválido' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Correo electrónico"
                placeholder="tucorreo@ejemplo.com"
                autoCapitalize="none"
                keyboardType="email-address"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            rules={{ required: 'La contraseña es requerida' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Contraseña"
                placeholder="••••••••"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
              />
            )}
          />

          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.linkRight}
          >
            <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <Button title="Iniciar sesión" onPress={handleSubmit(onSubmit)} loading={loading} />

          <View style={styles.footer}>
            <Text style={styles.muted}>¿No tienes cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.link}>Regístrate</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  flex: { flex: 1 },
  content: { padding: SPACING.xl, paddingTop: SPACING.xxxl, flexGrow: 1, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: SPACING.xxl },
  brand: { fontSize: FONT_SIZE.xxxl, fontWeight: '800', color: COLORS.primary },
  subtitle: { fontSize: FONT_SIZE.md, color: COLORS.textSecondary, marginTop: SPACING.xs },
  linkRight: { alignSelf: 'flex-end', marginBottom: SPACING.lg },
  link: { color: COLORS.primary, fontWeight: '700', fontSize: FONT_SIZE.sm },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: SPACING.xl },
  muted: { color: COLORS.textSecondary, fontSize: FONT_SIZE.sm },
});
