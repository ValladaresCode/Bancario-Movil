import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FONTS, FONT_SIZE } from '../shared/constants/theme';
import { useThemeStore } from '../shared/hooks/useThemeStore';
import { AccountsStack, CatalogStack, HomeStack, ProfileStack, TransactionsStack } from './stacks';

const Tab = createBottomTabNavigator();

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
  const { colors } = useThemeStore();
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          // Sumamos el inset inferior del sistema (barra de navegación / gesto)
          // para que los botones del tab no queden debajo de los del teléfono.
          height: 66 + insets.bottom,
          paddingTop: 6,
          paddingBottom: 10 + insets.bottom,
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
