import { router } from 'expo-router';
import { useState } from 'react';
import { Linking, Platform, View } from 'react-native';

import {
  MosaicButton,
  MosaicListRow,
  MosaicText,
  MosaicTextArea,
} from '@/components/mosaic';
import { useI18n } from '@/i18n/useI18n';

import { SettingsInfoDialog } from './components/SettingsInfoDialog';
import { SettingsPageShell } from './components/SettingsPageShell';
import { SettingsChoiceRow, SettingsSwitchRow } from './components/SettingsRows';
import { SettingsSection } from './components/SettingsSection';

import packageJson from '../../../../package.json';

type FeedbackType = 'bug' | 'feature' | 'other';

export function HelpScreen() {
  const { t } = useI18n();
  const [doc, setDoc] = useState<{ title: string; message: string } | null>(
    null,
  );

  const diagnostics = t('settings.help.diagnosticsContent', {
    version: packageJson.version,
    platform: Platform.OS,
  });

  return (
    <SettingsPageShell title={t('settings.help.title')}>
      <SettingsSection>
        <MosaicListRow
          title={t('settings.help.guide')}
          onPress={() =>
            setDoc({
              title: t('settings.help.guide'),
              message: t('settings.help.guideContent'),
            })
          }
        />
        <MosaicListRow
          title={t('settings.help.faq')}
          onPress={() =>
            setDoc({
              title: t('settings.help.faq'),
              message: t('settings.help.faqContent'),
            })
          }
        />
        <MosaicListRow
          title={t('settings.help.feedback')}
          onPress={() => router.push('/settings/help/feedback')}
        />
      </SettingsSection>

      <SettingsSection>
        <MosaicListRow
          title={t('settings.help.contact')}
          value={t('settings.help.contactEmail')}
          onPress={() =>
            Linking.openURL(`mailto:${t('settings.help.contactEmail')}`)
          }
        />
        <MosaicListRow
          title={t('settings.help.diagnostics')}
          onPress={() =>
            setDoc({
              title: t('settings.help.diagnostics'),
              message: diagnostics,
            })
          }
        />
      </SettingsSection>

      <SettingsInfoDialog
        visible={doc !== null}
        title={doc?.title ?? ''}
        message={doc?.message ?? ''}
        onClose={() => setDoc(null)}
      />
    </SettingsPageShell>
  );
}

export function FeedbackScreen() {
  const { t } = useI18n();
  const [type, setType] = useState<FeedbackType>('bug');
  const [description, setDescription] = useState('');
  const [includeScreenshot, setIncludeScreenshot] = useState(false);
  const [submittedVisible, setSubmittedVisible] = useState(false);

  const environment = t('settings.help.feedbackEnvironmentValue', {
    version: packageJson.version,
    platform: Platform.OS,
  });

  return (
    <SettingsPageShell title={t('settings.help.feedback')}>
      <SettingsSection>
        <SettingsChoiceRow<FeedbackType>
          title={t('settings.help.feedbackType')}
          value={
            {
              bug: t('settings.help.feedbackBug'),
              feature: t('settings.help.feedbackFeature'),
              other: t('settings.help.feedbackOther'),
            }[type]
          }
          options={[
            { value: 'bug', label: t('settings.help.feedbackBug') },
            { value: 'feature', label: t('settings.help.feedbackFeature') },
            { value: 'other', label: t('settings.help.feedbackOther') },
          ]}
          onChange={setType}
        />
      </SettingsSection>

      <View className="gap-2">
        <MosaicText variant="tiny" tone="text-muted" weight="500">
          {t('settings.help.feedbackDescription')}
        </MosaicText>
        <View className="rounded-card border border-border bg-surface p-[18px]">
          <MosaicTextArea
            value={description}
            onChangeText={setDescription}
            placeholder={t('settings.help.feedbackDescriptionPlaceholder')}
            minHeight={140}
            maxHeight={220}
          />
        </View>
      </View>

      <SettingsSection>
        <SettingsSwitchRow
          title={t('settings.help.feedbackScreenshot')}
          value={includeScreenshot}
          onValueChange={setIncludeScreenshot}
        />
        <MosaicListRow
          title={t('settings.help.feedbackEnvironment')}
          value={environment}
          chevron={false}
        />
      </SettingsSection>

      <MosaicButton
        size="lg"
        disabled={description.trim().length === 0}
        onPress={() => setSubmittedVisible(true)}
      >
        {t('settings.help.feedbackSubmit')}
      </MosaicButton>

      <SettingsInfoDialog
        visible={submittedVisible}
        title={t('settings.help.feedbackSubmitted')}
        message={t('settings.help.feedbackSubmittedMessage')}
        onClose={() => {
          setSubmittedVisible(false);
          router.back();
        }}
      />
    </SettingsPageShell>
  );
}
