import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import {
  MosaicButton,
  MosaicCard,
  MosaicListRow,
  MosaicText,
} from '@/components/mosaic';
import { useI18n } from '@/i18n/useI18n';
import {
  countEnabled,
  useAiMemoryStore,
  useSettingsStore,
} from '@/stores';

import { SettingsConfirmDialog } from './components/SettingsConfirmDialog';
import { SettingsInfoDialog } from './components/SettingsInfoDialog';
import { SettingsNote } from './components/SettingsNote';
import { SettingsPageShell } from './components/SettingsPageShell';
import { SettingsSwitchRow } from './components/SettingsRows';
import { SettingsSection } from './components/SettingsSection';
import { SettingsTextForm } from './components/SettingsTextForm';

const CATEGORY_LABEL_KEYS = {
  interest: 'settings.ai.memoryCategoryInterest',
  habit: 'settings.ai.memoryCategoryHabit',
  experience: 'settings.ai.memoryCategoryExperience',
} as const;

const TRAITS = [
  {
    key: 'personality',
    titleKey: 'settings.ai.traitPersonality',
    valueKey: 'settings.ai.traitPersonalityValue',
  },
  {
    key: 'interest',
    titleKey: 'settings.ai.traitInterest',
    valueKey: 'settings.ai.traitInterestValue',
  },
  {
    key: 'emotion',
    titleKey: 'settings.ai.traitEmotion',
    valueKey: 'settings.ai.traitEmotionValue',
  },
  {
    key: 'lifestyle',
    titleKey: 'settings.ai.traitLifestyle',
    valueKey: 'settings.ai.traitLifestyleValue',
  },
  {
    key: 'growth',
    titleKey: 'settings.ai.traitGrowth',
    valueKey: 'settings.ai.traitGrowthValue',
  },
] as const;

export function AiScreen() {
  const { t } = useI18n();
  const features = useSettingsStore((state) => state.ai.features);
  const dataUsage = useSettingsStore((state) => state.ai.dataUsage);
  const memories = useAiMemoryStore((state) => state.memories);

  return (
    <SettingsPageShell title={t('settings.ai.title')}>
      <SettingsSection>
        <MosaicListRow
          title={t('settings.ai.features')}
          value={t('settings.ai.featuresValue', {
            enabled: countEnabled(features),
            total: Object.keys(features).length,
          })}
          onPress={() => router.push('/settings/ai/features')}
        />
        <MosaicListRow
          title={t('settings.ai.dataUsage')}
          value={t('settings.ai.dataUsageValue', {
            enabled: countEnabled(dataUsage),
            total: Object.keys(dataUsage).length,
          })}
          onPress={() => router.push('/settings/ai/data')}
        />
        <MosaicListRow
          title={t('settings.ai.memories')}
          value={t('settings.ai.memoryCount', { count: memories.length })}
          onPress={() => router.push('/settings/ai/memories')}
        />
        <MosaicListRow
          title={t('settings.ai.portrait')}
          value={t('settings.ai.portraitGenerated')}
          onPress={() => router.push('/settings/ai/portrait')}
        />
      </SettingsSection>
    </SettingsPageShell>
  );
}

export function AiFeaturesScreen() {
  const { t } = useI18n();
  const features = useSettingsStore((state) => state.ai.features);
  const setAi = useSettingsStore((state) => state.setAi);

  const rows = [
    { key: 'chat', label: t('settings.ai.featureChat') },
    { key: 'insight', label: t('settings.ai.featureInsight') },
    { key: 'portrait', label: t('settings.ai.featurePortrait') },
    { key: 'story', label: t('settings.ai.featureStory') },
    { key: 'proactive', label: t('settings.ai.featureProactive') },
  ] as const;

  return (
    <SettingsPageShell title={t('settings.ai.features')}>
      <SettingsSection>
        {rows.map((row) => (
          <SettingsSwitchRow
            key={row.key}
            title={row.label}
            value={features[row.key]}
            onValueChange={(value) =>
              setAi({ features: { ...features, [row.key]: value } })
            }
          />
        ))}
      </SettingsSection>
    </SettingsPageShell>
  );
}

