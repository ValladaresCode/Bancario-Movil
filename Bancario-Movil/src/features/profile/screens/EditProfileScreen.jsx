import { useState, useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { Button, Card, Input, LoadingSpinner } from '../../../shared/components';
import { SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { pickProfileImage } from '../../../shared/utils/imagePicker';
import { notify } from '../../../shared/utils/confirm';
import { useProfile } from '../hooks/useProfile';
import { ProfileHeader } from '../components';

export function EditProfileScreen({ navigation }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const { profile, loading, updateProfile } = useProfile();
  const [form, setForm] = useState({ name: '', direccion: '', nombreTrabajo: '', ingresosMensuales: '' });
  const [imageUri, setImageUri] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || '',
        direccion: profile.direccion || '',
        nombreTrabajo: profile.nombreTrabajo || '',
        ingresosMensuales: String(profile.ingresosMensuales || ''),
      });
    }
  }, [profile]);

  const handlePickImage = async () => {
    const result = await pickProfileImage();
    if (result.error) return notify('Permiso requerido', result.error);
    if (!result.canceled) setImageUri(result.uri);
  };

  const hasChanges =
    (form.name || '').trim() !== (profile?.name || '').trim() ||
    (form.direccion || '').trim() !== (profile?.direccion || '').trim() ||
    (form.nombreTrabajo || '').trim() !== (profile?.nombreTrabajo || '').trim() ||
    String(form.ingresosMensuales || '').trim() !== String(profile?.ingresosMensuales || '').trim() ||
    imageUri !== null;

  const onSave = async () => {
    if (!hasChanges) {
      navigation.goBack();
      return;
    }

    setSaving(true);
    const result = await updateProfile({ ...form, profilePicture: imageUri });
    setSaving(false);
    if (!result.ok) {
      notify('Error', result.error);
      return;
    }
    notify('Perfil actualizado', 'Algunos cambios pueden quedar pendientes de aprobación.');
    navigation.goBack();
  };

  if (loading && !profile) return <LoadingSpinner message="Cargando perfil..." />;

  const avatar = imageUri || profile?.profilePicture;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ProfileHeader
        avatar={avatar}
        name={profile?.name}
        email={profile?.email}
        onPress={handlePickImage}
        editable={true}
      />

      <Card>
        <Input label="Nombre" value={form.name} onChangeText={(v) => setForm((f) => ({ ...f, name: v }))} />
        <Input
          label="Dirección"
          value={form.direccion}
          onChangeText={(v) => setForm((f) => ({ ...f, direccion: v }))}
        />
        <Input
          label="Nombre de trabajo"
          value={form.nombreTrabajo}
          onChangeText={(v) => setForm((f) => ({ ...f, nombreTrabajo: v }))}
        />
        <Input
          label="Ingresos mensuales"
          keyboardType="numeric"
          value={form.ingresosMensuales}
          onChangeText={(v) => setForm((f) => ({ ...f, ingresosMensuales: v }))}
        />
        <Button title="Guardar cambios" onPress={onSave} loading={saving} disabled={!hasChanges} />
        <Button title="Cancelar" variant="ghost" onPress={() => navigation.goBack()} />
      </Card>
    </ScrollView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: SPACING.lg, gap: SPACING.md },
});
