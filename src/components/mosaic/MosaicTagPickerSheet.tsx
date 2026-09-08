import * as Haptics from 'expo-haptics';
import { X } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Text, View, type ScrollView as RNScrollView } from 'react-native';
import Animated, { useAnimatedRef } from 'react-native-reanimated';
import Sortable from 'react-native-sortables';

import { Icon } from '@/components/ui/icon';
import { useI18n } from '@/i18n/useI18n';

import { MosaicButton } from './MosaicButton';
import { MosaicChip } from './MosaicChip';
import { MosaicChipGroup } from './MosaicChipGroup';
import { MosaicSearchBar } from './MosaicSearchBar';
import { MosaicSheet } from './MosaicSheet';
import { MosaicText } from './MosaicText';

const DEFAULT_MAX = 10;

export interface MosaicTagPickerSheetProps {
  visible: boolean;
  /** 点击遮罩/返回键关闭（丢弃草稿，不保存） */
  onClose?: () => void;
  onDone: (tags: string[]) => void;
  onCreate?: (tag: string) => void;
  selected?: string[];
  allTags?: string[];
  recentTags?: string[];
  popularTags?: string[];
  max?: number;
}

export function MosaicTagPickerSheet({
  visible,
  onClose,
  onDone,
  onCreate,
  selected = [],
  allTags = [],
  recentTags = [],
  popularTags = [],
  max = DEFAULT_MAX,
}: MosaicTagPickerSheetProps) {
  const { t } = useI18n();
  const [draft, setDraft] = useState<string[]>(selected);
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<'recent' | 'popular'>('recent');
  const [cleared, setCleared] = useState<string[] | null>(null);
  const [prevVisible, setPrevVisible] = useState(visible);
  const scrollRef = useAnimatedRef<RNScrollView>();

  if (visible !== prevVisible) {
    setPrevVisible(visible);
    if (visible) {
      setDraft(selected);
      setQuery('');
      setTab('recent');
      setCleared(null);
    }
  }

  const trimmed = query.trim();
  const filtered = useMemo(() => {
    if (!trimmed) return [];
    const keyword = trimmed.toLowerCase();
    return allTags.filter((tag) => tag.toLowerCase().includes(keyword));
  }, [allTags, trimmed]);

  const atMax = draft.length >= max;

  const toggle = (tag: string) => {
    if (draft.includes(tag)) {
      Haptics.selectionAsync();
      setDraft((prev) => prev.filter((item) => item !== tag));
      return;
    }
    if (atMax) return;
    Haptics.selectionAsync();
    setCleared(null);
    setDraft((prev) => [...prev, tag]);
  };

  const removeTag = (tag: string) => {
    Haptics.selectionAsync();
    setDraft((prev) => prev.filter((item) => item !== tag));
  };

  const handleClear = () => {
    if (draft.length === 0) return;
    setCleared(draft);
    setDraft([]);
  };

  const handleUndo = () => {
    if (!cleared) return;
    setDraft(cleared);
    setCleared(null);
  };

  const handleDone = () => {
    onDone(draft);
    onClose?.();
  };

  const handleCreate = () => {
    if (!trimmed || draft.includes(trimmed) || atMax) return;
    onCreate?.(trimmed);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setDraft((prev) => [...prev, trimmed]);
    setQuery('');
  };

  const renderChips = (tags: string[]) => (
    <View className="flex-row flex-wrap gap-2">
      {tags.map((tag) => {
        const active = draft.includes(tag);
        return (
          <MosaicChip
            key={tag}
            label={tag}
            active={active}
            onPress={!active && atMax ? undefined : () => toggle(tag)}
            className={!active && atMax ? 'opacity-50' : undefined}
          />
        );
      })}
    </View>
  );

  const createChip = (label: string) => (
    <MosaicChip
      label={label}
      active
      onPress={draft.length >= max ? undefined : handleCreate}
      className={draft.length >= max ? 'opacity-50' : undefined}
    />
  );

  const sectionLabel = (label: string) => (
    <MosaicText variant="tiny" tone="text-muted">
      {label}
    </MosaicText>
  );

  return (
    <MosaicSheet
      visible={visible}
      onClose={onClose}
      title={t('tagPicker.title')}
      headerRight={
        <MosaicButton size="sm" onPress={handleDone}>
          {t('tagPicker.done')}
        </MosaicButton>
      }
      footer={
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <MosaicButton
              size="sm"
              variant="ghost"
              onPress={handleClear}
              disabled={draft.length === 0}
            >
              {t('tagPicker.clear')}
            </MosaicButton>
            {cleared && (
              <MosaicButton size="sm" variant="secondary" onPress={handleUndo}>
                {t('tagPicker.undo')}
              </MosaicButton>
            )}
          </View>
          <MosaicButton size="sm" onPress={handleDone}>
            {t('tagPicker.doneCount', { count: draft.length, max })}
          </MosaicButton>
        </View>
      }
    >
      <View className="gap-4 pb-2">
        <MosaicSearchBar
          value={query}
          onChangeText={setQuery}
          placeholder={t('tagPicker.searchPlaceholder')}
        />

        <View className="gap-2">
          <View className="flex-row items-center justify-between">
            {sectionLabel(
              t('tagPicker.selected', { count: draft.length, max }),
            )}
          </View>
          {draft.length > 0 && (
            <Animated.ScrollView
              ref={scrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              <Sortable.Flex
                flexDirection="row"
                flexWrap="nowrap"
                gap={8}
                hapticsEnabled
                dragActivationDelay={350}
                scrollableRef={scrollRef}
                onDragEnd={({ order }) => setDraft(order(draft))}
              >
                {draft.map((tag) => (
                  <View key={tag}>
                    <Sortable.Touchable onTap={() => removeTag(tag)}>
                      <View className="flex-row items-center gap-1 rounded-full bg-primary px-3 py-1.5">
                        <Text className="text-xs text-primary-foreground">
                          {tag}
                        </Text>
                        <Icon
                          as={X}
                          size="2xs"
                          className="text-primary-foreground"
                        />
                      </View>
                    </Sortable.Touchable>
                  </View>
                ))}
              </Sortable.Flex>
            </Animated.ScrollView>
          )}
        </View>

        {trimmed ? (
          filtered.length > 0 ? (
            <View className="gap-2">
              {sectionLabel(t('tagPicker.all'))}
              {renderChips(filtered)}
            </View>
          ) : (
            <View className="flex-row items-center gap-2">
              {createChip(t('tagPicker.create', { name: trimmed }))}
            </View>
          )
        ) : (
          <>
            <View className="gap-2">
              <View className="flex-row items-center gap-2">
                {sectionLabel(t('tagPicker.recommended'))}
                <MosaicChipGroup
                  scrollable
                  options={[
                    { value: 'recent', label: t('tagPicker.recent') },
                    { value: 'popular', label: t('tagPicker.popular') },
                  ]}
                  value={tab}
                  onChange={(next) => setTab(next as 'recent' | 'popular')}
                />
              </View>
              {renderChips(tab === 'recent' ? recentTags : popularTags)}
            </View>

            <View className="gap-2">
              {sectionLabel(t('tagPicker.all'))}
              {renderChips(allTags)}
            </View>
          </>
        )}
      </View>
    </MosaicSheet>
  );
}
