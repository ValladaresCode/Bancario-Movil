import { Input, Selector } from '../../../shared/components';
import { ACCOUNT_TYPE_OPTIONS, TRANSACTION_TYPES } from '../../../shared/constants';

// Campos de cuenta destino: número y (solo en transferencias) tipo de cuenta.
export function DestinationFields({ tipo, cuentaDestino, onChangeCuenta, tipoCuentaDestino, onChangeTipoCuenta }) {
  return (
    <>
      <Input
        label="Cuenta de destino"
        placeholder="Número de cuenta"
        keyboardType="number-pad"
        leftIcon="account-balance"
        value={cuentaDestino}
        onChangeText={onChangeCuenta}
      />
      {tipo === TRANSACTION_TYPES.TRANSFERENCIA ? (
        <Selector
          label="Tipo de cuenta destino"
          options={ACCOUNT_TYPE_OPTIONS}
          value={tipoCuentaDestino}
          onChange={onChangeTipoCuenta}
          horizontal={false}
        />
      ) : null}
    </>
  );
}
