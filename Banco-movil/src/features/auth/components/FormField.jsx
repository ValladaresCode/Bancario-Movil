import { Controller } from 'react-hook-form';

import { DateField, Input } from '../../../shared/components';

// Campo de formulario reutilizable: conecta react-hook-form con el Input
// compartido. Cualquier prop extra (keyboardType, secureTextEntry, etc.) se
// reenvía al Input. type="date" cambia a DateField (selector nativo de
// calendario, sin tipeo libre) manteniendo el mismo cableado de Controller.
export function FormField({ control, name, rules, label, error, type, ...inputProps }) {
  const Field = type === 'date' ? DateField : Input;
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value } }) => (
        <Field
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
