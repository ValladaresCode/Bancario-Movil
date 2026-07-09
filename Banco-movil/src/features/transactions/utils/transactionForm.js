import { TRANSACTION_LIMITS, TRANSACTION_TYPES } from '../../../shared/constants';
import { formatCurrency } from '../../../shared/utils/format';

// Reglas de qué campos aplican según el tipo de transacción.
export const originIsSelected = (tipo) =>
  tipo === TRANSACTION_TYPES.TRANSFERENCIA || tipo === TRANSACTION_TYPES.RETIRO;

export const destinoIsSelected = (tipo) =>
  tipo === TRANSACTION_TYPES.TRANSFERENCIA || tipo === TRANSACTION_TYPES.DEPOSITO;

export const descripcionIsRequired = (tipo) =>
  tipo === TRANSACTION_TYPES.TRANSFERENCIA;

// Valida el formulario completo. Devuelve el mensaje de error o null si es válido.
export const validateTransactionForm = ({
  tipo,
  monto,
  cuentaOrigen,
  selectedAccount,
  cuentaDestino,
  tipoCuentaDestino,
  descripcion,
}) => {
  const montoNum = Number(monto);
  if (!montoNum || montoNum <= 0) return 'Ingresa un monto válido.';
  if (montoNum > TRANSACTION_LIMITS.PER_TRANSACTION) {
    return `El monto máximo por transacción es ${formatCurrency(TRANSACTION_LIMITS.PER_TRANSACTION, 'GTQ')}.`;
  }
  if (originIsSelected(tipo)) {
    if (!cuentaOrigen) return 'Selecciona la cuenta de origen.';
    if (selectedAccount && montoNum > selectedAccount.saldo) {
      return `Saldo insuficiente. Disponible: ${selectedAccount.saldoFmt}.`;
    }
  }
  if (destinoIsSelected(tipo)) {
    if (!cuentaDestino.trim()) return 'Ingresa el número de cuenta de destino.';
    if (tipo === TRANSACTION_TYPES.TRANSFERENCIA && !tipoCuentaDestino) {
      return 'Selecciona el tipo de cuenta de destino.';
    }
  }
  if (descripcionIsRequired(tipo) && !descripcion.trim()) {
    return 'La descripción es requerida para transferencias.';
  }
  return null;
};

// Arma el payload que espera el backend según el tipo de transacción.
export const buildTransactionPayload = ({
  tipo,
  monto,
  moneda,
  cuentaOrigen,
  cuentaDestino,
  tipoCuentaDestino,
  descripcion,
}) => {
  const payload = {
    tipoTransaccion: tipo,
    monto: Number(monto),
    moneda,
  };
  if (originIsSelected(tipo)) payload.cuentaOrigen = cuentaOrigen;
  if (destinoIsSelected(tipo)) {
    payload.cuentaDestino = cuentaDestino.trim();
    payload.tipoCuenta = tipoCuentaDestino;
  }
  if (descripcion.trim()) payload.descripcion = descripcion.trim();
  return payload;
};
