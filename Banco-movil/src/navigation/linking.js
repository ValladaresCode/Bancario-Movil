// Config de deep linking de React Navigation.
// Mapea URLs entrantes a screens. El enlace del correo de reset:
//   bancariomovil://reset-password?token=XXXX  ->  screen ResetPassword (token en params)
//
// prefixes incluye el scheme de la app (app.json "scheme": "bancariomovil") y, para
// cuando se despliegue con dominio propio, el host https (universal links).
export const linking = {
  prefixes: [
    'bancariomovil://',
    // 'https://tu-dominio.com',  // habilitar al desplegar (requiere assetlinks.json / AASA)
  ],
  config: {
    screens: {
      Welcome: 'welcome',
      Login: 'login',
      Register: 'register',
      VerifyEmail: 'verify-email',
      ForgotPassword: 'forgot-password',
      ResetPassword: 'reset-password',
    },
  },
};
