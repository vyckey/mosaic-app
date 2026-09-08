import {
  RichText,
  Toolbar,
  darkEditorTheme,
  useBridgeState,
  useEditorBridge,
  useEditorContent,
} from '@10play/tentap-editor';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  MosaicButton,
  MosaicChip,
  MosaicScreenHeader,
  MosaicTags,
  MosaicText,
} from '@/components/mosaic';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useI18n } from '@/i18n/useI18n';

const WEEKDAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;

const TOOLBAR_HEIGHT = 48;

export function DiaryRichTextScreen() {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const { draft, tags: tagsParam } = useLocalSearchParams<{
    draft?: string;
    tags?: string;
  }>();

  const editor = useEditorBridge({
    autofocus: false,
    avoidIosKeyboard: true,
    initialContent: typeof draft === 'string' ? draft : undefined,
    theme: colorScheme === 'dark' ? darkEditorTheme : undefined,
  });
  const bridgeState = useBridgeState(editor);
  const editorText = useEditorContent(editor, {
    type: 'text',
    debounceInterval: 300,
  });

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

  const placeholderInitialized = useRef(false);
  useEffect(() => {
    if (bridgeState.isReady && !placeholderInitialized.current) {
      placeholderInitialized.current = true;
      editor.setPlaceholder(t('diary.richTextPlaceholder'));
    }
  }, [bridgeState.isReady, editor, t]);

  const canSave = (editorText ?? '').trim().length > 0;
  const weather = WEATHERS[weatherIndex];

  const handleSave = async () => {
    const html = await editor.getHTML();
    const json = await editor.getJSON();
    console.log(
      'save diary:',
      JSON.stringify(
        {
          type: 'diary',
          title: title.trim(),
          date: dateLabel,
          weather: weather.label,
          tags,
          format: 'RICH_TEXT',
          content: html.trim(),
          json,
        },
        null,
        2,
      ),
    );
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
            <MosaicButton size="sm" disabled={!canSave} onPress={handleSave}>
              {t('common.save')}
            </MosaicButton>
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

      <View
        className="flex-1"
        style={{ paddingBottom: insets.bottom + TOOLBAR_HEIGHT }}
      >
        <RichText editor={editor} />
      </View>

      <KeyboardAvoidingView
        behavior="padding"
        style={{
          position: 'absolute',
          width: '100%',
          bottom: 0,
          paddingBottom: insets.bottom,
        }}
      >
        <Toolbar editor={editor} hidden={false} />
      </KeyboardAvoidingView>
    </View>
  );
}
