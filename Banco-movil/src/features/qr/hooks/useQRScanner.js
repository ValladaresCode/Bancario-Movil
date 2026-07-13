import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCameraPermissions } from 'expo-camera';

import { parseAccountQR } from '../services/qrPayload';

// Maneja permiso de cámara + lock anti-doble-lectura, sin JSX. El lock se
// resetea cada vez que la pantalla RECUPERA el foco: volver con "Atrás" (físico
// o nativo) desde la confirmación no debe dejar el escáner congelado. Al perder
// el foco se pausa el escaneo para no leer en segundo plano.
export function useQRScanner({ onResult }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [active, setActive] = useState(false);
  const lockedRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      // Enfoca: soltar lock y reactivar escáner.
      lockedRef.current = false;
      setActive(true);
      return () => {
        // Desenfoca: pausar.
        setActive(false);
      };
    }, [])
  );

  const handleBarcode = useCallback(
    ({ data }) => {
      // Un solo disparo por enfoque: el primer escaneo bloquea hasta re-enfocar.
      if (lockedRef.current) return;
      lockedRef.current = true;

      try {
        const payload = parseAccountQR(data);
        onResult({ payload, invalidQR: false });
      } catch {
        // InvalidQRError (QR ajeno/corrupto) o cualquier fallo de parseo → QR
        // inválido; la pantalla de confirmación lo distingue del resto.
        onResult({ payload: null, invalidQR: true });
      }
    },
    [onResult]
  );

  return { permission, requestPermission, active, handleBarcode };
}
