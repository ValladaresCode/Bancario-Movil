# PROMPT MAESTRO — Migración del Gestor Bancario a React Native (app cliente)

Eres un agente Claude Code con acceso de lectura a DOS proyectos hermanos en el disco:

- **Backend (fuente de verdad de contratos):**
  `C:\Users\Angel Geovanny\Desktop\Sexto\Microservicios-GestorBancario\`
  - `AuthService-GestionBancaria\` → microservicio de auth/usuarios (Node/Express + PostgreSQL).
  - `Gestor_Bancario_Backend\` → microservicio bancario (Node/Express + MongoDB).
  - `Gestor_Bancario_Frontend\` → **frontend web React ya implementado con la misma arquitectura feature-based**. ÚSALO como referencia 1:1 de los flujos y contratos (carpeta `src/shared/api/`, `src/features/*`).
- **App móvil a construir (donde TRABAJAS):**
  `C:\Users\Angel Geovanny\Desktop\Sexto\Bancario-Movil\Bancario-Movil\`

Tu objetivo: convertir el template Expo actual en una **app cliente** React Native que consuma ambos microservicios, siguiendo `ARCHITECTURE.md` (raíz de Microservicios) **con las correcciones indicadas más abajo**.

## Reglas globales (NO negociables)

1. **Lenguaje JavaScript/JSX** (sin TypeScript). Elimina la configuración expo-router/TS del template y migra a **React Navigation 7**.
2. **Arquitectura feature-based** exacta de `ARCHITECTURE.md`: `src/navigation/`, `src/features/<dominio>/{hooks,screens}`, `src/shared/{api,store,constants,components}`.
3. **Screens "tontas"** (render + wiring), **hooks** con toda la lógica/estado y llamadas a API. Mapea entidades crudas → ViewModel en el hook.
4. **Estilos solo con tokens** de `src/shared/constants/theme.js`. Nada hardcodeado.
5. **NO implementes refresh-token.** El backend NO tiene `/refresh` (el JWT dura ~100 años). El interceptor de respuesta hace: **en 401 → `logout()` y vuelve a Auth**. Ignora la sección de cola/refresh del ARCHITECTURE.md.
6. El token se envía SIEMPRE en dos headers: `Authorization: Bearer <token>` **y** `x-token: <token>`.
7. **Solo rol cliente** (`USER_ROLE`). No construyas pantallas de administración.
8. Antes de escribir cada feature, **abre el archivo equivalente en `Gestor_Bancario_Frontend\src\...`** y respeta los nombres de campos JSON EXACTOS (son case-sensitive).
9. Trabaja en ramas/commits pequeños y deja la app **compilando y ejecutable con Expo** en cada hito.
10. **No portes patrones de navegador.** En React Native **no existen** `File`, `Blob`, `localStorage`, `window`, `fetch` con `File`, ni `import.meta.env`. Sustituye: `localStorage`→`AsyncStorage`/`SecureStore`; `import.meta.env`→`process.env.EXPO_PUBLIC_*`; objetos `File` de `<input type=file>`→objeto multipart nativo de RN (ver regla de FormData abajo). El `Gestor_Bancario_Frontend` es referencia de **contratos y flujos**, NO de APIs de navegador.
11. **React Navigation 7 (no v6).** Usa exclusivamente la sintaxis/estándares de la **v7**; no mezcles patrones obsoletos de v6 (ver sección Navigation).
12. **FormData con imágenes en RN:** al adjuntar imágenes de `expo-image-picker`, el campo NO es un `File`, es un objeto `{ uri, name, type }` (ver sección FormData abajo).

## Configuración de red / endpoints

`.env` (corrige el actual, que está mal):
```
EXPO_PUBLIC_AUTH_URL=http://192.168.42.103:4000/api/v1
EXPO_PUBLIC_BANK_URL=http://192.168.42.103:3006/gestionBancaria/api/v1
EXPO_PUBLIC_BANK_HEALTH_URL=http://192.168.42.103:3006/health
```
> Usa la IP LAN de la máquina del backend (no `localhost`, el dispositivo no resuelve localhost del PC). Deja los valores leídos por `endpoints.js` con fallback.

| Servicio | Base URL | Auth |
|---|---|---|
| AuthService | `EXPO_PUBLIC_AUTH_URL` (`:4000/api/v1`) | login/registro/verificación/perfil |
| Banking | `EXPO_PUBLIC_BANK_URL` (`:3006/gestionBancaria/api/v1`) | cuentas, transacciones, favoritos, servicios, promociones, divisas, chatbot |

## Dependencias a instalar (instalación HÍBRIDA — crítico para SDK 55)

NO instales todo con `pnpm add`. Los **módulos nativos del ecosistema Expo deben instalarse con `npx expo install`** para que Expo resuelva la versión EXACTA compatible con el SDK 55 (instalarlos con `pnpm add` baja la última de npm y rompe el build nativo / Expo Go).

**Librerías puras de JS/React → `pnpm add`:**
```
pnpm add @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs \
  zustand axios react-hook-form
```
(`@react-navigation/*`, `zustand`, `axios`, `react-hook-form` no tienen código nativo.)

**Módulos nativos de Expo → `npx expo install` (uno o varios, Expo fija la versión del SDK 55):**
```
npx expo install @react-native-async-storage/async-storage expo-secure-store \
  react-native-screens react-native-safe-area-context \
  expo-image-picker @expo/vector-icons
```
> Regla: si el paquete aparece en la doc de Expo o empieza por `expo-`/`react-native-*` y toca el runtime nativo → `npx expo install`. Si es lógica JS pura → `pnpm add`.

> **`react-native-screens` es la base de `createNativeStackNavigator` (v7) — es obligatorio.** En cambio **`react-native-gesture-handler` NO es necesario** para esta app: native-stack v7 y bottom-tabs funcionan sin él. **Instálalo solo si** decides implementar gestos manuales complejos en la UI (swipeables, drag, etc.); en ese caso `npx expo install react-native-gesture-handler` y recuerda el `import 'react-native-gesture-handler'` en la primera línea de `index.js`. Por defecto, **omítelo**.

Quita `expo-router` de `package.json`, de `app.json` (plugins) y borra `src/app/`. Cambia `main` a `index.js` con `registerRootComponent(App)`. Tras cambios de deps nativas, reinicia con `npx expo start -c` (limpia caché de Metro).

## Estructura objetivo

```
src/
├── navigation/
│   ├── AppNavigator.jsx     # decide Auth vs Main según authStore (_hasHydrated)
│   ├── AuthStack.jsx        # Login, Register, VerifyEmail, ForgotPassword
│   └── MainTabs.jsx         # Tabs: Inicio, Cuentas, Movimientos, Servicios, Perfil
│
├── features/
│   ├── auth/        hooks/useAuth.js          screens/{Login,Register,VerifyEmail,ForgotPassword}Screen.jsx
│   ├── accounts/    hooks/useAccounts.js      screens/{Accounts,AccountDetail}Screen.jsx
│   ├── transactions/hooks/useTransactions.js  screens/{Transactions,NewTransaction}Screen.jsx
│   ├── favorites/   hooks/useFavorites.js     screens/{Favorites,TransferToFavorite}Screen.jsx
│   ├── services/    hooks/useServices.js      screens/{Services,ServiceDetail}Screen.jsx
│   ├── promotions/  hooks/usePromotions.js    screens/{Promotions,PromotionDetail}Screen.jsx
│   ├── chatbot/     hooks/useChatbot.js       screens/{ChatList,Chat}Screen.jsx
│   ├── currencies/  hooks/useCurrencies.js    screens/CurrenciesScreen.jsx
│   └── profile/     hooks/useProfile.js       screens/ProfileScreen.jsx
│
└── shared/
    ├── api/         authClient.js, bankClient.js, buildFormData.js, index.js
    ├── store/       authStore.js
    ├── constants/   theme.js, endpoints.js
    └── components/  Button.jsx, Input.jsx, Common.jsx (LoadingSpinner, EmptyState, Card), index.js (barril)
```

---

## CAPA SHARED — implementar PRIMERO

### `shared/constants/theme.js`
Exporta `COLORS`, `SPACING`, `FONT_SIZE`, `SHADOWS`. **Define `COLORS.white`** (bug del ref). Paleta bancaria: primario azul `#208AEF` (coincide con splash de `app.json`), secundario, fondo claro/oscuro, success/danger/warning, neutrales. Toma escala de `Bancario-Movil\Bancario-Movil\src\constants\theme.ts` como base y conviértela a JS.

### `shared/constants/endpoints.js`
```js
export const ENDPOINTS = {
  AUTH: process.env.EXPO_PUBLIC_AUTH_URL || 'http://localhost:4000/api/v1',
  BANK: process.env.EXPO_PUBLIC_BANK_URL || 'http://localhost:3006/gestionBancaria/api/v1',
  BANK_HEALTH: process.env.EXPO_PUBLIC_BANK_HEALTH_URL || 'http://localhost:3006/health',
};
```

### `shared/store/authStore.js` (Zustand + persist)
- `create(persist(...))`, `name: "auth-storage"`, storage = AsyncStorage.
- Estado: `token`, `user`, `isAuthenticated`, `_hasHydrated`.
- `user` = `{ id, name, profilePicture, role }` (tal cual `userDetails` del login).
- Acciones:
  - `login({ token, user })`: guarda en memoria + persiste + escribe `token` en **expo-secure-store** (clave `accessToken`) por ser dato sensible.
  - `logout()`: limpia estado + borra SecureStore.
  - `setUser(patch)`: merge parcial del perfil (para PATCH /users/me).
- `onRehydrateStorage` → marca `_hasHydrated: true`.
- Acceso imperativo `useAuthStore.getState()` para los interceptores.

### `shared/api/authClient.js` y `shared/api/bankClient.js`
Dos instancias Axios (`baseURL` = ENDPOINTS.AUTH / ENDPOINTS.BANK, `timeout: 8000`). Patrón idéntico (copia el de `Gestor_Bancario_Frontend\src\shared\api\api.js`, adaptado a RN):
- **Request interceptor:** lee `useAuthStore.getState().token`; si existe, setea `Authorization: Bearer` y `x-token`.
- **Response interceptor:** en `401` → `useAuthStore.getState().logout()` (sin refresh). Propaga el error con mensaje legible (`error.response?.data?.message`).
- Para multipart (registro, perfil con foto) NO fuerces `Content-Type`; deja que Axios/RN pongan el boundary.

### FormData con imágenes (regla obligatoria para registro y perfil)
En React Native **no existe el objeto `File` del navegador**. La imagen elegida con `expo-image-picker` se adjunta como un objeto nativo `{ uri, name, type }`. Crea un helper en `shared/api/buildFormData.js` y úsalo en registro y edición de perfil:
```js
// imageUri = result.assets[0].uri (de expo-image-picker)
const formData = new FormData();
formData.append('name', name);
formData.append('email', email);
// ...resto de campos de texto...
if (imageUri) {
  formData.append('profilePicture', {
    uri: imageUri,                 // file:// del dispositivo
    name: 'profile.jpg',
    type: 'image/jpeg',
  });
}
```
> No envuelvas el objeto en `JSON.stringify`, no uses `Blob`, no añadas `Content-Type` manual.
> **El `name` SIEMPRE debe llevar una extensión válida** (`'profile.jpg'`, `'profile.png'`), porque **Multer en el backend puede validar estrictamente la extensión** y rechazar el archivo si falta o no coincide. Mantén coherencia `name`↔`type`: `.jpg`/`.jpeg`→`image/jpeg`, `.png`→`image/png`. Deriva ambos de la URI cuando puedas; si no, usa `'profile.jpg'` + `image/jpeg` como fallback seguro.

### `shared/components/`
- `Button.jsx`: prop `variant` (`primary`/`secondary`), estado `loading` → `ActivityIndicator`, reenvía `...props`, permite `style`.
- `Input.jsx`: wrapper de `TextInput` con `label` y `error`, spread `...props` (soporta `secureTextEntry`, `keyboardType`).
- `Common.jsx`: `LoadingSpinner`, `EmptyState`, `Card`.
- `index.js`: barril que reexporta todo (evita la duplicación de componentes señalada en el ARCHITECTURE.md). **Una sola ubicación.**

---

## CAPA NAVIGATION

> **React Navigation 7 — usa SOLO sintaxis v7, no v6.** En particular: `NavigationContainer` envuelve todo en `App.jsx`; navegadores creados con `createNativeStackNavigator()` / `createBottomTabNavigator()`; configura `screenOptions` a nivel de Navigator; usa la prop `tabBarIcon`/`headerShown` actuales; evita APIs deprecadas de v6 (no `tabBarOptions`/`headerStyle` heredados a nivel viejo — usa `screenOptions`). Si dudas, consulta la doc v7, no copies snippets v6.

- **`AppNavigator.jsx` — anti-parpadeo de hidratación (regla estricta):** lee `isAuthenticated` y `_hasHydrated` del `authStore`.
  - **Mientras `_hasHydrated === false`, retorna SIEMPRE una pantalla de carga limpia** (un `<View>` centrado con `ActivityIndicator` sobre `COLORS.background`). **No** renderices `NavigationContainer`/`AuthStack`/`MainTabs` todavía.
  - Solo cuando `_hasHydrated === true`, renderiza `<MainTabs/>` si `isAuthenticated`, o `<AuthStack/>` si no (intercambio de árbol completo, sin rutas protegidas individuales).
  - Motivo: si renderizas antes de que Zustand rehidrate desde AsyncStorage, un usuario ya autenticado vería el Login parpadear ~1 frame. La guarda de hidratación lo elimina por completo.
- **`AuthStack.jsx`**: native-stack v7, `screenOptions={{ headerShown:false }}`. Pantallas: `Login`, `Register`, `VerifyEmail`, `ForgotPassword`.
- **`MainTabs.jsx`**: bottom-tabs con estilos de `COLORS`. Tabs e iconos `MaterialIcons`:
  - **Inicio** (`home`) → DashboardScreen (resumen: saldo total por cuenta + accesos rápidos).
  - **Cuentas** (`account-balance`) → `AccountsStack` (Accounts → AccountDetail).
  - **Movimientos** (`swap-horiz`) → `TransactionsStack` (Transactions → NewTransaction).
  - **Servicios** (`local-offer`) → `CatalogStack` (Services/Promotions con tabs superiores o segmentado → detalle).
  - **Perfil** (`person`) → `ProfileStack` (Profile → Favorites, Currencies, ChatList/Chat).
  - Patrón: cada tab que navega a detalle usa un `NativeStackNavigator` anidado.

---

## FEATURES — contratos EXACTOS del backend

> Para cada feature: hook con `{ data, loading, error }` + `useCallback` + `useEffect`, mapToViewModel, lectura defensiva (`res.data.data || res.data || []`), y `refetch` para pull-to-refresh. Screens con `FlatList` + `RefreshControl` + `ListEmptyComponent`, formularios con `useForm` + `<Controller>` + `Alert.alert` en catch.

### auth (`authClient`)
- **Login** — `POST /auth/login` body `{ email, password }` → `{ token, userDetails:{ id, name, profilePicture, role }, expiresAt }`. Tras éxito: `authStore.login({ token, user: userDetails })`.
- **Registro** — `POST /auth/signup-request` **multipart/form-data**: `name`, `email`, `password`, `phone`, opcionales `fechaNacimiento`, `dpi`, `ingresosMensuales`, `profilePicture` (imagen de `expo-image-picker` adjuntada con el objeto nativo `{ uri, name, type }` — ver regla de FormData). Respuesta `{ success, user, message, emailVerificationRequired }`. Tras registro NO hay sesión: navega a `VerifyEmail` mostrando "revisa tu correo". (Queda PENDING hasta que un admin la apruebe — explícalo en UI.)
- **Verificar email** — `POST /auth/verify-email` body `{ token }`. También permite reenviar: `POST /auth/resend-verification` body `{ email }`.
- **Olvidé contraseña** — `POST /auth/forgot-password` `{ email }`; reset `POST /auth/reset-password` `{ token, newPassword }`.
- **Bug a corregir del ref:** el form de login envía `email` (NO `emailOrUsername`). Coma faltante en `Alert.alert` de Register. `sytle`→`style`.

### accounts (`bankClient`)
- **Listar mis cuentas** — `GET /account/get?page=1&limit=10&misCuentas=true&estado=all` → `{ data:[{ userId, numeroCuenta, tipoCuenta, moneda, saldo, estado, createdAt, updatedAt }], pagination:{ currentPage,totalPages,totalRecords,limit } }`.
- **Solicitar cuenta** (cliente) — `POST /account/request-create` body `{ tipoCuenta:('AHORRO'|'MONETARIA'), moneda:('GTQ'|'USD'|'EUR'|'MXN'|'COP'|'JPY') }` → queda PENDING.
- ViewModel: formatea `saldo` con `moneda`, etiqueta `tipoCuenta`, badge de `estado`. Constantes en `shared/constants` (ACCOUNT_TYPES, CURRENCIES) copiadas de `Gestor_Bancario_Frontend\src\shared\constants\index.js`.

### transactions (`bankClient`)
- **Crear** — `POST /transactions/create` body `{ tipoTransaccion:('DEPOSITO'|'TRANSFERENCIA'|'RETIRO'), monto, moneda, cuentaOrigen?, cuentaDestino?, descripcion? }`. Para TRANSFERENCIA `descripcion` es requerida. Respuesta `{ data:{ id, tipoTransaccion, cuentaOrigen, cuentaDestino, monto, moneda, descripcion, estado:('COMPLETADA'|'CANCELADA'), createdAt }, applied?:{ montoDebitado, montoAcreditado, tasa } }`.
- **Límites a validar en UI** (mensajes del backend): máx **Q2,000** por transacción, máx **Q10,000/día**; saldo insuficiente; cuenta no encontrada. Muestra el `message` del 400.
- **Listar** — `GET /transactions/get?page&limit` → `{ data:[transaction], pagination }`. ViewModel: signo +/- según si la cuenta es origen/destino del usuario, icono por `tipoTransaccion`, color por `estado`.

### favorites (`bankClient`)
- **Listar** — `GET /favorites/` → `{ favorites:[{ _id, userId, cuenta, tipo, alias, createdAt }] }`.
- **Agregar** — `POST /favorites/` body `{ cuenta, tipo, alias }` → `{ favorite }` (409 si ya existe).
- **Eliminar** — `DELETE /favorites/:id`.
- **Transferir a favorito (flujo de 2 pasos):**
  1. (opcional) `POST /favorites/:id/transfer` `{ monto, moneda, descripcion? }` → solo **prepara** (`data.favorito`).
  2. Ejecuta de verdad con `POST /transactions/create` `{ tipoTransaccion:'TRANSFERENCIA', cuentaDestino: favorito.cuenta, cuentaOrigen: <cuenta del usuario>, monto, moneda, descripcion }`.
  - La screen `TransferToFavoriteScreen` debe pedir cuenta origen (selector de mis cuentas), monto, moneda, descripción.

### services (`bankClient`, solo lectura para cliente)
- **Listar** — `GET /services/?status=ACTIVE&page&limit&q&sortBy` → `{ data:[service], pagination }` (cliente ve solo ACTIVE; `internalNote` viene oculto).
- **Detalle** — `GET /services/:id`.
- ViewModel: `name`, `description`, `price`+`currency`, `imageUrl`, `discount` (si aplica). Copia formato de `Gestor_Bancario_Frontend\src\features\services\components\ServiceCard.jsx`.

### promotions (`bankClient`, solo lectura)
- **Listar** — `GET /promotions/?status=ACTIVE&page&limit&q` ; **Detalle** — `GET /promotions/:id`. Render tipo tarjeta con imagen, términos, vigencia.

### currencies (`bankClient`, público)
- **Tasas** — `GET /currencies/?base=GTQ` → `{ base, rates:{ GTQ,USD,EUR,MXN,COP,JPY }, lastUpdate }`. Pantalla conversor: monto + moneda origen/destino usando `rates`. Útil también para previsualizar conversión antes de transferir.

### profile (`authClient`)
- **Ver** — `GET /auth/profile` → `{ data:{ id, name, email, phone, profilePicture, role, fechaNacimiento, dpi, ingreso_mensuales } }`.
- **Editar** — `PATCH /users/me` **multipart**: `name?`, `phone?`, `profilePicture?` (objeto nativo `{ uri, name, type }` de `expo-image-picker` — ver regla de FormData), `fechaNacimiento?`, `dpi?`, `ingresosMensuales?` (puede quedar PENDING de aprobación admin; informa en UI). Tras éxito → `authStore.setUser(...)`.
- Botón **Cerrar sesión** → `authStore.logout()`.

### chatbot (`bankClient`)
- **Historial** — `GET /chatbot/` → `{ chats:[{ _id, title, updatedAt }] }`.
- **Conversación** — `GET /chatbot/:id` → `{ chat:{ messages:[{ role:('user'|'model'), content }] } }`.
- **Enviar** — `POST /chatbot/` body `{ chatId?, message }` → `{ chatId, reply, messages }`. UI tipo chat (burbujas user/model), `KeyboardAvoidingView`, autoscroll.

---

## Orden de implementación (hitos verificables)

1. **Andamiaje:** instalación híbrida de deps (`pnpm add` JS puro + `npx expo install` nativos), quitar expo-router, `App.jsx` (con `NavigationContainer` v7) + `index.js`, theme.js, endpoints.js, helper `buildFormData.js`, componentes shared, authStore (con guarda `_hasHydrated`), dos clients Axios. App arranca con la pantalla de carga y luego muestra Login sin parpadeo.
2. **Auth completo:** Login funcional contra `:4000` (con backend corriendo) → entra a Tabs. Registro + verificación + olvido de contraseña.
3. **Cuentas + Dashboard:** listar mis cuentas, detalle, solicitar cuenta. Home con resumen.
4. **Transacciones + Transferencias + Favoritos** (incluye el flujo de 2 pasos y validación de límites).
5. **Servicios + Promociones + Divisas** (catálogo solo lectura + conversor).
6. **Perfil + Chatbot.**

## Criterios de aceptación

- App ejecutable con `npx expo start` / Expo Go, sin TypeScript ni expo-router residual; módulos nativos instalados vía `npx expo install` (versiones del SDK 55).
- Login real contra los microservicios; token persistido (SecureStore) y rehidratado **sin parpadeo** (pantalla de carga mientras `_hasHydrated === false`).
- Navegación implementada con **React Navigation 7** (sin patrones v6 deprecados).
- Subida de imágenes (registro/perfil) con `FormData` usando el objeto nativo `{ uri, name, type }`, no `File`.
- Cada llamada lleva `Authorization` + `x-token`; un 401 cierra sesión.
- Nombres de campos JSON idénticos al backend (verificados contra `Gestor_Bancario_Frontend`).
- Cero colores/espaciados hardcodeados (todo desde `theme.js`).
- Listas con pull-to-refresh y estado vacío; formularios con validación react-hook-form y manejo de error con `Alert`.
- Transferencia respeta límites Q2,000/tx y Q10,000/día (muestra el mensaje del backend).

## Notas de verificación al terminar

- Levantar ambos backends (`:4000` y `:3006`) y probar el flujo login → ver cuentas → crear transferencia → ver movimiento.
- Si el dispositivo físico no conecta, revisar que `.env` use la IP LAN y que el firewall permita los puertos.
- Confirmar `GET :3006/health` responde antes de depurar el cliente bancario.
