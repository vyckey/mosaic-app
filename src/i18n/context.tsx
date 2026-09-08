import React, { createContext, useCallback, useMemo, useState } from 'react';
import { getLocales } from 'expo-localization';

import { i18n } from './index';

export type LanguagePreference = 'system' | 'en' | 'zh-CN';

function resolveSystemLocale(): string {
  const code = getLocales()[0]?.languageCode;
  return code?.startsWith('zh') ? 'zh-CN' : 'en';
}

i18n.locale = resolveSystemLocale();

type I18nContextValue = {
  locale: string;
  languagePreference: LanguagePreference;
  setLanguagePreference: (preference: LanguagePreference) => void;
  t: (key: string, options?: Record<string, unknown>) => string;
};

export const I18nContext = createContext<I18nContextValue | null>(null);

type I18nProviderProps = {
  children: React.ReactNode;
};

export function I18nProvider({ children }: I18nProviderProps) {
  const [languagePreference, setPreferenceState] =
    useState<LanguagePreference>('system');

  const locale = useMemo(
    () =>
      languagePreference === 'system' ? resolveSystemLocale() : languagePreference,
    [languagePreference],
  );

  const setLanguagePreference = useCallback(
    (preference: LanguagePreference) => {
      i18n.locale =
        preference === 'system' ? resolveSystemLocale() : preference;
      setPreferenceState(preference);
    },
    [],
  );

  const t = useCallback((key: string, options?: Record<string, unknown>) => {
    return i18n.t(key, options);
  }, []);

  const value = useMemo(
    () => ({
      locale,
      languagePreference,
      setLanguagePreference,
      t,
    }),
    [locale, languagePreference, setLanguagePreference, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
