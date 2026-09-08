import { I18n } from 'i18n-js';

import en from './locales/en';
import zhCN from './locales/zh-CN';

export const i18n = new I18n({
  en,
  'zh-CN': zhCN,
});

i18n.defaultLocale = 'en';
i18n.enableFallback = true;

export default i18n;
