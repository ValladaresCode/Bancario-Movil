import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Button, Card, EmptyState, LoadingSpinner } from '../../../shared/components';
import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { formatDateTime } from '../../../shared/utils/format';
import { useChatList } from '../hooks/useChatbot';

export function ChatListScreen({ navigation }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const { chats, loading, error, refetch } = useChatList();

  if (loading && chats.length === 0) {
    return <LoadingSpinner message="Cargando conversaciones..." />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        keyExtractor={(item) => String(item._id)}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} tintColor={colors.primary} />}
        ListHeaderComponent={
          <Button
            title="+ Nueva conversación"
            onPress={() => navigation.navigate('Chat', {})}
            style={styles.newBtn}
          />
        }
        ListEmptyComponent={
          <EmptyState icon="chat-bubble-outline" title="Sin conversaciones" message={error || 'Inicia un chat con el asistente.'} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('Chat', { chatId: item._id, title: item.title })}>
            <Card style={styles.card}>
              <View style={styles.iconWrap}>
                <MaterialIcons name="smart-toy" size={22} color={colors.primary} />
              </View>
              <View style={styles.middle}>
                <Text style={styles.title} numberOfLines={1}>{item.title || 'Conversación'}</Text>
                <Text style={styles.muted} numberOfLines={1}>{formatDateTime(item.updatedAt)}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={22} color={colors.textMuted} />
            </Card>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: SPACING.lg, gap: SPACING.sm },
  newBtn: { marginBottom: SPACING.sm },
  card: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.pill,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  middle: { flex: 1 },
  title: { fontSize: FONT_SIZE.md, fontFamily: FONTS.semibold, fontWeight: '700', color: colors.text },
  muted: { fontSize: FONT_SIZE.xs, fontFamily: FONTS.body, color: colors.textMuted, marginTop: SPACING.xs },
});
