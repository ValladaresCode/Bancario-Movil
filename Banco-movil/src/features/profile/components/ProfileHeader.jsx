import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { GradientCard } from '../../../shared/components';
import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';

export function ProfileHeader({ avatar, name, email, onPress, editable = false }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  return (
    <GradientCard contentStyle={styles.headerCard}>
      <TouchableOpacity onPress={onPress} activeOpacity={editable ? 0.7 : 1}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <MaterialIcons name="person" size={40} color={colors.white} />
          </View>
        )}
        {editable ? <Text style={styles.changePhoto}>Cambiar foto</Text> : null}
      </TouchableOpacity>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.email}>{email}</Text>
    </GradientCard>
  );
}

const createStyles = (colors) => StyleSheet.create({
  headerCard: { alignItems: 'center', gap: SPACING.xs, paddingVertical: SPACING.xl },
  avatar: { width: 96, height: 96, borderRadius: RADIUS.pill },
  avatarPlaceholder: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  changePhoto: {
    color: colors.white,
    fontFamily: FONTS.bold,
    fontWeight: '700',
    fontSize: FONT_SIZE.xs,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  name: {
    fontSize: FONT_SIZE.xl,
    fontFamily: FONTS.displayBold,
    fontWeight: '800',
    color: colors.white,
    marginTop: SPACING.sm,
  },
  email: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.body,
    color: colors.white,
    opacity: 0.85,
  },
});
