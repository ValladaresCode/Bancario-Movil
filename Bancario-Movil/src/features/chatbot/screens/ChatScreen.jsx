import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { EmptyState } from '../../../shared/components';
import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { useChat } from '../hooks/useChatbot';

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
          renderItem={({ item }) => {
            const isUser = item.role === 'user';
            return (
              <View style={[styles.bubble, isUser ? styles.userBubble : styles.modelBubble]}>
                <Text style={[styles.bubbleText, isUser ? styles.userText : styles.modelText]}>{item.content}</Text>
              </View>
            );
          }}
        />
      )}

      {sending ? (
        <View style={styles.typingRow}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.typing}>El asistente está escribiendo…</Text>
        </View>
      ) : null}

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Escribe un mensaje"
          placeholderTextColor={colors.textMuted}
          value={text}
          onChangeText={setText}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!text.trim() || sending) && styles.sendBtnDisabled]}
          onPress={onSend}
          disabled={!text.trim() || sending}
        >
          <MaterialIcons name="send" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { padding: SPACING.lg, gap: SPACING.sm, flexGrow: 1 },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.lg,
  },
  userBubble: { alignSelf: 'flex-end', backgroundColor: colors.primary, borderBottomRightRadius: RADIUS.sm },
  modelBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomLeftRadius: RADIUS.sm,
  },
  bubbleText: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.body, lineHeight: 20 },
  userText: { color: colors.white },
  modelText: { color: colors.text },
  typingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xs,
  },
  typing: { fontSize: FONT_SIZE.xs, fontFamily: FONTS.body, color: colors.textMuted },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: SPACING.sm,
    padding: SPACING.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    maxHeight: 120,
    minHeight: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.body,
    color: colors.text,
    backgroundColor: colors.surfaceAlt,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { opacity: 0.5 },
});
