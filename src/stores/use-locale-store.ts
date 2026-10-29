import { getLocales } from 'expo-localization';
import { create } from 'zustand';

import { i18n } from '@/i18n';

export type LanguagePreference = 'system' | 'en' | 'zh-CN';

export interface LocaleState {
  languagePreference: LanguagePreference;
  locale: string;
  setLanguagePreference: (preference: LanguagePreference) => void;
}

function resolveSystemLocale(): string {
  const code = getLocales()[0]?.languageCode;
  return code?.startsWith('zh') ? 'zh-CN' : 'en';
}

const initialLocale = resolveSystemLocale();

// Keep the i18n-js instance in sync before the first component renders.
i18n.locale = initialLocale;

/**
 * Global language preference.
 *
 * The store is the single source of truth for both the user's preference and
 * the resolved locale, and it keeps the i18n-js instance in sync whenever the
 * preference changes.
 */
export const useLocaleStore = create<LocaleState>((set) => ({
  languagePreference: 'system',
  locale: initialLocale,
  setLanguagePreference: (preference) => {
    const locale = preference === 'system' ? resolveSystemLocale() : preference;
    i18n.locale = locale;
    set({ languagePreference: preference, locale });
  },
}));
