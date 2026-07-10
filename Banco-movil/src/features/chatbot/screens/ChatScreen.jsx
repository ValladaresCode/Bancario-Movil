import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { EmptyState } from '../../../shared/components';
import { FONTS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { useChat } from '../hooks/useChatbot';
import { ChatInputBar, MessageBubble } from '../components';

// Conversación con el asistente: burbujas y barra de entrada viven en ../components.
export function ChatScreen({ route }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const initialChatId = route?.params?.chatId || null;
  const { messages, loading, sending, sendMessage } = useChat(initialChatId);
  const [text, setText] = useState('');
  const listRef = useRef(null);

  const onSend = async () => {
    const value = text;
    setText('');
    await sendMessage(value);
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(_, index) => String(index)}
          contentContainerStyle={styles.list}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          ListEmptyComponent={
            <EmptyState icon="smart-toy" title="¿En qué te ayudo?" message="Escribe tu primer mensaje al asistente." />
          }
          renderItem={({ item }) => <MessageBubble message={item} />}
        />
      )}

      {sending ? (
        <View style={styles.typingRow}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.typing}>El asistente está escribiendo…</Text>
        </View>
      ) : null}

      <ChatInputBar text={text} onChangeText={setText} onSend={onSend} sending={sending} />
    </KeyboardAvoidingView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { padding: SPACING.lg, gap: SPACING.sm, flexGrow: 1 },
  typingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xs,
  },
  typing: { fontSize: FONT_SIZE.xs, fontFamily: FONTS.body, color: colors.textMuted },
});
