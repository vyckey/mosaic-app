import {
  CalendarCheck,
  Camera,
  FileText,
  Pencil,
  Smile,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { View } from 'react-native';

import {
  glassRimStyle,
  MosaicButton,
  MosaicChip,
  MosaicEmojiPicker,
  MosaicGlass,
  MosaicPressable,
  MosaicSheet,
  MosaicTags,
  MosaicText,
  MosaicTextArea,
} from '@/components/mosaic';
import { Icon } from '@/components/ui/icon';
import { EMOTION_EMOJIS, getEmotionLabel } from '@/constants/emojis';
import { useTheme } from '@/hooks/use-theme';
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
  const theme = useTheme();

  return (
    <MosaicPressable
      onPress={onPress}
      className="flex-1 items-center"
      accessibilityLabel={label}
    >
      {/* Circular liquid-glass surface wrapping only the icon; the label sits below, outside the glass */}
      <View className="h-11 w-11 items-center justify-center">
        <MosaicGlass
          className="absolute inset-0 rounded-full"
          style={glassRimStyle}
          tintColor={selected ? theme.colors.primaryMuted : undefined}
        />
        <Icon
          as={icon}
          size="md"
          className={selected ? 'text-primary' : 'text-text'}
        />
      </View>
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
          {/* Whole emoji strip wrapped in liquid glass */}
          <View className="mb-4 mt-3 rounded-stat px-2 py-2">
            <MosaicGlass
              className="absolute inset-0 rounded-stat"
              style={glassRimStyle}
            />
            <MosaicEmojiPicker
              mode="slider"
              items={EMOTION_EMOJIS.map((item) => ({
                emoji: item.emoji,
                label: getEmotionLabel(item, locale),
              }))}
              value={selectedMood}
              onChange={setSelectedMood}
            />
          </View>
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
        <MosaicTextArea
          glass
          value={text}
          onChangeText={setText}
          placeholder={t('create.placeholder')}
          minHeight={90}
          containerClassName="px-3.5 py-3.5"
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
