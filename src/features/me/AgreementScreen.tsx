import { MosaicCard, MosaicText } from '@/components/mosaic';
import { useI18n } from '@/i18n/useI18n';

import { SettingsPageShell } from './settings/components/SettingsPageShell';

export function AgreementScreen() {
  const { t } = useI18n();

  return (
    <SettingsPageShell title={t('auth.agreement.name')}>
      <MosaicCard className="gap-2">
        <MosaicText variant="body" tone="text" weight="600">
          {t('auth.agreement.name')}
        </MosaicText>
        {/* TODO: 替换为正式协议内容 */}
        <MosaicText variant="body" tone="text-muted">
          {t('auth.agreement.content')}
        </MosaicText>
      </MosaicCard>
    </SettingsPageShell>
  );
}
