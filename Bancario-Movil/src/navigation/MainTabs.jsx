import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';

import { COLORS, FONTS, FONT_SIZE } from '../shared/constants/theme';
import { withErrorBoundary } from '../shared/components';

import { DashboardScreen } from '../features/accounts/screens/DashboardScreen';
import { AccountsScreen } from '../features/accounts/screens/AccountsScreen';
import { AccountDetailScreen } from '../features/accounts/screens/AccountDetailScreen';
import { RequestAccountScreen } from '../features/accounts/screens/RequestAccountScreen';
import { TransactionsScreen } from '../features/transactions/screens/TransactionsScreen';
import { NewTransactionScreen } from '../features/transactions/screens/NewTransactionScreen';
import { ServicesScreen } from '../features/services/screens/ServicesScreen';
import { ServiceDetailScreen } from '../features/services/screens/ServiceDetailScreen';
import { PromotionsScreen } from '../features/promotions/screens/PromotionsScreen';
import { PromotionDetailScreen } from '../features/promotions/screens/PromotionDetailScreen';
import { ProfileScreen } from '../features/profile/screens/ProfileScreen';
import { EditProfileScreen } from '../features/profile/screens/EditProfileScreen';
import { FavoritesScreen } from '../features/favorites/screens/FavoritesScreen';
import { TransferToFavoriteScreen } from '../features/favorites/screens/TransferToFavoriteScreen';
import { CurrenciesScreen } from '../features/currencies/screens/CurrenciesScreen';
import { ChatListScreen } from '../features/chatbot/screens/ChatListScreen';
import { ChatScreen } from '../features/chatbot/screens/ChatScreen';

const Tab = createBottomTabNavigator();

// Cada pantalla envuelta en ErrorBoundary: un error de render muestra un fallback
// con "Reintentar" en lugar de dejar la página totalmente en blanco.
const S = {
  Dashboard: withErrorBoundary(DashboardScreen),
  Accounts: withErrorBoundary(AccountsScreen),
  AccountDetail: withErrorBoundary(AccountDetailScreen),
  RequestAccount: withErrorBoundary(RequestAccountScreen),
  Transactions: withErrorBoundary(TransactionsScreen),
  NewTransaction: withErrorBoundary(NewTransactionScreen),
  Services: withErrorBoundary(ServicesScreen),
  ServiceDetail: withErrorBoundary(ServiceDetailScreen),
  Promotions: withErrorBoundary(PromotionsScreen),
  PromotionDetail: withErrorBoundary(PromotionDetailScreen),
  Profile: withErrorBoundary(ProfileScreen),
  EditProfile: withErrorBoundary(EditProfileScreen),
  Favorites: withErrorBoundary(FavoritesScreen),
  TransferToFavorite: withErrorBoundary(TransferToFavoriteScreen),
  Currencies: withErrorBoundary(CurrenciesScreen),
  ChatList: withErrorBoundary(ChatListScreen),
  Chat: withErrorBoundary(ChatScreen),
};

// Opciones de header reutilizadas por todos los stacks anidados.
// Navy sólido de marca (#08316d) con título serif.
const stackScreenOptions = {
  headerStyle: { backgroundColor: COLORS.brand },
  headerTintColor: COLORS.white,
  headerTitleStyle: { fontFamily: FONTS.displayBold, fontWeight: '700', fontSize: FONT_SIZE.lg },
  headerShadowVisible: true,
  contentStyle: { backgroundColor: COLORS.background },
};

// --- Stack: Inicio ---
const HomeStackNav = createNativeStackNavigator();
function HomeStack() {
  return (
    <HomeStackNav.Navigator screenOptions={stackScreenOptions}>
      <HomeStackNav.Screen name="Dashboard" component={S.Dashboard} options={{ title: 'Inicio' }} />
    </HomeStackNav.Navigator>
  );
}

