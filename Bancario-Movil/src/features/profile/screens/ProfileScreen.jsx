import { useState } from 'react';
import { Alert, Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Button, Card, Input, LoadingSpinner } from '../../../shared/components';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { pickProfileImage } from '../../../shared/utils/imagePicker';
import { useProfile } from '../hooks/useProfile';

const MENU = [
  { icon: 'star', label: 'Favoritos', screen: 'Favorites' },
  { icon: 'currency-exchange', label: 'Divisas', screen: 'Currencies' },
  { icon: 'chat', label: 'Asistente', screen: 'ChatList' },
];

export function ProfileScreen({ navigation }) {
  const { profile, loading, error, refetch, updateProfile, logout } = useProfile();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', fechaNacimiento: '', dpi: '', ingresosMensuales: '' });
  const [imageUri, setImageUri] = useState(null);
  const [saving, setSaving] = useState(false);

  const startEdit = () => {
    setForm({
      name: profile?.name || '',
      phone: profile?.phone || '',
      fechaNacimiento: profile?.fechaNacimiento || '',
      dpi: profile?.dpi || '',
      ingresosMensuales: String(profile?.ingresosMensuales || ''),
    });
    setImageUri(null);
    setEditing(true);
  };

  const handlePickImage = async () => {
    const result = await pickProfileImage();
    if (result.error) return Alert.alert('Permiso requerido', result.error);
    if (!result.canceled) setImageUri(result.uri);
  };

  const onSave = async () => {
    setSaving(true);
    const result = await updateProfile({ ...form, profilePicture: imageUri });
    setSaving(false);
    if (!result.ok) {
      Alert.alert('Error', result.error);
      return;
    }
    setEditing(false);
    Alert.alert('Perfil actualizado', 'Algunos cambios pueden quedar pendientes de aprobación.');
  };

  const onLogout = () => {
    Alert.alert('Cerrar sesión', '¿Seguro que deseas salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: () => logout() },
    ]);
  };

  if (loading && !profile) return <LoadingSpinner message="Cargando perfil..." />;

  const avatar = imageUri || profile?.profilePicture;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} tintColor={COLORS.primary} />}
    >
      <Card style={styles.headerCard}>
        <TouchableOpacity onPress={editing ? handlePickImage : undefined} activeOpacity={editing ? 0.7 : 1}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <MaterialIcons name="person" size={40} color={COLORS.primary} />
            </View>
          )}
          {editing ? <Text style={styles.changePhoto}>Cambiar foto</Text> : null}
        </TouchableOpacity>
        <Text style={styles.name}>{profile?.name}</Text>
        <Text style={styles.email}>{profile?.email}</Text>
      </Card>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {editing ? (
        <Card>
          <Input label="Nombre" value={form.name} onChangeText={(v) => setForm((f) => ({ ...f, name: v }))} />
          <Input
            label="Teléfono"
            keyboardType="phone-pad"
            value={form.phone}
            onChangeText={(v) => setForm((f) => ({ ...f, phone: v }))}
          />
          <Input
            label="Fecha de nacimiento"
            placeholder="AAAA-MM-DD"
            value={form.fechaNacimiento}
            onChangeText={(v) => setForm((f) => ({ ...f, fechaNacimiento: v }))}
          />
          <Input
            label="DPI"
            keyboardType="number-pad"
            value={form.dpi}
            onChangeText={(v) => setForm((f) => ({ ...f, dpi: v }))}
          />
          <Input
            label="Ingresos mensuales"
            keyboardType="numeric"
            value={form.ingresosMensuales}
            onChangeText={(v) => setForm((f) => ({ ...f, ingresosMensuales: v }))}
          />
          <Button title="Guardar cambios" onPress={onSave} loading={saving} />
          <Button title="Cancelar" variant="ghost" onPress={() => setEditing(false)} />
        </Card>
      ) : (
        <Card>
          <InfoRow label="Teléfono" value={profile?.phone || 'N/D'} />
          <InfoRow label="DPI" value={profile?.dpi || 'N/D'} />
          <InfoRow label="Fecha de nacimiento" value={profile?.fechaNacimiento || 'N/D'} />
          <InfoRow label="Ingresos mensuales" value={profile?.ingresosMensuales || 'N/D'} />
          <Button title="Editar perfil" variant="secondary" onPress={startEdit} style={styles.editBtn} />
        </Card>
      )}

      <Card style={styles.menuCard}>
        {MENU.map((item) => (
          <TouchableOpacity key={item.screen} style={styles.menuRow} onPress={() => navigation.navigate(item.screen)}>
            <MaterialIcons name={item.icon} size={22} color={COLORS.primary} />
            <Text style={styles.menuLabel}>{item.label}</Text>
            <MaterialIcons name="chevron-right" size={22} color={COLORS.textMuted} />
          </TouchableOpacity>
        ))}
      </Card>

      <Button title="Cerrar sesión" variant="danger" onPress={onLogout} />
    </ScrollView>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, gap: SPACING.md },
  headerCard: { alignItems: 'center', gap: SPACING.xs },
  avatar: { width: 96, height: 96, borderRadius: RADIUS.pill },
  avatarPlaceholder: { backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center' },
  changePhoto: { color: COLORS.primary, fontWeight: '700', fontSize: FONT_SIZE.xs, textAlign: 'center', marginTop: SPACING.xs },
  name: { fontSize: FONT_SIZE.xl, fontWeight: '800', color: COLORS.text, marginTop: SPACING.sm },
  email: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary },
  error: { color: COLORS.danger, fontSize: FONT_SIZE.sm },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  infoLabel: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary },
  infoValue: { fontSize: FONT_SIZE.sm, fontWeight: '700', color: COLORS.text },
  editBtn: { marginTop: SPACING.md },
  menuCard: { gap: SPACING.xs },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  menuLabel: { flex: 1, fontSize: FONT_SIZE.md, fontWeight: '600', color: COLORS.text },
});
