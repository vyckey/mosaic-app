import { router } from 'expo-router';

import { MosaicListRow } from '@/components/mosaic';
import { useI18n } from '@/i18n/useI18n';
import {
  countEnabled,
  useSettingsStore,
  type DefaultRecordTime,
  type MediaQuality,
  type VoiceLanguage,
} from '@/stores';

import { SettingsPageShell } from './components/SettingsPageShell';
import {
  SettingsChoiceRow,
  SettingsSwitchRow,
} from './components/SettingsRows';
import { SettingsSection } from './components/SettingsSection';

const TAG_KEYS = ['life', 'work', 'travel', 'mood'] as const;
const MOOD_KEYS = ['none', 'happy', 'calm', 'low', 'anxious'] as const;

export function RecordPreferencesScreen() {
  const { t } = useI18n();
  const records = useSettingsStore((state) => state.records);

  const autoInfoLabels = [
    records.autoInfo.location && t('settings.records.autoLocation'),
    records.autoInfo.weather && t('settings.records.autoWeather'),
    records.autoInfo.time && t('settings.records.autoTime'),
  ].filter(Boolean);

  const mediaLabel = {
    high: t('settings.records.mediaValueHigh'),
    standard: t('settings.records.mediaValueStandard'),
    original: t('settings.records.mediaValueOriginal'),
  }[records.media.quality];

  const privacyCount = countEnabled(records.privacy);

  return (
    <SettingsPageShell title={t('settings.records.title')}>
      <SettingsSection>
        <MosaicListRow
          title={t('settings.records.defaults')}
          value={t('settings.records.defaultsValue')}
          onPress={() => router.push('/settings/records/defaults')}
        />
        <MosaicListRow
          title={t('settings.records.autoInfo')}
          subtitle={t('settings.records.autoInfoHint')}
          value={
            autoInfoLabels.length > 0
              ? autoInfoLabels.join(' / ')
              : t('settings.disabled')
          }
          onPress={() => router.push('/settings/records/auto-info')}
        />
        <MosaicListRow
          title={t('settings.records.media')}
          value={mediaLabel}
          onPress={() => router.push('/settings/records/media')}
        />
        <MosaicListRow
          title={t('settings.records.voice')}
          value={
            records.voice.transcribe
              ? t('settings.records.voiceValueOn')
              : t('settings.records.voiceValueOff')
          }
          onPress={() => router.push('/settings/records/voice')}
        />
        <MosaicListRow
          title={t('settings.records.privacy')}
          subtitle={t('settings.records.privacyHint')}
          value={t('settings.records.privacyValue', {
            enabled: privacyCount,
            total: Object.keys(records.privacy).length,
          })}
          onPress={() => router.push('/settings/records/privacy')}
        />
      </SettingsSection>
    </SettingsPageShell>
  );
}

export function DefaultRecordScreen() {
  const { t } = useI18n();
  const defaults = useSettingsStore((state) => state.records.defaults);
  const setRecords = useSettingsStore((state) => state.setRecords);

  const tagLabel = (tag: string) =>
    t(`settings.records.tag${tag.charAt(0).toUpperCase()}${tag.slice(1)}`);

  const moodLabel = (mood: string) =>
    t(`settings.records.mood${mood.charAt(0).toUpperCase()}${mood.slice(1)}`);

  return (
    <SettingsPageShell title={t('settings.records.defaults')}>
      <SettingsSection>
        <SettingsSwitchRow
          title={t('settings.records.autoSaveDraft')}
          value={defaults.autoSaveDraft}
          onValueChange={(autoSaveDraft) =>
            setRecords({ defaults: { ...defaults, autoSaveDraft } })
          }
        />
        <SettingsChoiceRow
          title={t('settings.records.defaultTag')}
          value={tagLabel(defaults.defaultTag)}
          options={TAG_KEYS.map((tag) => ({
            value: tag,
            label: tagLabel(tag),
          }))}
          onChange={(defaultTag) =>
            setRecords({ defaults: { ...defaults, defaultTag } })
          }
        />
        <SettingsChoiceRow<DefaultRecordTime>
          title={t('settings.records.recordTime')}
          value={
            defaults.recordTime === 'now'
              ? t('settings.records.recordTimeNow')
              : t('settings.records.recordTimeLast')
          }
          options={[
            { value: 'now', label: t('settings.records.recordTimeNow') },
            { value: 'last', label: t('settings.records.recordTimeLast') },
          ]}
          onChange={(recordTime) =>
            setRecords({ defaults: { ...defaults, recordTime } })
          }
        />
        <SettingsChoiceRow
          title={t('settings.records.defaultMood')}
          value={moodLabel(defaults.defaultMood)}
          options={MOOD_KEYS.map((mood) => ({
            value: mood,
            label: moodLabel(mood),
          }))}
          onChange={(defaultMood) =>
            setRecords({ defaults: { ...defaults, defaultMood } })
          }
        />
      </SettingsSection>
    </SettingsPageShell>
  );
}

