import { useColorScheme as useSystemColorScheme } from 'react-native';

import { useSettingsStore } from '@/stores/use-settings-store';

/**
 * Effective color scheme: the user's theme preference (Settings → 外观与显示)
 * when it is explicit, otherwise the system scheme.
 */
export function useColorScheme(): 'light' | 'dark' {
  const themeMode = useSettingsStore((state) => state.appearance.themeMode);
  const systemScheme = useSystemColorScheme();

  if (themeMode !== 'system') {
    return themeMode;
  }

  return systemScheme === 'dark' ? 'dark' : 'light';
}