export function AiDataUsageScreen() {
  const { t } = useI18n();
  const dataUsage = useSettingsStore((state) => state.ai.dataUsage);
  const setAi = useSettingsStore((state) => state.setAi);

  const rows = [
    { key: 'moments', label: t('settings.ai.dataMoments') },
    { key: 'mood', label: t('settings.ai.dataMood') },
    { key: 'health', label: t('settings.ai.dataHealth') },
    { key: 'travel', label: t('settings.ai.dataTravel') },
    { key: 'relationship', label: t('settings.ai.dataRelationship') },
    { key: 'reading', label: t('settings.ai.dataReading') },
    { key: 'lifeEvents', label: t('settings.ai.dataLifeEvents') },
  ] as const;

  return (
    <SettingsPageShell title={t('settings.ai.dataUsage')}>
      <SettingsSection>
        {rows.map((row) => (
          <SettingsSwitchRow
            key={row.key}
            title={row.label}
            value={dataUsage[row.key]}
            onValueChange={(value) =>
              setAi({ dataUsage: { ...dataUsage, [row.key]: value } })
            }
          />
        ))}
      </SettingsSection>

      <SettingsSection>
        <SettingsSwitchRow
          title={t('settings.ai.dataTemporary')}
          subtitle={t('settings.ai.dataTemporaryHint')}
          value={dataUsage.temporary}
          onValueChange={(temporary) =>
            setAi({ dataUsage: { ...dataUsage, temporary } })
          }
        />
      </SettingsSection>
    </SettingsPageShell>
  );
}

export function AiMemoriesScreen() {
  const { t } = useI18n();
  const memories = useAiMemoryStore((state) => state.memories);
  const clearMemories = useAiMemoryStore((state) => state.clearMemories);
  const [clearVisible, setClearVisible] = useState(false);

  return (
    <SettingsPageShell title={t('settings.ai.memories')}>
      {memories.length === 0 ? (
        <SettingsNote
          tone="neutral"
          title={t('settings.ai.memoryEmpty')}
          message={t('settings.ai.memoryEmptyHint')}
        />
      ) : (
        <SettingsSection>
          {memories.map((memory) => (
            <MosaicListRow
              key={memory.id}
              title={memory.content}
              subtitle={`${t(CATEGORY_LABEL_KEYS[memory.category])} · ${t(
                'settings.ai.memoryUpdated',
                { time: memory.updatedAt },
              )}`}
              onPress={() =>
                router.push({
                  pathname: '/settings/ai/memories/[id]',
                  params: { id: memory.id },
                })
              }
            />
          ))}
        </SettingsSection>
      )}

      {memories.length > 0 && (
        <MosaicButton
          variant="destructive"
          size="lg"
          onPress={() => setClearVisible(true)}
        >
          {t('settings.ai.memoryClear')}
        </MosaicButton>
      )}

      <SettingsConfirmDialog
        visible={clearVisible}
        title={t('settings.ai.memoryClear')}
        message={t('settings.ai.memoryClearConfirm')}
        danger
        onConfirm={() => {
          clearMemories();
          setClearVisible(false);
        }}
        onClose={() => setClearVisible(false)}
      />
    </SettingsPageShell>
  );
}

