import { useSyncExternalStore } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

import { useSettingsStore } from '@/stores/use-settings-store';

const subscribe = () => () => {};

/**
 * Web variant of the effective color scheme. Static rendering starts from a
 * light snapshot, then the store/system preference takes over after hydration.
 */
export function useColorScheme(): 'light' | 'dark' {
  const isClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const themeMode = useSettingsStore((state) => state.appearance.themeMode);
  const systemScheme = useRNColorScheme();

  if (!isClient) {
    return 'light';
  }

  if (themeMode !== 'system') {
    return themeMode;
  }

  return systemScheme === 'dark' ? 'dark' : 'light';
}
