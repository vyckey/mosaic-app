import {
  CalendarCheck,
  Camera,
  FileText,
  Pencil,
  Smile,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { TextInput, View } from 'react-native';

import {
  MosaicButton,
  MosaicChip,
  MosaicEmojiPicker,
  MosaicPressable,
  MosaicSheet,
  MosaicTags,
  MosaicText,
} from '@/components/mosaic';
import { Icon } from '@/components/ui/icon';
import { EMOTION_EMOJIS, getEmotionLabel } from '@/constants/emojis';
import { useI18n } from '@/i18n/useI18n';

export type CreateActionType = 'mood' | 'moment' | 'text' | 'note' | 'checkin';

export type CreateFormat = 'TEXT' | 'RICH_TEXT' | 'MARKDOWN';

export interface CreateSheetProps {
  visible: boolean;
  onAction?: (
    action: CreateActionType,
    draft?: string,
    format?: CreateFormat,
    tags?: string[],
  ) => void;
  onClose?: () => void;
}

type CreateMode = CreateActionType;

interface ModeButtonProps {
  icon: React.ComponentProps<typeof Icon>['as'];
  label: string;
  selected?: boolean;
  onPress: () => void;
}

function ModeButton({ icon, label, selected, onPress }: ModeButtonProps) {
  return (
    <MosaicPressable
      onPress={onPress}
      className={`flex-1 items-center rounded-btn bg-surface py-2.5 ${
        selected ? 'bg-primary-muted' : ''
      }`}
    >
      <Icon
        as={icon}
        size="md"
        className={selected ? 'text-primary' : 'text-text'}
      />
      <MosaicText
        variant="tiny"
        tone={selected ? 'primary' : 'text'}
        className="mt-1"
      >
        {label}
      </MosaicText>
    </MosaicPressable>
  );
}

export function CreateSheet({ visible, onAction, onClose }: CreateSheetProps) {
  const { t, locale } = useI18n();

  const MODES: {
    key: CreateMode;
    icon: React.ComponentProps<typeof Icon>['as'];
    label: string;
  }[] = [
    { key: 'mood', icon: Smile, label: t('create.mood') },
    { key: 'moment', icon: Camera, label: t('create.moment') },
    { key: 'text', icon: Pencil, label: t('create.diary') },
    { key: 'note', icon: FileText, label: t('create.note') },
    { key: 'checkin', icon: CalendarCheck, label: t('create.checkin') },
  ];

  const CHECKIN_PURPOSES = [
    t('create.checkinPurposes.food'),
    t('create.checkinPurposes.place'),
    t('create.checkinPurposes.sport'),
    t('create.checkinPurposes.study'),
    t('create.checkinPurposes.reading'),
    t('create.checkinPurposes.travel'),
  ];

  const FORMATS: { key: CreateFormat; label: string }[] = [
    { key: 'TEXT', label: t('create.formats.text') },
    { key: 'RICH_TEXT', label: t('create.formats.richText') },
    { key: 'MARKDOWN', label: t('create.formats.markdown') },
  ];

  const [selectedMode, setSelectedMode] = useState<CreateMode>('mood');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [checkinPurpose, setCheckinPurpose] = useState<string | null>(null);
  const [format, setFormat] = useState<CreateFormat>('TEXT');
  const [text, setText] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const isEditorMode = selectedMode === 'text' || selectedMode === 'note';

  const handleSave = () => {
    const draft =
      selectedMode === 'mood'
        ? (selectedMood ?? '')
        : selectedMode === 'checkin'
          ? (checkinPurpose ?? '')
          : text;
    onAction?.(selectedMode, draft, format, tags);
  };

  return (
    <MosaicSheet visible={visible} onClose={onClose} title={t('create.title')}>
      <View className="mb-4 flex-row gap-2">
        {MODES.map((mode) => (
          <ModeButton
            key={mode.key}
            icon={mode.icon}
            label={mode.label}
            selected={selectedMode === mode.key}
            onPress={() => {
              if (mode.key === 'moment') {
                onAction?.('moment');
                return;
              }
              setSelectedMode(mode.key);
            }}
          />
        ))}
      </View>

      {selectedMode === 'mood' && (
        <>
          <MosaicText variant="tiny" tone="text-muted" className="mb-2 mt-3">
            {t('create.moodTitle')}
          </MosaicText>
          <MosaicEmojiPicker
            mode="slider"
            items={EMOTION_EMOJIS.map((item) => ({
              emoji: item.emoji,
              label: getEmotionLabel(item, locale),
            }))}
            value={selectedMood}
            onChange={setSelectedMood}
            className="mb-4 mt-3"
          />
        </>
      )}

      {selectedMode === 'checkin' && (
        <>
          <MosaicText variant="tiny" tone="text-muted" className="mb-2 mt-3">
            {t('create.checkinTitle')}
          </MosaicText>
          <View className="mt-3 mb-4 flex-row flex-wrap gap-2">
            {CHECKIN_PURPOSES.map((purpose) => (
              <MosaicChip
                key={purpose}
                label={purpose}
                active={checkinPurpose === purpose}
                onPress={() =>
                  setCheckinPurpose(checkinPurpose === purpose ? null : purpose)
                }
              />
            ))}
          </View>
        </>
      )}

      {isEditorMode && (
        <>
          <MosaicText variant="tiny" tone="text-muted" className="mb-2 mt-3">
            {t('create.formatTitle')}
          </MosaicText>
          <View className="mb-4 flex-row gap-2">
            {FORMATS.map((item) => (
              <MosaicChip
                key={item.key}
                label={item.label}
                active={format === item.key}
                onPress={() => setFormat(item.key)}
              />
            ))}
          </View>
        </>
      )}

      {['mood', 'checkin'].includes(selectedMode) && (
        <MosaicTags value={tags} onChange={setTags} className="mb-4" />
      )}

      {!isEditorMode && (
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder={t('create.placeholder')}
          placeholderTextColor="var(--color-text-muted)"
          multiline
          textAlignVertical="top"
          className="min-h-[90px] rounded-stat border border-border bg-surface px-3.5 py-3.5 text-body text-text"
          style={{ lineHeight: 22 }}
        />
      )}

      <MosaicButton
        variant="primary"
        className="mt-4 w-full"
        onPress={handleSave}
      >
        {isEditorMode ? t('create.continue') : t('create.save')}
      </MosaicButton>
    </MosaicSheet>
  );
}
