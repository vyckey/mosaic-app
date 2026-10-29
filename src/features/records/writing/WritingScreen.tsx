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

import {
  MosaicButton,
  MosaicChip,
  MosaicScreen,
  MosaicScreenHeader,
  MosaicTagsEditor,
  MosaicTextArea,
  MosaicText,
} from '@/components/mosaic';
import { useI18n } from '@/i18n/useI18n';
import { lightTheme } from '@/theme';

export type WritingFormat = 'TEXT' | 'MARKDOWN';

const WEEKDAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;

const markdownStyles = StyleSheet.create({
  // Body copy follows the body typography token (kept in sync with --text-body)
  body: {
    color: lightTheme.colors.text,
    fontSize: lightTheme.typography.body.fontSize,
    lineHeight: lightTheme.typography.body.lineHeight,
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
  // h3 mirrors the subtitle tier (18) so headings stay above the 16px body
  heading3: {
    color: lightTheme.colors.text,
    fontSize: 18,
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

export function WritingScreen() {
  const { t } = useI18n();
  const { draft, format: formatParam, tags: tagsParam } = useLocalSearchParams<{
    draft?: string;
    format?: string;
    tags?: string;
  }>();
  const format: WritingFormat = formatParam === 'MARKDOWN' ? 'MARKDOWN' : 'TEXT';
  const isMarkdown = format === 'MARKDOWN';

  const WEATHERS = [
    { emoji: '☀️', label: t('writing.weather.sunny') },
    { emoji: '⛅', label: t('writing.weather.cloudy') },
    { emoji: '🌧️', label: t('writing.weather.rain') },
    { emoji: '❄️', label: t('writing.weather.snow') },
  ];

  const formatDate = (date: Date) => {
    const weekday = t(`writing.weekday.${WEEKDAY_KEYS[date.getDay()]}`);
    return t('writing.dateFormat', {
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
    console.log('save writing:', {
      type: 'writing',
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
    // Editor page: fixed meta chrome (title / weather / tags) + a flex-1 body
    // (editor or preview) — the page owns its layout, not a default ScrollView.
    <MosaicScreen>
      <MosaicScreenHeader
        title={t('writing.title')}
        onBack={() => router.back()}
        actions={[
          isMarkdown && (
            <MosaicButton
              key="preview"
              size="md"
              variant="glass"
              onPress={handleTogglePreview}
            >
              {preview ? t('writing.edit') : t('writing.preview')}
            </MosaicButton>
          ),
          <MosaicButton
            key="save"
            size="md"
            variant="glass"
            disabled={!canSave}
            onPress={handleSave}
          >
            {t('common.save')}
          </MosaicButton>,
        ]}
      />

      {/* Content column: one shared horizontal gutter for every child */}
      <View className="flex-1 px-[18px]">
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder={t('writing.titlePlaceholder')}
          placeholderTextColor="var(--color-text-muted)"
          className="mt-2 h-12 px-0 text-text"
          style={{ fontSize: 20, lineHeight: 28, fontWeight: '600', padding: 0 }}
        />

        <View className="mt-2 flex-row items-center gap-2">
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

        <MosaicTagsEditor
          value={tags}
          onChange={setTags}
          className="mt-3 flex-grow-0"
        />

        {isMarkdown && preview ? (
          <ScrollView
            className="flex-1"
            contentContainerClassName="pb-10 pt-3"
            showsVerticalScrollIndicator={false}
          >
            {content.trim() ? (
              <Markdown style={markdownStyles}>{content}</Markdown>
            ) : (
              <MosaicText tone="text-muted">
                {t('writing.noContentToPreview')}
              </MosaicText>
            )}
          </ScrollView>
        ) : (
          <MosaicTextArea
            value={content}
            onChangeText={setContent}
            placeholder={
              isMarkdown
                ? t('writing.markdownPlaceholder')
                : t('writing.textPlaceholder')
            }
            minHeight={0}
            containerClassName="mb-4 mt-3 flex-1"
          />
        )}
      </View>
    </MosaicScreen>
  );
}
