import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { Button, Input } from '../../../shared/components';
import { COLORS, FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { pickProfileImage } from '../../../shared/utils/imagePicker';
import { useAuth } from '../hooks/useAuth';

export function RegisterScreen({ navigation }) {
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

  const handlePickImage = async () => {
    const result = await pickProfileImage();
    if (result.error) {
      Alert.alert('Permiso requerido', result.error);
      return;
    }
    if (!result.canceled) setImageUri(result.uri);
  };

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

          <TouchableOpacity style={styles.avatarPicker} onPress={handlePickImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <MaterialIcons name="add-a-photo" size={28} color={COLORS.primary} />
              </View>
            )}
            <Text style={styles.link}>Foto de perfil (opcional)</Text>
          </TouchableOpacity>

          <Controller
            control={control}
            name="name"
            rules={{ required: 'El nombre es requerido' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Nombre completo"
                leftIcon="person-outline"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.name?.message}
              />
            )}
          />
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
                leftIcon="mail-outline"
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
            rules={{ required: 'La contraseña es requerida', minLength: { value: 6, message: 'Mínimo 6 caracteres' } }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Contraseña"
                leftIcon="lock-outline"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="phone"
            rules={{ required: 'El teléfono es requerido' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Teléfono"
                leftIcon="phone-iphone"
                keyboardType="phone-pad"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.phone?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="fechaNacimiento"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Fecha de nacimiento (opcional)"
                leftIcon="event"
                placeholder="AAAA-MM-DD"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          <Controller
            control={control}
            name="dpi"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="DPI (opcional)"
                leftIcon="badge"
                keyboardType="number-pad"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          <Controller
            control={control}
            name="ingresosMensuales"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Ingresos mensuales (opcional)"
                leftIcon="payments"
                keyboardType="numeric"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
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

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  flex: { flex: 1 },
  content: { padding: SPACING.xl },
  title: { fontSize: FONT_SIZE.xxl, fontFamily: FONTS.displayBold, fontWeight: '800', color: COLORS.brand },
  subtitle: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.body, color: COLORS.textSecondary, marginBottom: SPACING.xl, marginTop: SPACING.xs },
  avatarPicker: { alignItems: 'center', marginBottom: SPACING.xl, gap: SPACING.sm },
  avatar: { width: 88, height: 88, borderRadius: RADIUS.pill },
  avatarPlaceholder: {
    width: 88,
    height: 88,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  link: { color: COLORS.primary, fontFamily: FONTS.bold, fontWeight: '700', fontSize: FONT_SIZE.sm },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: SPACING.xl },
  muted: { color: COLORS.textSecondary, fontFamily: FONTS.body, fontSize: FONT_SIZE.sm },
});