export function AiMemoryDetailScreen() {
  const { t } = useI18n();
  const { id } = useLocalSearchParams<{ id: string }>();
  const memory = useAiMemoryStore((state) =>
    state.memories.find((item) => item.id === id),
  );
  const deleteMemory = useAiMemoryStore((state) => state.deleteMemory);
  const [deleteVisible, setDeleteVisible] = useState(false);

  if (!memory) {
    return (
      <SettingsPageShell title={t('settings.ai.memories')}>
        <SettingsNote message={t('settings.ai.memoryEmpty')} />
      </SettingsPageShell>
    );
  }

  return (
    <SettingsPageShell title={t('settings.ai.memoryDetail')}>
      <MosaicCard className="gap-3">
        <MosaicText variant="body">{memory.content}</MosaicText>
      </MosaicCard>

      <SettingsSection>
        <MosaicListRow
          title={t('settings.ai.memoryCategory')}
          value={t(CATEGORY_LABEL_KEYS[memory.category])}
          chevron={false}
        />
        <MosaicListRow
          title={t('settings.ai.memorySourceLabel')}
          value={memory.source}
          chevron={false}
        />
        <MosaicListRow
          title={t('settings.ai.memoryUpdatedLabel')}
          value={memory.updatedAt}
          chevron={false}
        />
      </SettingsSection>

      <View className="gap-3">
        <MosaicButton
          size="lg"
          onPress={() =>
            router.push({
              pathname: '/settings/ai/memory-edit',
              params: { id: memory.id },
            })
          }
        >
          {t('settings.ai.memoryEdit')}
        </MosaicButton>
        <MosaicButton
          variant="destructive"
          size="lg"
          onPress={() => setDeleteVisible(true)}
        >
          {t('settings.ai.memoryDelete')}
        </MosaicButton>
      </View>

      <SettingsConfirmDialog
        visible={deleteVisible}
        title={t('settings.ai.memoryDelete')}
        message={t('settings.ai.memoryDeleteConfirm')}
        danger
        onConfirm={() => {
          deleteMemory(memory.id);
          setDeleteVisible(false);
          router.back();
        }}
        onClose={() => setDeleteVisible(false)}
      />
    </SettingsPageShell>
  );
}

export function AiMemoryEditScreen() {
  const { t } = useI18n();
  const { id } = useLocalSearchParams<{ id: string }>();
  const memory = useAiMemoryStore((state) =>
    state.memories.find((item) => item.id === id),
  );
  const updateMemory = useAiMemoryStore((state) => state.updateMemory);

  if (!memory) {
    return (
      <SettingsPageShell title={t('settings.ai.memories')}>
        <SettingsNote message={t('settings.ai.memoryEmpty')} />
      </SettingsPageShell>
    );
  }

  return (
    <SettingsTextForm
      title={t('settings.ai.memoryEdit')}
      initialValue={memory.content}
      multiline
      maxLength={160}
      onSave={(content) => updateMemory(memory.id, content)}
    />
  );
}

export function AiPortraitScreen() {
  const { t } = useI18n();
  const [hidden, setHidden] = useState(false);
  const [regenerateVisible, setRegenerateVisible] = useState(false);
  const [regeneratedVisible, setRegeneratedVisible] = useState(false);

  return (
    <SettingsPageShell title={t('settings.ai.portrait')}>
      <SettingsSection>
        {TRAITS.map((trait) => (
          <MosaicListRow
            key={trait.key}
            title={t(trait.titleKey)}
            subtitle={t(trait.valueKey)}
            chevron={false}
          />
        ))}
      </SettingsSection>

      <SettingsSection>
        <SettingsSwitchRow
          title={t('settings.ai.portraitHide')}
          value={hidden}
          onValueChange={setHidden}
        />
      </SettingsSection>

      <MosaicButton size="lg" onPress={() => setRegenerateVisible(true)}>
        {t('settings.ai.portraitRegenerate')}
      </MosaicButton>

      <SettingsConfirmDialog
        visible={regenerateVisible}
        title={t('settings.ai.portraitRegenerate')}
        message={t('settings.ai.portraitRegenerateConfirm')}
        onConfirm={() => {
          setRegenerateVisible(false);
          setRegeneratedVisible(true);
        }}
        onClose={() => setRegenerateVisible(false)}
      />

      <SettingsInfoDialog
        visible={regeneratedVisible}
        title={t('settings.ai.portrait')}
        message={t('settings.ai.portraitRegenerateConfirm')}
        onClose={() => setRegeneratedVisible(false)}
      />
    </SettingsPageShell>
  );
}
