import { MosaicCard, MosaicListRow, MosaicText } from '@/components/mosaic';
import { useI18n } from '@/i18n/useI18n';

import { SettingsPageShell } from './components/SettingsPageShell';

import packageJson from '../../../../package.json';

export function AboutScreen() {
  const { t } = useI18n();

  return (
    <SettingsPageShell title={t('settings.about')}>
      <MosaicCard>
        <MosaicListRow
          title={t('settings.version')}
          chevron={false}
          trailing={
            <MosaicText variant="caption" tone="text-muted">
              v{packageJson.version}
            </MosaicText>
          }
        />
      </MosaicCard>
    </SettingsPageShell>
  );
}
