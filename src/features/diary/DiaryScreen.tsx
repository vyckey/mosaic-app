import Markdown from '@ronradtke/react-native-markdown-display';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  MosaicButton,
  MosaicChip,
  MosaicScreenHeader,
  MosaicTags,
  MosaicTextArea,
  MosaicText,
} from '@/components/mosaic';
import { useI18n } from '@/i18n/useI18n';
import { lightTheme } from '@/theme';

export type DiaryFormat = 'TEXT' | 'MARKDOWN';

const WEEKDAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;

const markdownStyles = StyleSheet.create({
  body: {
    color: lightTheme.colors.text,
    fontSize: 14,
    lineHeight: 22,
  },
  heading1: {
    color: lightTheme.colors.text,
    fontSize: 24,
    fontWeight: '700',
  },
  heading2: {
    color: lightTheme.colors.text,
    fontSize: 20,
    fontWeight: '600',
  },
  heading3: {
    color: lightTheme.colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    color: lightTheme.colors.primary,
  },
  strong: {
    fontWeight: '700',
  },
  blockquote: {
    backgroundColor: lightTheme.colors.surface,
    borderLeftColor: lightTheme.colors.primary,
  },
  code_inline: {
    backgroundColor: lightTheme.colors.surfaceMuted,
    color: lightTheme.colors.text,
  },
  code_block: {
    backgroundColor: lightTheme.colors.surfaceMuted,
    color: lightTheme.colors.text,
  },
});

export function DiaryScreen() {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const { draft, format: formatParam, tags: tagsParam } = useLocalSearchParams<{
    draft?: string;
    format?: string;
    tags?: string;
  }>();
  const format: DiaryFormat = formatParam === 'MARKDOWN' ? 'MARKDOWN' : 'TEXT';
  const isMarkdown = format === 'MARKDOWN';

  const WEATHERS = [
    { emoji: '☀️', label: t('diary.weather.sunny') },
    { emoji: '⛅', label: t('diary.weather.cloudy') },
    { emoji: '🌧️', label: t('diary.weather.rain') },
    { emoji: '❄️', label: t('diary.weather.snow') },
  ];

  const formatDate = (date: Date) => {
    const weekday = t(`diary.weekday.${WEEKDAY_KEYS[date.getDay()]}`);
    return t('diary.dateFormat', {
      month: date.getMonth() + 1,
      day: date.getDate(),
      weekday,
    });
  };

  const [dateLabel] = useState(() => formatDate(new Date()));
  const [weatherIndex, setWeatherIndex] = useState(0);
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>(() =>
    typeof tagsParam === 'string' && tagsParam
      ? tagsParam.split(',').filter(Boolean)
      : [],
  );
  const [content, setContent] = useState(
    typeof draft === 'string' ? draft : '',
  );
  const [preview, setPreview] = useState(false);

  const canSave = content.trim().length > 0;
  const weather = WEATHERS[weatherIndex];

  const handleTogglePreview = () => {
    Keyboard.dismiss();
    setPreview((prev) => !prev);
  };

  const handleSave = () => {
    console.log('save diary:', {
      type: 'diary',
      title: title.trim(),
      date: dateLabel,
      weather: weather.label,
      tags,
      format,
      content: content.trim(),
    });
    router.back();
  };

  return (
    <View className="flex-1 bg-background">
      <View
        className="min-h-11 flex-row items-center px-2"
        style={{ paddingTop: insets.top + 4 }}
      >
        <MosaicScreenHeader
          title={t('diary.title')}
          onBack={() => router.back()}
          right={
            <View className="flex-row items-center gap-2">
              {isMarkdown && (
                <MosaicButton
                  size="sm"
                  variant="secondary"
                  onPress={handleTogglePreview}
                >
                  {preview ? t('diary.edit') : t('diary.preview')}
                </MosaicButton>
              )}
              <MosaicButton
                size="sm"
                disabled={!canSave}
                onPress={handleSave}
              >
                {t('common.save')}
              </MosaicButton>
            </View>
          }
          className="flex-1"
        />
      </View>

      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder={t('diary.titlePlaceholder')}
        placeholderTextColor="var(--color-text-muted)"
        className="mx-[18px] mt-2 h-12 px-0 text-text"
        style={{ fontSize: 20, lineHeight: 28, fontWeight: '600', padding: 0 }}
      />

      <View className="mx-[18px] mt-2 flex-row items-center gap-2">
        <MosaicText variant="tiny" tone="text-muted">
          {dateLabel}
        </MosaicText>
        <MosaicChip
          emoji={weather.emoji}
          label={weather.label}
          onPress={() =>
            setWeatherIndex((prev) => (prev + 1) % WEATHERS.length)
          }
        />
      </View>

      <MosaicTags value={tags} onChange={setTags} className="mt-3 flex-grow-0" />

      {isMarkdown && preview ? (
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-[18px] pb-10 pt-3"
          showsVerticalScrollIndicator={false}
        >
          {content.trim() ? (
            <Markdown style={markdownStyles}>{content}</Markdown>
          ) : (
            <MosaicText tone="text-muted">{t('diary.noContentToPreview')}</MosaicText>
          )}
        </ScrollView>
      ) : (
        <MosaicTextArea
          value={content}
          onChangeText={setContent}
          placeholder={
            isMarkdown
              ? t('diary.markdownPlaceholder')
              : t('diary.textPlaceholder')
          }
          minHeight={0}
          containerClassName="mx-[18px] mb-4 mt-3 flex-1"
        />
      )}
    </View>
  );
}
