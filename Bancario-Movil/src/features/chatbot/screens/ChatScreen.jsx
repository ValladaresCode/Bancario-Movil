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
import { COLORS, FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useChat } from '../hooks/useChatbot';

export function ChatScreen({ route }) {
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
          <ActivityIndicator color={COLORS.primary} />
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
          <ActivityIndicator size="small" color={COLORS.primary} />
          <Text style={styles.typing}>El asistente está escribiendo…</Text>
        </View>
      ) : null}

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Escribe un mensaje"
          placeholderTextColor={COLORS.textMuted}
          value={text}
          onChangeText={setText}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!text.trim() || sending) && styles.sendBtnDisabled]}
          onPress={onSend}
          disabled={!text.trim() || sending}
        >
          <MaterialIcons name="send" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { padding: SPACING.lg, gap: SPACING.sm, flexGrow: 1 },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.lg,
  },
  // Burbuja del usuario: acento de marca con texto blanco.
  userBubble: { alignSelf: 'flex-end', backgroundColor: COLORS.primary, borderBottomRightRadius: RADIUS.sm },
  // Burbuja del asistente: superficie tintada con borde sutil.
  modelBubble: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderBottomLeftRadius: RADIUS.sm,
  },
  bubbleText: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.body, lineHeight: 20 },
  userText: { color: COLORS.white },
  modelText: { color: COLORS.text },
  typingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xs,
  },
  typing: { fontSize: FONT_SIZE.xs, fontFamily: FONTS.body, color: COLORS.textMuted },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: SPACING.sm,
    padding: SPACING.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  input: {
    flex: 1,
    maxHeight: 120,
    minHeight: 44,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.body,
    color: COLORS.text,
    backgroundColor: COLORS.surfaceAlt,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { opacity: 0.5 },
});
