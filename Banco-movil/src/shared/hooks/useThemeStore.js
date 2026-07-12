import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LIGHT_COLORS, DARK_COLORS } from '../constants/theme';

const STORAGE_KEY = 'bancario-theme-storage';

const readPersistedTheme = async () => {
  try {
    const rawValue = await AsyncStorage.getItem(STORAGE_KEY);
    if (!rawValue) return null;

    const parsed = JSON.parse(rawValue);
    return Boolean(parsed?.state?.isDark);
  } catch {
    return null;
  }
};

const writePersistedTheme = async (isDark) => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        state: { isDark },
        version: 0,
      })
    );
  } catch {
    // noop
  }
};

export const useThemeStore = create((set, get) => ({
  isDark: false,
  colors: LIGHT_COLORS,
  toggleTheme: async () => {
    const { isDark } = get();
    const nextIsDark = !isDark;
    await writePersistedTheme(nextIsDark);
    set({
      isDark: nextIsDark,
      colors: nextIsDark ? DARK_COLORS : LIGHT_COLORS,
    });
  },
  setTheme: async (isDark) => {
    await writePersistedTheme(isDark);
    set({
      isDark,
      colors: isDark ? DARK_COLORS : LIGHT_COLORS,
    });
  },
}));

void (async () => {
  const isDark = await readPersistedTheme();
  if (typeof isDark === 'boolean') {
    useThemeStore.setState({
      isDark,
      colors: isDark ? DARK_COLORS : LIGHT_COLORS,
    });
  }
})();
