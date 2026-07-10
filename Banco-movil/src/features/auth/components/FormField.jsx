import { Controller } from 'react-hook-form';

import { Input } from '../../../shared/components';

// Campo de formulario reutilizable: conecta react-hook-form con el Input compartido.
// Cualquier prop extra (keyboardType, secureTextEntry, etc.) se reenvía al Input.
export function FormField({ control, name, rules, label, error, ...inputProps }) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value } }) => (
        <Input
          label={label}
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          error={error}
          {...inputProps}
        />
      )}
    />
  );
}
