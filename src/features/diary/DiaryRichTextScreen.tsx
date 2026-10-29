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
  MosaicScreen,
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

  // After the SDK 58 upgrade, tentap's type chain × RN 0.88 triggers TS2589
  // (type instantiation too deep); tentap 1.1.0 has not fixed it and the types
  // live in the dependency, so the app side cannot route around it. Re-check
  // after a tentap upgrade — if fixed, this line can go (TS will flag the
  // now-unused directive).
  // @ts-expect-error Type instantiation is excessively deep
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
    // Editor page: fixed meta chrome + a flex-1 rich-text surface with an
    // absolute keyboard toolbar — the page owns its layout.
    <MosaicScreen>
      <MosaicScreenHeader
        title={t('diary.title')}
        onBack={() => router.back()}
        actions={[
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
    </MosaicScreen>
  );
}
