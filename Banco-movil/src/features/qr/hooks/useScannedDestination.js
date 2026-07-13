import { useCallback, useEffect, useState } from 'react';

import { authClient, bankClient } from '../../../shared/api';
import { useAccounts } from '../../accounts/hooks/useAccounts';

// Estado de la resolución del destino escaneado.
export const RESOLVE_STATUS = {
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

// Tipos de error diferenciados: cada uno mapea a un copy y una acción en la UI.
export const ERROR_KIND = {
  SELF: 'SELF', // el QR es de una cuenta propia
  NOT_FOUND: 'NOT_FOUND', // 404: la cuenta no existe
  INACTIVE: 'INACTIVE', // 409 / estado inactivo
  NETWORK: 'NETWORK', // sin respuesta del servidor
  SERVER: 'SERVER', // 5xx u otro error del backend
  INVALID_QR: 'INVALID_QR', // payload corrupto (viene del parseo)
};

// Orquesta la validación del destino de un QR ya parseado:
//   guard de auto-transferencia → lookup en Gestor → titular en AuthService.
// `payload` = { numeroCuenta, tipoCuenta } o null; `invalidQR` = true si el QR
// no era de la app. Devuelve status de máquina de estados + errorKind tipado
// (NO strings genéricos) para que la pantalla muestre el mensaje exacto.
export function useScannedDestination(payload, { invalidQR = false } = {}) {
  const { accounts, loading: accountsLoading } = useAccounts();
  const [status, setStatus] = useState(RESOLVE_STATUS.LOADING);
  const [destino, setDestino] = useState(null);
  const [errorKind, setErrorKind] = useState(null);

  const resolve = useCallback(async () => {
    // QR inválido/ajeno: cortar antes de tocar red.
    if (invalidQR || !payload) {
      setDestino(null);
      setStatus(RESOLVE_STATUS.ERROR);
      setErrorKind(ERROR_KIND.INVALID_QR);
      return;
    }

    // Esperar a tener las cuentas propias para que el guard sea confiable.
    if (accountsLoading) {
      setStatus(RESOLVE_STATUS.LOADING);
      return;
    }

    setStatus(RESOLVE_STATUS.LOADING);
    setErrorKind(null);
    setDestino(null);

    // Guard de auto-transferencia: sin fetch si el número es de una cuenta propia.
    const esPropia = accounts.some(
      (a) => String(a.numeroCuenta) === String(payload.numeroCuenta)
    );
    if (esPropia) {
      setStatus(RESOLVE_STATUS.ERROR);
      setErrorKind(ERROR_KIND.SELF);
      return;
    }

    try {
      const res = await bankClient.get(
        `/account/lookup/${payload.numeroCuenta}`
      );
      const acc = res.data?.data || res.data;

      // El nombre del titular vive en AuthService (los backends no se llaman
      // entre sí; el móvil orquesta). Si falla, seguimos sin nombre.
      let titular = '';
      try {
        const prof = await authClient.post('/auth/profile/by-id', {
          userId: acc.userId,
        });
        titular = prof.data?.data?.name || '';
      } catch {
        titular = '';
      }

      setDestino({
        numeroCuenta: acc.numeroCuenta,
        tipoCuenta: acc.tipoCuenta,
        moneda: acc.moneda,
        titular,
      });
      setStatus(RESOLVE_STATUS.SUCCESS);
    } catch (err) {
      const httpStatus = err?.response?.status;
      setStatus(RESOLVE_STATUS.ERROR);
      if (httpStatus === 404) setErrorKind(ERROR_KIND.NOT_FOUND);
      else if (httpStatus === 409) setErrorKind(ERROR_KIND.INACTIVE);
      else if (httpStatus >= 500) setErrorKind(ERROR_KIND.SERVER);
      else if (!err?.response) setErrorKind(ERROR_KIND.NETWORK);
      else setErrorKind(ERROR_KIND.SERVER);
    }
  }, [payload, invalidQR, accounts, accountsLoading]);

  useEffect(() => {
    resolve();
  }, [resolve]);

  return { status, destino, errorKind, retry: resolve };
}
