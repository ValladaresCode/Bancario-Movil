import { useState } from 'react';
import { useForm } from 'react-hook-form';
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

import { Button } from '../../../shared/components';
import { FONTS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { useAuth } from '../hooks/useAuth';
import { AvatarPicker, FormField } from '../components';

export function RegisterScreen({ navigation }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const { register, loading } = useAuth();
  const [imageUri, setImageUri] = useState(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      fechaNacimiento: '',
      dpi: '',
      ingresosMensuales: '',
    },
  });

  const onSubmit = async (values) => {
    const result = await register({ ...values, profilePicture: imageUri });
    if (!result.ok) {
      Alert.alert('Error', result.error);
      return;
    }
    Alert.alert(
      'Solicitud enviada',
      'Tu cuenta quedó pendiente de aprobación. Revisa tu correo para verificarla.',
      [{ text: 'Entendido', onPress: () => navigation.navigate('VerifyEmail', { email: values.email.trim() }) }]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Crear cuenta</Text>
          <Text style={styles.subtitle}>Completa tus datos para solicitar tu cuenta.</Text>

          <AvatarPicker imageUri={imageUri} onImagePicked={setImageUri} />

          <FormField
            control={control}
            name="name"
            rules={{ required: 'El nombre es requerido' }}
            label="Nombre completo"
            leftIcon="person-outline"
            error={errors.name?.message}
          />
          <FormField
            control={control}
            name="email"
            rules={{
              required: 'El correo es requerido',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Correo inválido' },
            }}
            label="Correo electrónico"
            leftIcon="mail-outline"
            autoCapitalize="none"
            keyboardType="email-address"
            error={errors.email?.message}
          />
          <FormField
            control={control}
            name="password"
            rules={{ required: 'La contraseña es requerida', minLength: { value: 6, message: 'Mínimo 6 caracteres' } }}
            label="Contraseña"
            leftIcon="lock-outline"
            secureTextEntry
            error={errors.password?.message}
          />
          <FormField
            control={control}
            name="phone"
            rules={{ required: 'El teléfono es requerido' }}
            label="Teléfono"
            leftIcon="phone-iphone"
            keyboardType="phone-pad"
            error={errors.phone?.message}
          />
          <FormField
            control={control}
            name="fechaNacimiento"
            label="Fecha de nacimiento (opcional)"
            leftIcon="event"
            placeholder="AAAA-MM-DD"
          />
          <FormField
            control={control}
            name="dpi"
            label="DPI (opcional)"
            leftIcon="badge"
            keyboardType="number-pad"
          />
          <FormField
            control={control}
            name="ingresosMensuales"
            label="Ingresos mensuales (opcional)"
            leftIcon="payments"
            keyboardType="numeric"
          />

          <Button title="Crear cuenta" gradient onPress={handleSubmit(onSubmit)} loading={loading} />

          <View style={styles.footer}>
            <Text style={styles.muted}>¿Ya tienes cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.link}>Inicia sesión</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { padding: SPACING.xl },
  title: { fontSize: FONT_SIZE.xxl, fontFamily: FONTS.displayBold, fontWeight: '800', color: colors.brand },
  subtitle: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.body, color: colors.textSecondary, marginBottom: SPACING.xl, marginTop: SPACING.xs },
  link: { color: colors.primary, fontFamily: FONTS.bold, fontWeight: '700', fontSize: FONT_SIZE.sm },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: SPACING.xl },
  muted: { color: colors.textSecondary, fontFamily: FONTS.body, fontSize: FONT_SIZE.sm },
});
