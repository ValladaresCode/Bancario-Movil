import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { Button, Card, Input, Selector } from '../../../shared/components';
import { ACCOUNT_TYPE_OPTIONS } from '../../../shared/constants';
import { SPACING } from '../../../shared/constants/theme';
import { notify } from '../../../shared/utils/confirm';

// Formulario para agregar una cuenta favorita (número, tipo y alias).
// Maneja su propio estado; el padre solo provee addFavorite (del hook).
export function AddFavoriteForm({ addFavorite, onSuccess }) {
  const [cuenta, setCuenta] = useState('');
  const [alias, setAlias] = useState('');
  const [tipo, setTipo] = useState(ACCOUNT_TYPE_OPTIONS[0].value);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    if (!cuenta.trim()) return notify('Atención', 'Ingresa el número de cuenta.');
    if (!alias.trim()) return notify('Atención', 'Asigna un alias al favorito.');

    setSubmitting(true);
    const result = await addFavorite({ cuenta: cuenta.trim(), alias: alias.trim(), tipo });
    setSubmitting(false);

    if (!result.ok) return notify('Error', result.error);

    setCuenta('');
    setAlias('');
    setTipo(ACCOUNT_TYPE_OPTIONS[0].value);
    onSuccess?.();
  };

  return (
    <Card style={styles.form}>
      <Input
        label="Número de cuenta"
        placeholder="Ej: 1234567890"
        keyboardType="number-pad"
        value={cuenta}
        onChangeText={setCuenta}
      />
      <Input label="Alias" placeholder="Ej: Mamá" value={alias} onChangeText={setAlias} />
      <Selector label="Tipo de cuenta" options={ACCOUNT_TYPE_OPTIONS} value={tipo} onChange={setTipo} />
      <Button title="Guardar favorito" onPress={onSubmit} loading={submitting} />
    </Card>
  );
}

const styles = StyleSheet.create({
  form: { gap: SPACING.xs },
});