// --- Stack: Cuentas ---
const AccountsStackNav = createNativeStackNavigator();
function AccountsStack() {
  return (
    <AccountsStackNav.Navigator screenOptions={stackScreenOptions}>
      <AccountsStackNav.Screen name="Accounts" component={S.Accounts} options={{ title: 'Mis Cuentas' }} />
      <AccountsStackNav.Screen name="AccountDetail" component={S.AccountDetail} options={{ title: 'Detalle de Cuenta' }} />
      <AccountsStackNav.Screen name="RequestAccount" component={S.RequestAccount} options={{ title: 'Solicitar Cuenta' }} />
    </AccountsStackNav.Navigator>
  );
}

// --- Stack: Movimientos ---
const TransactionsStackNav = createNativeStackNavigator();
function TransactionsStack() {
  return (
    <TransactionsStackNav.Navigator screenOptions={stackScreenOptions}>
      <TransactionsStackNav.Screen name="Transactions" component={S.Transactions} options={{ title: 'Movimientos' }} />
      <TransactionsStackNav.Screen name="NewTransaction" component={S.NewTransaction} options={{ title: 'Nueva Transacción' }} />
    </TransactionsStackNav.Navigator>
  );
}

// --- Stack: Servicios + Promociones ---
const CatalogStackNav = createNativeStackNavigator();
function CatalogStack() {
  return (
    <CatalogStackNav.Navigator screenOptions={stackScreenOptions}>
      <CatalogStackNav.Screen name="Services" component={S.Services} options={{ title: 'Servicios' }} />
      <CatalogStackNav.Screen name="ServiceDetail" component={S.ServiceDetail} options={{ title: 'Detalle del Servicio' }} />
      <CatalogStackNav.Screen name="Promotions" component={S.Promotions} options={{ title: 'Promociones' }} />
      <CatalogStackNav.Screen name="PromotionDetail" component={S.PromotionDetail} options={{ title: 'Detalle de Promoción' }} />
    </CatalogStackNav.Navigator>
  );
}

// --- Stack: Perfil (+ Favoritos, Divisas, Chatbot) ---
const ProfileStackNav = createNativeStackNavigator();
function ProfileStack() {
  return (
    <ProfileStackNav.Navigator screenOptions={stackScreenOptions}>
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

const TAB_ICONS = {
  Inicio: 'home',
  Cuentas: 'account-balance',
  Movimientos: 'swap-horiz',
  Servicios: 'local-offer',
  Perfil: 'person',
};

// Pantalla raíz de cada tab. Al tocar el tab volvemos aquí, así Perfil siempre
// muestra "Mi Perfil" (y no Favoritos/Divisas) tras un deep-link desde otra parte.
const TAB_ROOT = {
  Inicio: 'Dashboard',
  Cuentas: 'Accounts',
  Movimientos: 'Transactions',
  Servicios: 'Services',
  Perfil: 'Profile',
};

const resetTabOnPress = ({ navigation, route }) => ({
  tabPress: (e) => {
    e.preventDefault();
    navigation.navigate(route.name, { screen: TAB_ROOT[route.name] });
  },
});

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 66,
          paddingTop: 6,
          paddingBottom: 10,
        },
        tabBarLabelStyle: { fontSize: FONT_SIZE.xs, fontFamily: FONTS.semibold, fontWeight: '600' },
        tabBarIcon: ({ color, size, focused }) => (
          <MaterialIcons name={TAB_ICONS[route.name] || 'circle'} size={focused ? size + 1 : size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Inicio" component={HomeStack} listeners={resetTabOnPress} />
      <Tab.Screen name="Cuentas" component={AccountsStack} listeners={resetTabOnPress} />
      <Tab.Screen name="Movimientos" component={TransactionsStack} listeners={resetTabOnPress} />
      <Tab.Screen name="Servicios" component={CatalogStack} listeners={resetTabOnPress} />
      <Tab.Screen name="Perfil" component={ProfileStack} listeners={resetTabOnPress} />
    </Tab.Navigator>
  );
}
