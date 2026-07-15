import { Alert, Platform } from 'react-native';

// Confirmación cross-platform (ej. Logout). En web Alert.alert con botones es no-op,
// así que usamos window.confirm (síncrono y bloqueante).
export function confirmAction({
  title,
  message,
  confirmText = 'Aceptar',
  cancelText = 'Cancelar',
  destructive = false,
  onConfirm,
}) {
  if (Platform.OS === 'web') {
    if (window.confirm(message ? `${title}\n\n${message}` : title)) onConfirm?.();
    return;
  }
  Alert.alert(title, message, [
    { text: cancelText, style: 'cancel' },
    { text: confirmText, style: destructive ? 'destructive' : 'default', onPress: onConfirm },
  ]);
}

// Aviso simple cross-platform CON callback opcional (ej. éxitos/errores que navegan o limpian).
// El callback corre SIEMPRE dentro del flujo del aviso → paridad web/nativo:
//  - web: window.alert bloquea el hilo; al cerrarse, ejecutamos el callback.
//  - nativo: el callback va en el onPress del botón para respetar la asincronía de Alert.alert
//    (si se ejecutara debajo del alert, la pantalla se cerraría antes de leer el mensaje).
export function notify(title, message, onConfirm) {
  if (Platform.OS === 'web') {
    window.alert(message ? `${title}\n\n${message}` : title);
    onConfirm?.();
    return;
  }
  Alert.alert(title, message, [{ text: 'Aceptar', onPress: onConfirm }]);
}
