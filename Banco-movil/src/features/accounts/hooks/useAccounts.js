import { useCallback, useEffect, useState } from 'react';

import { bankClient, getApiError } from '../../../shared/api';
import { ACCOUNT_TYPE_LABELS } from '../../../shared/constants';
import { formatCurrency } from '../../../shared/utils/format';

// Normaliza el estado (puede venir como boolean o string) a etiqueta + tono de badge.
const mapEstado = (estado) => {
  if (estado === true || estado === 'ACTIVA' || estado === 'ACTIVE') {
    return { label: 'Activa', tone: 'success' };
  }
  if (estado === false || estado === 'INACTIVA' || estado === 'INACTIVE') {
    return { label: 'Inactiva', tone: 'danger' };
  }
  if (estado === 'PENDING' || estado === 'PENDIENTE') {
    return { label: 'Pendiente', tone: 'warning' };
  }
  return { label: String(estado ?? 'N/D'), tone: 'info' };
};

const mapToViewModel = (account) => {
  const estado = mapEstado(account?.estado);
  return {
    raw: account,
    numeroCuenta: account?.numeroCuenta,
    tipoCuenta: account?.tipoCuenta,
    tipoLabel: ACCOUNT_TYPE_LABELS[account?.tipoCuenta] || account?.tipoCuenta || 'Cuenta',
    moneda: account?.moneda || 'GTQ',
    saldo: Number(account?.saldo ?? 0),
    saldoFmt: formatCurrency(account?.saldo, account?.moneda || 'GTQ'),
    estadoLabel: estado.label,
    estadoTone: estado.tone,
    createdAt: account?.createdAt,
  };
};

export function useAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await bankClient.get('/account/get', {
        params: { misCuentas: true, page: 1, limit: 50, estado: 'all' },
      });
      const list = res.data?.data || res.data || [];
      setAccounts(Array.isArray(list) ? list.map(mapToViewModel) : []);
    } catch (err) {
      setError(getApiError(err, 'No fue posible cargar tus cuentas'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  // Solicitar la creación de una cuenta (queda PENDING).
  const requestAccount = useCallback(
    async ({ tipoCuenta, moneda }) => {
      try {
        await bankClient.post('/account/request-create', { tipoCuenta, moneda });
        await fetchAccounts();
        return { ok: true };
      } catch (err) {
        return { ok: false, error: getApiError(err, 'No fue posible solicitar la cuenta') };
      }
    },
    [fetchAccounts]
  );

  return { accounts, loading, error, refetch: fetchAccounts, requestAccount };
}
