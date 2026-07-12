import { StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

import { FONTS, FONT_SIZE, SPACING } from '../shared/constants/theme';
import { useThemeStore } from '../shared/hooks/useThemeStore';
import { AccountsStack, CatalogStack, HomeStack, ProfileStack, TransactionsStack } from './stacks';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Inicio: { active: 'home-filled', inactive: 'home' },
  Cuentas: { active: 'account-balance', inactive: 'account-balance' },
  Movimientos: { active: 'swap-horiz', inactive: 'swap-horiz' },
  Servicios: { active: 'local-offer', inactive: 'local-offer' },
  Perfil: { active: 'person', inactive: 'person-outline' },
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
  const { colors, isDark } = useThemeStore();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)',
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 0,
          height: 70,
          paddingTop: 8,
          paddingBottom: 12,
          elevation: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: isDark ? 0.3 : 0.08,
          shadowRadius: 12,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: FONTS.medium,
          fontWeight: '500',
          marginTop: 2,
        },
        tabBarIcon: ({ color, size, focused }) => {
          const icons = TAB_ICONS[route.name] || { active: 'circle', inactive: 'circle' };
          const iconName = focused ? icons.active : icons.inactive;
          return (
            <MaterialIcons name={iconName} size={focused ? 26 : 24} color={color} />
          );
        },
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
