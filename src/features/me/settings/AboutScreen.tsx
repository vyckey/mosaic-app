import { router } from 'expo-router';
import { useState } from 'react';
import { Linking, View } from 'react-native';

import {
  MosaicListRow,
  MosaicText,
} from '@/components/mosaic';
import { useI18n } from '@/i18n/useI18n';

import { SettingsInfoDialog } from './components/SettingsInfoDialog';
import { SettingsPageShell } from './components/SettingsPageShell';
import { SettingsSection } from './components/SettingsSection';

import packageJson from '../../../../package.json';

export function AboutScreen() {
  const { t } = useI18n();
  const [doc, setDoc] = useState<{ title: string; message: string } | null>(
    null,
  );

  return (
    <SettingsPageShell title={t('settings.about.title')}>
      <SettingsSection>
        <MosaicListRow
          title={t('settings.about.version')}
          value={`v${packageJson.version}`}
          chevron={false}
        />
        <MosaicListRow
          title={t('settings.about.changelog')}
          onPress={() =>
            setDoc({
              title: t('settings.about.changelog'),
              message: t('settings.about.changelogContent'),
            })
          }
        />
      </SettingsSection>

      <SettingsSection>
        <MosaicListRow
          title={t('settings.about.website')}
          onPress={() => Linking.openURL('https://mosaic.app')}
        />
        <MosaicListRow
          title={t('settings.about.terms')}
          onPress={() => router.push('/agreement')}
        />
        <MosaicListRow
          title={t('settings.about.privacy')}
          onPress={() =>
            setDoc({
              title: t('settings.about.privacy'),
              message: t('settings.privacy.docPlaceholder'),
            })
          }
        />
        <MosaicListRow
          title={t('settings.about.licenses')}
          onPress={() =>
            setDoc({
              title: t('settings.about.licenses'),
              message: t('settings.about.licensesContent'),
            })
          }
        />
        <MosaicListRow
          title={t('settings.about.rate')}
          onPress={() =>
            Linking.openURL(
              'https://apps.apple.com/app/id0000000000?action=write-review',
            )
          }
        />
      </SettingsSection>

      <View className="items-center gap-1 pt-4">
        <MosaicText variant="caption" tone="text-muted">
          Mosaic
        </MosaicText>
        <MosaicText variant="tiny" tone="text-subtle" className="text-center">
          {t('settings.about.tagline')}
        </MosaicText>
      </View>

      <SettingsInfoDialog
        visible={doc !== null}
        title={doc?.title ?? ''}
        message={doc?.message ?? ''}
        onClose={() => setDoc(null)}
      />
    </SettingsPageShell>
  );
}
