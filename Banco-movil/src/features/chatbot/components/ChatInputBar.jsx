import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';

// Barra inferior para escribir y enviar mensajes al asistente.
export function ChatInputBar({ text, onChangeText, onSend, sending }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  return (
    <View style={styles.inputBar}>
      <TextInput
        style={styles.input}
        placeholder="Escribe un mensaje"
        placeholderTextColor={colors.textMuted}
        value={text}
        onChangeText={onChangeText}
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
  );
}

const createStyles = (colors) => StyleSheet.create({
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
