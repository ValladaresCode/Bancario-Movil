import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';

import { COLORS, FONT_SIZE } from '../shared/constants/theme';

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
import { FavoritesScreen } from '../features/favorites/screens/FavoritesScreen';
import { TransferToFavoriteScreen } from '../features/favorites/screens/TransferToFavoriteScreen';
import { CurrenciesScreen } from '../features/currencies/screens/CurrenciesScreen';
import { ChatListScreen } from '../features/chatbot/screens/ChatListScreen';
import { ChatScreen } from '../features/chatbot/screens/ChatScreen';

const Tab = createBottomTabNavigator();

// Opciones de header reutilizadas por todos los stacks anidados.
const stackScreenOptions = {
  headerStyle: { backgroundColor: COLORS.primary },
  headerTintColor: COLORS.white,
  headerTitleStyle: { fontWeight: '700', fontSize: FONT_SIZE.lg },
  contentStyle: { backgroundColor: COLORS.background },
};

// --- Stack: Inicio ---
const HomeStackNav = createNativeStackNavigator();
function HomeStack() {
  return (
    <HomeStackNav.Navigator screenOptions={stackScreenOptions}>
      <HomeStackNav.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'Inicio' }}
      />
    </HomeStackNav.Navigator>
  );
}

// --- Stack: Cuentas ---
const AccountsStackNav = createNativeStackNavigator();
function AccountsStack() {
  return (
    <AccountsStackNav.Navigator screenOptions={stackScreenOptions}>
      <AccountsStackNav.Screen
        name="Accounts"
        component={AccountsScreen}
        options={{ title: 'Mis Cuentas' }}
      />
      <AccountsStackNav.Screen
        name="AccountDetail"
        component={AccountDetailScreen}
        options={{ title: 'Detalle de Cuenta' }}
      />
      <AccountsStackNav.Screen
        name="RequestAccount"
        component={RequestAccountScreen}
        options={{ title: 'Solicitar Cuenta' }}
      />
    </AccountsStackNav.Navigator>
  );
}

// --- Stack: Movimientos ---
const TransactionsStackNav = createNativeStackNavigator();
function TransactionsStack() {
  return (
    <TransactionsStackNav.Navigator screenOptions={stackScreenOptions}>
      <TransactionsStackNav.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{ title: 'Movimientos' }}
      />
      <TransactionsStackNav.Screen
        name="NewTransaction"
        component={NewTransactionScreen}
        options={{ title: 'Nueva Transacción' }}
      />
    </TransactionsStackNav.Navigator>
  );
}

// --- Stack: Servicios + Promociones ---
const CatalogStackNav = createNativeStackNavigator();
function CatalogStack() {
  return (
    <CatalogStackNav.Navigator screenOptions={stackScreenOptions}>
      <CatalogStackNav.Screen
        name="Services"
        component={ServicesScreen}
        options={{ title: 'Servicios' }}
      />
      <CatalogStackNav.Screen
        name="ServiceDetail"
        component={ServiceDetailScreen}
        options={{ title: 'Detalle del Servicio' }}
      />
      <CatalogStackNav.Screen
        name="Promotions"
        component={PromotionsScreen}
        options={{ title: 'Promociones' }}
      />
      <CatalogStackNav.Screen
        name="PromotionDetail"
        component={PromotionDetailScreen}
        options={{ title: 'Detalle de Promoción' }}
      />
    </CatalogStackNav.Navigator>
  );
}

// --- Stack: Perfil (+ Favoritos, Divisas, Chatbot) ---
const ProfileStackNav = createNativeStackNavigator();
function ProfileStack() {
  return (
    <ProfileStackNav.Navigator screenOptions={stackScreenOptions}>
      <ProfileStackNav.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Mi Perfil' }}
      />
      <ProfileStackNav.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ title: 'Favoritos' }}
      />
      <ProfileStackNav.Screen
        name="TransferToFavorite"
        component={TransferToFavoriteScreen}
        options={{ title: 'Transferir a Favorito' }}
      />
      <ProfileStackNav.Screen
        name="Currencies"
        component={CurrenciesScreen}
        options={{ title: 'Divisas' }}
      />
      <ProfileStackNav.Screen
        name="ChatList"
        component={ChatListScreen}
        options={{ title: 'Asistente' }}
      />
      <ProfileStackNav.Screen
        name="Chat"
        component={ChatScreen}
        options={{ title: 'Conversación' }}
      />
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
        },
        tabBarLabelStyle: { fontSize: FONT_SIZE.xs, fontWeight: '600' },
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name={TAB_ICONS[route.name] || 'circle'} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Inicio" component={HomeStack} />
      <Tab.Screen name="Cuentas" component={AccountsStack} />
      <Tab.Screen name="Movimientos" component={TransactionsStack} />
      <Tab.Screen name="Servicios" component={CatalogStack} />
      <Tab.Screen name="Perfil" component={ProfileStack} />
    </Tab.Navigator>
  );
}
