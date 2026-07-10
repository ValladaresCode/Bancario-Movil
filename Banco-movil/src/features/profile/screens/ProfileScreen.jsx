import { RefreshControl, ScrollView, StyleSheet, Text } from 'react-native';

import { Button, LoadingSpinner } from '../../../shared/components';
import { FONTS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { confirmAction } from '../../../shared/utils/confirm';
import { useProfile } from '../hooks/useProfile';
import { ProfileHeader, ProfileInfoCard, ProfileMenu, ThemeToggleCard } from '../components';

// Pantalla de perfil: cada sección (datos, tema, menú) vive en ../components.
export function ProfileScreen({ navigation }) {
  const { colors } = useThemeStore();
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

      <ProfileInfoCard profile={profile} onEdit={() => navigation.navigate('EditProfile')} />

      <ThemeToggleCard />

      <ProfileMenu navigation={navigation} />

      <Button title="Cerrar sesión" variant="danger" onPress={onLogout} />
    </ScrollView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: SPACING.lg, gap: SPACING.md },
  error: { color: colors.danger, fontFamily: FONTS.medium, fontSize: FONT_SIZE.sm },
});
