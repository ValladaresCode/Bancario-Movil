import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import { COLORS } from '../shared/constants/theme';
import { useAuthStore } from '../shared/store/authStore';
import { AuthStack } from './AuthStack';
import { MainTabs } from './MainTabs';

// Decide Auth vs Main según el authStore, con guarda anti-parpadeo de hidratación.
export function AppNavigator() {
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Mientras Zustand no rehidrate desde AsyncStorage, mostramos SOLO una pantalla
  // de carga (sin NavigationContainer) para evitar el parpadeo del Login.
  if (!hasHydrated) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
});
