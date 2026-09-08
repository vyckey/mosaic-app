import React, { createContext, useCallback, useMemo, useState } from 'react';

import { i18n } from './index';

type I18nContextValue = {
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: string, options?: Record<string, unknown>) => string;
};

export const I18nContext = createContext<I18nContextValue | null>(null);

type I18nProviderProps = {
  children: React.ReactNode;
};

export function I18nProvider({ children }: I18nProviderProps) {
  const [locale, setLocaleState] = useState(i18n.locale);

  const setLocale = useCallback((nextLocale: string) => {
    i18n.locale = nextLocale;
    setLocaleState(nextLocale);
  }, []);

  const t = useCallback((key: string, options?: Record<string, unknown>) => {
    return i18n.t(key, options);
  }, []);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t,
    }),
    [locale, setLocale, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
