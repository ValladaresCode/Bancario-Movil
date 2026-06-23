import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Button, Card, LoadingSpinner } from '../../../shared/components';
import { COLORS, FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { confirmAction } from '../../../shared/utils/confirm';
import { formatDate, formatCurrency } from '../../../shared/utils/format';
import { useProfile } from '../hooks/useProfile';
import { ProfileHeader } from './ProfileHeader';

const MENU = [
  { icon: 'star', label: 'Favoritos', screen: 'Favorites' },
  { icon: 'currency-exchange', label: 'Divisas', screen: 'Currencies' },
  { icon: 'chat', label: 'Asistente', screen: 'ChatList' },
];

export function ProfileScreen({ navigation }) {
  const { profile, loading, error, refetch, logout } = useProfile();

  const onLogout = () =>
    confirmAction({
      title: 'Cerrar sesión',
      message: '¿Seguro que deseas salir?',
      confirmText: 'Salir',
      destructive: true,
      onConfirm: logout,
    });

  if (loading && !profile) return <LoadingSpinner message="Cargando perfil..." />;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} tintColor={COLORS.primary} />}
    >
      <ProfileHeader
        avatar={profile?.profilePicture}
        name={profile?.name}
        email={profile?.email}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Card>
        <InfoRow label="Teléfono" value={profile?.phone || 'N/D'} />
        <InfoRow label="DPI" value={profile?.dpi || 'N/D'} />
        <InfoRow label="Fecha de nacimiento" value={formatDate(profile?.fechaNacimiento)} />
        <InfoRow label="Dirección" value={profile?.direccion || 'N/D'} />
        <InfoRow label="Nombre de trabajo" value={profile?.nombreTrabajo || 'N/D'} />
        <InfoRow label="Ingresos mensuales" value={formatCurrency(profile?.ingresosMensuales)} />
        <Button
          title="Editar perfil"
          variant="secondary"
          onPress={() => navigation.navigate('EditProfile')}
          style={styles.editBtn}
        />
      </Card>

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
