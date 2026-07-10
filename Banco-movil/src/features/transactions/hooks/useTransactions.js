import { useCallback, useEffect, useState } from 'react';

import { bankClient, getApiError } from '../../../shared/api';
import { formatCurrency, formatDateTime } from '../../../shared/utils/format';

const TYPE_META = {
  DEPOSITO: { label: 'Depósito', icon: 'south-west' },
  TRANSFERENCIA: { label: 'Transferencia', icon: 'swap-horiz' },
  RETIRO: { label: 'Retiro', icon: 'north-east' },
};

const ESTADO_TONE = {
  COMPLETADA: 'success',
  CANCELADA: 'danger',
  PENDIENTE: 'warning',
};

const mapToViewModel = (txn, myAccounts = []) => {
  const tipo = txn?.tipoTransaccion;
  const meta = TYPE_META[tipo] || { label: tipo || 'Movimiento', icon: 'receipt-long' };

  // Signo: depósito entrante (+), retiro saliente (-). Para transferencia, depende
  // de si la cuenta destino es del usuario (entrante) o no (saliente).
  let incoming = tipo === 'DEPOSITO';
  if (tipo === 'TRANSFERENCIA') {
    incoming = myAccounts.includes(String(txn?.cuentaDestino));
  }
  const monto = Number(txn?.monto ?? 0);

  return {
    raw: txn,
    id: txn?.id || txn?._id,
    tipo,
    tipoLabel: meta.label,
    icon: meta.icon,
    incoming,
    montoFmt: `${incoming ? '+' : '-'} ${formatCurrency(monto, txn?.moneda || 'GTQ')}`,
    moneda: txn?.moneda || 'GTQ',
    descripcion: txn?.descripcion || '',
    cuentaOrigen: txn?.cuentaOrigen,
    cuentaDestino: txn?.cuentaDestino,
    estado: txn?.estado,
    estadoTone: ESTADO_TONE[txn?.estado] || 'info',
    fecha: formatDateTime(txn?.createdAt),
  };
};

export function useTransactions(myAccounts = []) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await bankClient.get('/transactions/get', { params: { page: 1, limit: 50 } });
      const list = res.data?.data || res.data || [];
      setTransactions(Array.isArray(list) ? list.map((t) => mapToViewModel(t, myAccounts)) : []);
    } catch (err) {
      setError(getApiError(err, 'No fue posible cargar tus movimientos'));
    } finally {
      setLoading(false);
    }
    // myAccounts se serializa para evitar refetch en cada render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(myAccounts)]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Crea una transacción. payload: { tipoTransaccion, monto, moneda, cuentaOrigen?, cuentaDestino?, descripcion? }
  const createTransaction = useCallback(
    async (payload) => {
      try {
        const res = await bankClient.post('/transactions/create', payload);
        await fetchTransactions();
        return { ok: true, data: res.data };
      } catch (err) {
        return { ok: false, error: getApiError(err, 'No fue posible registrar la transacción') };
      }
    },
    [fetchTransactions]
  );

  return { transactions, loading, error, refetch: fetchTransactions, createTransaction };
}
