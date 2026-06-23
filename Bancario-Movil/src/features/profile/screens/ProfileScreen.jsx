import { useState } from 'react';
import { Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Button, Card, GradientCard, Input, LoadingSpinner } from '../../../shared/components';
import { COLORS, FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { pickProfileImage } from '../../../shared/utils/imagePicker';
import { confirmAction, notify } from '../../../shared/utils/confirm';
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
    if (result.error) return notify('Permiso requerido', result.error);
    if (!result.canceled) setImageUri(result.uri);
  };

  const onSave = async () => {
    setSaving(true);
    const result = await updateProfile({ ...form, profilePicture: imageUri });
    setSaving(false);
    if (!result.ok) {
      notify('Error', result.error);
      return;
    }
    setEditing(false);
    notify('Perfil actualizado', 'Algunos cambios pueden quedar pendientes de aprobación.');
  };

  const onLogout = () =>
    confirmAction({
      title: 'Cerrar sesión',
      message: '¿Seguro que deseas salir?',
      confirmText: 'Salir',
      destructive: true,
      onConfirm: logout,
    });

  if (loading && !profile) return <LoadingSpinner message="Cargando perfil..." />;

  const avatar = imageUri || profile?.profilePicture;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} tintColor={COLORS.primary} />}
    >
      {/* Header premium: avatar + nombre + correo sobre gradiente de marca. */}
      <GradientCard contentStyle={styles.headerCard}>
        <TouchableOpacity onPress={editing ? handlePickImage : undefined} activeOpacity={editing ? 0.7 : 1}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <MaterialIcons name="person" size={40} color={COLORS.white} />
            </View>
          )}
          {editing ? <Text style={styles.changePhoto}>Cambiar foto</Text> : null}
        </TouchableOpacity>
        <Text style={styles.name}>{profile?.name}</Text>
        <Text style={styles.email}>{profile?.email}</Text>
      </GradientCard>

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
            <View style={styles.menuIcon}>
              <MaterialIcons name={item.icon} size={20} color={COLORS.primary} />
            </View>
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
  headerCard: { alignItems: 'center', gap: SPACING.xs, paddingVertical: SPACING.xl },
  avatar: { width: 96, height: 96, borderRadius: RADIUS.pill },
  avatarPlaceholder: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  changePhoto: { color: COLORS.white, fontFamily: FONTS.bold, fontWeight: '700', fontSize: FONT_SIZE.xs, textAlign: 'center', marginTop: SPACING.xs },
  name: { fontSize: FONT_SIZE.xl, fontFamily: FONTS.displayBold, fontWeight: '800', color: COLORS.white, marginTop: SPACING.sm },
  email: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.body, color: COLORS.white, opacity: 0.85 },
  error: { color: COLORS.danger, fontFamily: FONTS.medium, fontSize: FONT_SIZE.sm },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  infoLabel: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.body, color: COLORS.textSecondary },
  infoValue: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.semibold, fontWeight: '700', color: COLORS.text },
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
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: { flex: 1, fontSize: FONT_SIZE.md, fontFamily: FONTS.semibold, fontWeight: '600', color: COLORS.text },
});