export function AutoInfoScreen() {
  const { t } = useI18n();
  const autoInfo = useSettingsStore((state) => state.records.autoInfo);
  const setRecords = useSettingsStore((state) => state.setRecords);

  const rows = [
    { key: 'location', label: t('settings.records.autoLocation') },
    { key: 'weather', label: t('settings.records.autoWeather') },
    { key: 'time', label: t('settings.records.autoTime') },
  ] as const;

  return (
    <SettingsPageShell
      title={t('settings.records.autoInfo')}
      subtitle={t('settings.records.autoInfoHint')}
    >
      <SettingsSection>
        {rows.map((row) => (
          <SettingsSwitchRow
            key={row.key}
            title={row.label}
            value={autoInfo[row.key]}
            onValueChange={(value) =>
              setRecords({ autoInfo: { ...autoInfo, [row.key]: value } })
            }
          />
        ))}
      </SettingsSection>
    </SettingsPageShell>
  );
}

export function MediaSettingsScreen() {
  const { t } = useI18n();
  const media = useSettingsStore((state) => state.records.media);
  const setRecords = useSettingsStore((state) => state.setRecords);

  return (
    <SettingsPageShell
      title={t('settings.records.media')}
      subtitle={t('settings.records.mediaHint')}
    >
      <SettingsSection>
        <SettingsChoiceRow<MediaQuality>
          title={t('settings.records.mediaQuality')}
          value={
            {
              high: t('settings.records.qualityHigh'),
              standard: t('settings.records.qualityStandard'),
              original: t('settings.records.qualityOriginal'),
            }[media.quality]
          }
          options={[
            {
              value: 'high',
              label: t('settings.records.qualityHigh'),
            },
            {
              value: 'standard',
              label: t('settings.records.qualityStandard'),
            },
            {
              value: 'original',
              label: t('settings.records.qualityOriginal'),
            },
          ]}
          onChange={(quality) => setRecords({ media: { ...media, quality } })}
        />
        <SettingsSwitchRow
          title={t('settings.records.keepOriginal')}
          value={media.keepOriginal}
          onValueChange={(keepOriginal) =>
            setRecords({ media: { ...media, keepOriginal } })
          }
        />
        <SettingsSwitchRow
          title={t('settings.records.useExifTime')}
          value={media.useExifTime}
          onValueChange={(useExifTime) =>
            setRecords({ media: { ...media, useExifTime } })
          }
        />
      </SettingsSection>
    </SettingsPageShell>
  );
}

export function VoiceSettingsScreen() {
  const { t } = useI18n();
  const voice = useSettingsStore((state) => state.records.voice);
  const setRecords = useSettingsStore((state) => state.setRecords);

  return (
    <SettingsPageShell title={t('settings.records.voice')}>
      <SettingsSection>
        <SettingsSwitchRow
          title={t('settings.records.voiceTranscribe')}
          value={voice.transcribe}
          onValueChange={(transcribe) =>
            setRecords({ voice: { ...voice, transcribe } })
          }
        />
        <SettingsChoiceRow<VoiceLanguage>
          title={t('settings.records.voiceLanguage')}
          value={
            {
              auto: t('settings.records.voiceLanguageAuto'),
              'zh-CN': t('settings.records.voiceLanguageZh'),
              en: t('settings.records.voiceLanguageEn'),
            }[voice.language]
          }
          options={[
            {
              value: 'auto',
              label: t('settings.records.voiceLanguageAuto'),
            },
            {
              value: 'zh-CN',
              label: t('settings.records.voiceLanguageZh'),
            },
            { value: 'en', label: t('settings.records.voiceLanguageEn') },
          ]}
          onChange={(language) =>
            setRecords({ voice: { ...voice, language } })
          }
        />
        <SettingsSwitchRow
          title={t('settings.records.keepAudio')}
          value={voice.keepAudio}
          onValueChange={(keepAudio) =>
            setRecords({ voice: { ...voice, keepAudio } })
          }
        />
        <SettingsSwitchRow
          title={t('settings.records.autoSummary')}
          value={voice.autoSummary}
          onValueChange={(autoSummary) =>
            setRecords({ voice: { ...voice, autoSummary } })
          }
        />
      </SettingsSection>
    </SettingsPageShell>
  );
}

export function RecordPrivacyScreen() {
  const { t } = useI18n();
  const privacy = useSettingsStore((state) => state.records.privacy);
  const setRecords = useSettingsStore((state) => state.setRecords);

  const rows = [
    {
      key: 'statistics',
      label: t('settings.records.privacyStatistics'),
    },
    { key: 'aiAnalysis', label: t('settings.records.privacyAi') },
    { key: 'portrait', label: t('settings.records.privacyPortrait') },
    { key: 'lifeStory', label: t('settings.records.privacyStory') },
  ] as const;

  return (
    <SettingsPageShell
      title={t('settings.records.privacy')}
      subtitle={t('settings.records.privacyHint')}
    >
      <SettingsSection>
        {rows.map((row) => (
          <SettingsSwitchRow
            key={row.key}
            title={row.label}
            value={privacy[row.key]}
            onValueChange={(value) =>
              setRecords({ privacy: { ...privacy, [row.key]: value } })
            }
          />
        ))}
      </SettingsSection>
    </SettingsPageShell>
  );
}
