import { RefreshControl, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Button, Card, LoadingSpinner } from '../../../shared/components';
import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
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
  const { colors, isDark, toggleTheme } = useThemeStore();
  const styles = createStyles(colors);
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
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} tintColor={colors.primary} />}
    >
      <ProfileHeader
        avatar={profile?.profilePicture}
        name={profile?.name}
        email={profile?.email}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Card>
        <InfoRow label="Teléfono" value={profile?.phone || 'N/D'} colors={colors} />
        <InfoRow label="DPI" value={profile?.dpi || 'N/D'} colors={colors} />
        <InfoRow label="Fecha de nacimiento" value={formatDate(profile?.fechaNacimiento)} colors={colors} />
        <InfoRow label="Dirección" value={profile?.direccion || 'N/D'} colors={colors} />
        <InfoRow label="Nombre de trabajo" value={profile?.nombreTrabajo || 'N/D'} colors={colors} />
        <InfoRow label="Ingresos mensuales" value={formatCurrency(profile?.ingresosMensuales)} colors={colors} />
        <Button
          title="Editar perfil"
          variant="secondary"
          onPress={() => navigation.navigate('EditProfile')}
          style={styles.editBtn}
        />
      </Card>

      {/* Modo oscuro toggle */}
      <Card style={styles.themeCard}>
        <View style={styles.themeRow}>
          <View style={styles.themeLeft}>
            <View style={styles.themeIcon}>
              <MaterialIcons name={isDark ? 'dark-mode' : 'light-mode'} size={20} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.themeLabel}>Modo oscuro</Text>
              <Text style={styles.themeHint}>{isDark ? 'Activado' : 'Desactivado'}</Text>
            </View>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.white}
          />
        </View>
      </Card>

      <Card style={styles.menuCard}>
        {MENU.map((item) => (
          <TouchableOpacity key={item.screen} style={styles.menuRow} onPress={() => navigation.navigate(item.screen)}>
            <View style={styles.menuIcon}>
              <MaterialIcons name={item.icon} size={20} color={colors.primary} />
            </View>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <MaterialIcons name="chevron-right" size={22} color={colors.textMuted} />
          </TouchableOpacity>
        ))}
      </Card>

      <Button title="Cerrar sesión" variant="danger" onPress={onLogout} />
    </ScrollView>
  );
}

function InfoRow({ label, value, colors }) {
  const styles = createStyles(colors);
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: SPACING.lg, gap: SPACING.md },
  error: { color: colors.danger, fontFamily: FONTS.medium, fontSize: FONT_SIZE.sm },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  infoLabel: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.body, color: colors.textSecondary },
  infoValue: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.semibold, fontWeight: '700', color: colors.text },
  editBtn: { marginTop: SPACING.md },
  themeCard: { gap: SPACING.xs },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  themeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  themeIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.pill,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeLabel: { fontSize: FONT_SIZE.md, fontFamily: FONTS.semibold, fontWeight: '600', color: colors.text },
  themeHint: { fontSize: FONT_SIZE.xs, fontFamily: FONTS.body, color: colors.textMuted, marginTop: 2 },
  menuCard: { gap: SPACING.xs },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.pill,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: { flex: 1, fontSize: FONT_SIZE.md, fontFamily: FONTS.semibold, fontWeight: '600', color: colors.text },
});
