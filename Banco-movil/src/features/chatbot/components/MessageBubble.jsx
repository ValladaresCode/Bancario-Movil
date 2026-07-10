import { StyleSheet, Text, View } from 'react-native';

import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';

// Burbuja de mensaje: alineada a la derecha para el usuario, izquierda para la IA.
export function MessageBubble({ message }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const isUser = message.role === 'user';

  return (
    <View style={[styles.bubble, isUser ? styles.userBubble : styles.modelBubble]}>
      <Text style={[styles.bubbleText, isUser ? styles.userText : styles.modelText]}>{message.content}</Text>
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
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
});
