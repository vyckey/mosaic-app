import { useCallback } from 'react';

import { useLocaleStore, type LanguagePreference } from '@/stores/use-locale-store';

import { i18n } from './index';

export type { LanguagePreference };

/**
 * Translation + locale helpers backed by the global locale store.
 *
 * `locale` comes from the store so every consumer re-renders when the language
 * preference changes. `t` is recreated per locale as well: that identity change
 * is what invalidates cached translations, including React Compiler's
 * memoization of `t(key)` results.
 */
export function useI18n() {
  const locale = useLocaleStore((state) => state.locale);
  const languagePreference = useLocaleStore(
    (state) => state.languagePreference,
  );
  const setLanguagePreference = useLocaleStore(
    (state) => state.setLanguagePreference,
  );

  const t = useCallback(
    (key: string, options?: Record<string, unknown>) =>
      // Resolve against the store locale explicitly. Passing `locale` also
      // makes it a real dependency, so React Compiler invalidates cached
      // `t(key)` results when the language changes.
      i18n.t(key, { ...options, locale }),
    [locale],
  );

  return { locale, languagePreference, setLanguagePreference, t };
}
