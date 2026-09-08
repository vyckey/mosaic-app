import { Check } from 'lucide-react-native';

import { MosaicCard, MosaicList, MosaicListRow } from '@/components/mosaic';
import { Icon } from '@/components/ui/icon';
import type { LanguagePreference } from '@/i18n/context';
import { useI18n } from '@/i18n/useI18n';

import { SettingsPageShell } from './components/SettingsPageShell';

const LANGUAGE_OPTIONS: { value: LanguagePreference; labelKey: string }[] = [
  { value: 'system', labelKey: 'settings.languageSystem' },
  { value: 'en', labelKey: 'settings.languageEnglish' },
  { value: 'zh-CN', labelKey: 'settings.languageChinese' },
];

export function LanguageScreen() {
  const { t, languagePreference, setLanguagePreference } = useI18n();

  return (
    <SettingsPageShell title={t('settings.language')}>
      <MosaicCard>
        <MosaicList>
          {LANGUAGE_OPTIONS.map((option) => (
            <MosaicListRow
              key={option.value}
              title={t(option.labelKey)}
              chevron={false}
              trailing={
                languagePreference === option.value ? (
                  <Icon as={Check} size="sm" className="shrink-0 text-primary" />
                ) : null
              }
              onPress={() => setLanguagePreference(option.value)}
            />
          ))}
        </MosaicList>
      </MosaicCard>
    </SettingsPageShell>
  );
}
