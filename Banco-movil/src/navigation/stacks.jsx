import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { FONTS, FONT_SIZE } from '../shared/constants/theme';
import { useThemeStore } from '../shared/hooks/useThemeStore';
import { S } from './screens';

// Opciones de header devueltas dinámicamente según el tema
const getStackScreenOptions = (colors) => ({
  headerTitleAlign: 'left',
  headerStyle: { backgroundColor: colors.background },
  headerTintColor: colors.text,
  headerShadowVisible: false,
  headerTitleStyle: { fontFamily: FONTS.displayBold, fontSize: FONT_SIZE.xxxl, fontWeight: '800' },
  contentStyle: { backgroundColor: colors.background },
});

// --- Stack: Inicio ---
const HomeStackNav = createNativeStackNavigator();
export function HomeStack() {
  const { colors } = useThemeStore();
  return (
    <HomeStackNav.Navigator screenOptions={getStackScreenOptions(colors)}>
      <HomeStackNav.Screen name="Dashboard" component={S.Dashboard} options={{ title: 'Inicio' }} />
    </HomeStackNav.Navigator>
  );
}

// --- Stack: Cuentas ---
const AccountsStackNav = createNativeStackNavigator();
export function AccountsStack() {
  const { colors } = useThemeStore();
  return (
    <AccountsStackNav.Navigator screenOptions={getStackScreenOptions(colors)}>
      <AccountsStackNav.Screen name="Accounts" component={S.Accounts} options={{ title: 'Mis Cuentas' }} />
      <AccountsStackNav.Screen name="AccountDetail" component={S.AccountDetail} options={{ title: 'Detalle de Cuenta' }} />
      <AccountsStackNav.Screen name="RequestAccount" component={S.RequestAccount} options={{ title: 'Solicitar Cuenta' }} />
    </AccountsStackNav.Navigator>
  );
}

// --- Stack: Movimientos ---
const TransactionsStackNav = createNativeStackNavigator();
export function TransactionsStack() {
  const { colors } = useThemeStore();
  return (
    <TransactionsStackNav.Navigator screenOptions={getStackScreenOptions(colors)}>
      <TransactionsStackNav.Screen name="Transactions" component={S.Transactions} options={{ title: 'Movimientos' }} />
      <TransactionsStackNav.Screen name="NewTransaction" component={S.NewTransaction} options={{ title: 'Nueva Transacción' }} />
    </TransactionsStackNav.Navigator>
  );
}

// --- Stack: Servicios + Promociones ---
const CatalogStackNav = createNativeStackNavigator();
export function CatalogStack() {
  const { colors } = useThemeStore();
  return (
    <CatalogStackNav.Navigator screenOptions={getStackScreenOptions(colors)}>
      <CatalogStackNav.Screen name="Services" component={S.Services} options={{ title: 'Servicios' }} />
      <CatalogStackNav.Screen name="ServiceDetail" component={S.ServiceDetail} options={{ title: 'Detalle del Servicio' }} />
      <CatalogStackNav.Screen name="Promotions" component={S.Promotions} options={{ title: 'Promociones' }} />
      <CatalogStackNav.Screen name="PromotionDetail" component={S.PromotionDetail} options={{ title: 'Detalle de Promoción' }} />
    </CatalogStackNav.Navigator>
  );
}

// --- Stack: Perfil (+ Favoritos, Divisas, Chatbot) ---
const ProfileStackNav = createNativeStackNavigator();
export function ProfileStack() {
  const { colors } = useThemeStore();
  return (
    <ProfileStackNav.Navigator screenOptions={getStackScreenOptions(colors)}>
      <ProfileStackNav.Screen name="Profile" component={S.Profile} options={{ title: 'Mi Perfil' }} />
      <ProfileStackNav.Screen name="EditProfile" component={S.EditProfile} options={{ title: 'Editar Perfil' }} />
      <ProfileStackNav.Screen name="Favorites" component={S.Favorites} options={{ title: 'Favoritos' }} />
      <ProfileStackNav.Screen name="TransferToFavorite" component={S.TransferToFavorite} options={{ title: 'Transferir a Favorito' }} />
      <ProfileStackNav.Screen name="Currencies" component={S.Currencies} options={{ title: 'Divisas' }} />
      <ProfileStackNav.Screen name="ChatList" component={S.ChatList} options={{ title: 'Asistente' }} />
      <ProfileStackNav.Screen name="Chat" component={S.Chat} options={{ title: 'Conversación' }} />
    </ProfileStackNav.Navigator>
  );
}
