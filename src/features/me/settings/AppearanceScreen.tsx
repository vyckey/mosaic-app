import { router } from 'expo-router';

import { MosaicListRow } from '@/components/mosaic';
import { useI18n } from '@/i18n/useI18n';
import {
  useSettingsStore,
  type DateFormat,
  type FontSizePreference,
  type ThemeMode,
  type TimeFormat,
  type WeekStart,
} from '@/stores';

import { SettingsPageShell } from './components/SettingsPageShell';
import { SettingsChoiceRow } from './components/SettingsRows';
import { SettingsSection } from './components/SettingsSection';

const DATE_EXAMPLES: Record<DateFormat, string> = {
  ymd: '2026-11-16',
  slash: '2026/11/16',
  mdy: '11/16/2026',
};

export function AppearanceScreen() {
  const { t, languagePreference } = useI18n();
  const appearance = useSettingsStore((state) => state.appearance);
  const setAppearance = useSettingsStore((state) => state.setAppearance);

  const languageValue =
    languagePreference === 'system'
      ? t('settings.languageSystem')
      : languagePreference === 'zh-CN'
        ? t('settings.languageChinese')
        : t('settings.languageEnglish');

  return (
    <SettingsPageShell title={t('settings.appearance.title')}>
      <SettingsSection>
        <SettingsChoiceRow<ThemeMode>
          title={t('settings.appearance.themeMode')}
          value={
            {
              system: t('settings.appearance.themeSystem'),
              light: t('settings.appearance.themeLight'),
              dark: t('settings.appearance.themeDark'),
            }[appearance.themeMode]
          }
          options={[
            {
              value: 'system',
              label: t('settings.appearance.themeSystem'),
            },
            { value: 'light', label: t('settings.appearance.themeLight') },
            { value: 'dark', label: t('settings.appearance.themeDark') },
          ]}
          onChange={(themeMode) => setAppearance({ themeMode })}
        />
        <SettingsChoiceRow<FontSizePreference>
          title={t('settings.appearance.fontSize')}
          subtitle={t('settings.appearance.fontSizeHint')}
          value={
            {
              small: t('settings.appearance.fontSmall'),
              standard: t('settings.appearance.fontStandard'),
              large: t('settings.appearance.fontLarge'),
            }[appearance.fontSize]
          }
          options={[
            { value: 'small', label: t('settings.appearance.fontSmall') },
            {
              value: 'standard',
              label: t('settings.appearance.fontStandard'),
            },
            { value: 'large', label: t('settings.appearance.fontLarge') },
          ]}
          onChange={(fontSize) => setAppearance({ fontSize })}
        />
        <MosaicListRow
          title={t('settings.appearance.language')}
          subtitle={t('settings.appearance.languageHint')}
          value={languageValue}
          onPress={() => router.push('/settings/language')}
        />
      </SettingsSection>

      <SettingsSection>
        <SettingsChoiceRow<TimeFormat>
          title={t('settings.appearance.timeFormat')}
          value={
            appearance.timeFormat === '24h'
              ? t('settings.appearance.time24')
              : t('settings.appearance.time12')
          }
          options={[
            { value: '24h', label: t('settings.appearance.time24') },
            { value: '12h', label: t('settings.appearance.time12') },
          ]}
          onChange={(timeFormat) => setAppearance({ timeFormat })}
        />
        <SettingsChoiceRow<DateFormat>
          title={t('settings.appearance.dateFormat')}
          subtitle={t('settings.appearance.dateExample', {
            value: DATE_EXAMPLES[appearance.dateFormat],
          })}
          value={
            {
              ymd: t('settings.appearance.dateYmd'),
              slash: t('settings.appearance.dateSlash'),
              mdy: t('settings.appearance.dateMdy'),
            }[appearance.dateFormat]
          }
          options={[
            { value: 'ymd', label: t('settings.appearance.dateYmd') },
            { value: 'slash', label: t('settings.appearance.dateSlash') },
            { value: 'mdy', label: t('settings.appearance.dateMdy') },
          ]}
          onChange={(dateFormat) => setAppearance({ dateFormat })}
        />
        <SettingsChoiceRow<WeekStart>
          title={t('settings.appearance.weekStart')}
          value={
            appearance.weekStart === 'monday'
              ? t('settings.appearance.weekMonday')
              : t('settings.appearance.weekSunday')
          }
          options={[
            { value: 'monday', label: t('settings.appearance.weekMonday') },
            { value: 'sunday', label: t('settings.appearance.weekSunday') },
          ]}
          onChange={(weekStart) => setAppearance({ weekStart })}
        />
      </SettingsSection>
    </SettingsPageShell>
  );
}
