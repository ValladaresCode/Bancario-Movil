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
      direccion: '',
      nombreTrabajo: '',
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
            rules={{ required: 'La contraseña es requerida', minLength: { value: 8, message: 'Mínimo 8 caracteres' } }}
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
            rules={{
              required: 'La fecha de nacimiento es obligatoria',
              pattern: {
                value: /^\d{4}-\d{2}-\d{2}$/,
                message: 'Usa formato AAAA-MM-DD',
              },
            }}
            label="Fecha de nacimiento"
            leftIcon="event"
            placeholder="AAAA-MM-DD"
            error={errors.fechaNacimiento?.message}
          />
          <FormField
            control={control}
            name="dpi"
            rules={{
              required: 'El DPI es obligatorio',
              pattern: { value: /^\d{13}$/, message: 'El DPI debe tener 13 dígitos' },
            }}
            label="DPI"
            leftIcon="badge"
            keyboardType="number-pad"
            error={errors.dpi?.message}
          />
          <FormField
            control={control}
            name="ingresosMensuales"
            rules={{
              required: 'Los ingresos mensuales son obligatorios',
              validate: (value) => {
                const n = Number(value);
                if (Number.isNaN(n)) return 'Debe ser un número válido';
                if (n < 0) return 'No puede ser negativo';
                return true;
              },
            }}
            label="Ingresos mensuales"
            leftIcon="payments"
            keyboardType="numeric"
            error={errors.ingresosMensuales?.message}
          />
          <FormField
            control={control}
            name="direccion"
            rules={{
              required: 'La dirección es obligatoria',
              maxLength: { value: 255, message: 'Máximo 255 caracteres' },
            }}
            label="Dirección"
            leftIcon="home"
            error={errors.direccion?.message}
          />
          <FormField
            control={control}
            name="nombreTrabajo"
            rules={{
              required: 'La ocupación es obligatoria',
              maxLength: { value: 100, message: 'Máximo 100 caracteres' },
            }}
            label="Ocupación"
            leftIcon="work"
            error={errors.nombreTrabajo?.message}
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
