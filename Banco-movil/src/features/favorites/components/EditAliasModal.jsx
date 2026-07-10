import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { Button, Input } from '../../../shared/components';
import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { maskAccountNumber } from '../../../shared/utils/format';
import { notify } from '../../../shared/utils/confirm';

// Modal para editar el alias personalizado de un favorito.
// favorite=null lo mantiene cerrado; onSave viene del hook useFavorites.
export function EditAliasModal({ favorite, onSave, onClose }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const [alias, setAlias] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Precarga el alias actual cada vez que se abre con otro favorito.
  useEffect(() => {
    setAlias(favorite?.alias || '');
  }, [favorite]);

  const onSubmit = async () => {
    if (!alias.trim()) return notify('Atención', 'El alias no puede estar vacío.');

    setSubmitting(true);
    const result = await onSave(favorite._id, { alias: alias.trim() });
    setSubmitting(false);

    if (!result.ok) return notify('Error', result.error);
    onClose();
  };

  return (
    <Modal visible={!!favorite} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.centered}>
          {/* Pressable interior evita que el toque dentro de la tarjeta cierre el modal */}
          <Pressable style={styles.sheet}>
            <Text style={styles.title}>Editar alias</Text>
            {favorite ? (
              <Text style={styles.subtitle}>
                {maskAccountNumber(favorite.cuenta)} · {favorite.tipo}
              </Text>
            ) : null}
            <Input label="Alias" placeholder="Ej: Mamá" value={alias} onChangeText={setAlias} autoFocus />
            <View style={styles.actions}>
              <View style={styles.actionBtn}>
                <Button title="Cancelar" variant="ghost" onPress={onClose} />
              </View>
              <View style={styles.actionBtn}>
                <Button title="Guardar" onPress={onSubmit} loading={submitting} />
              </View>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const createStyles = (colors) => StyleSheet.create({
  overlay: { flex: 1, backgroundColor: colors.overlay || 'rgba(0,0,0,0.5)' },
  centered: { flex: 1, justifyContent: 'center', padding: SPACING.xl },
  sheet: {
    backgroundColor: colors.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: SPACING.lg,
  },
  title: { fontSize: FONT_SIZE.lg, fontFamily: FONTS.displayBold, fontWeight: '700', color: colors.text },
  subtitle: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.body,
    color: colors.textSecondary,
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  actions: { flexDirection: 'row', gap: SPACING.sm },
  actionBtn: { flex: 1 },
});
