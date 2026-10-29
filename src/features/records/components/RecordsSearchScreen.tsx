import { Flame, History, Trash2 } from 'lucide-react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  MosaicChip,
  MosaicPressable,
  MosaicScreen,
  MosaicSearchBar,
  MosaicSectionHeader,
} from '@/components/mosaic';
import { Text } from '@/components/ui/text';
import { useI18n } from '@/i18n/useI18n';

import { mockRecentSearches, mockRecommendedSearches } from '../mock';

const MAX_RECENT_SEARCHES = 10;

/** Records tab's standalone search page: auto-focuses the field (keyboard pops), recent searches + recommendations below */
export function RecordsSearchScreen() {
  const { t } = useI18n();
  // This page's header is a custom row (search bar + cancel), not MosaicScreenHeader,
  // so it owns its own top inset like any other first-class surface
  const insets = useSafeAreaInsets();

  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(mockRecentSearches);
  /** Removal mode for recent searches: the ✕ only shows on chips while on */
  const [removingRecent, setRemovingRecent] = useState(false);

  /** Run a search: fill the field and record it (dedupe, pin to top, cap), then exit removal mode */
  const commitSearch = (keyword: string) => {
    const trimmed = keyword.trim();
    if (!trimmed) return;

    setQuery(trimmed);
    setRecentSearches((prev) =>
      [trimmed, ...prev.filter((item) => item !== trimmed)].slice(0, MAX_RECENT_SEARCHES),
    );
    setRemovingRecent(false);
    // TODO: wire up the real result list
  };

  const removeRecent = (keyword: string) => {
    setRecentSearches((prev) => prev.filter((item) => item !== keyword));
  };

  return (
    <MosaicScreen>
      {/* Fixed header (does not scroll with the content): auto-focused search bar + cancel */}
      <View
        className="flex-row items-center gap-2 px-[18px] pb-2"
        style={{ paddingTop: insets.top }}
      >
        <MosaicSearchBar
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => commitSearch(query)}
          autoFocus
          className="flex-1"
        />

        <MosaicPressable
          onPress={() => router.back()}
          accessibilityLabel={t('common.back')}
        >
          <Text className="text-body text-primary">{t('common.cancel')}</Text>
        </MosaicPressable>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[18px] pb-40 pt-4"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {recentSearches.length > 0 && (
          <View className="mb-6">
            <MosaicSectionHeader
              title={t('search.recent')}
              icon={History}
              actionIcon={Trash2}
              actionAccessibilityLabel={t('search.removeRecent')}
              onAction={() => setRemovingRecent((prev) => !prev)}
            />

            {/* Pills: tapping one runs the search; in removal mode a ✕ appears and deletes that entry */}
            <View className="mt-3 flex-row flex-wrap gap-2">
              {recentSearches.map((keyword) => (
                <MosaicChip
                  key={keyword}
                  label={keyword}
                  onPress={() => commitSearch(keyword)}
                  onRemove={removingRecent ? () => removeRecent(keyword) : undefined}
                />
              ))}
            </View>
          </View>
        )}

        <View>
          <MosaicSectionHeader title={t('search.recommended')} icon={Flame} />

          {/* Plain text, two-column grid */}
          <View className="mt-1 flex-row flex-wrap">
            {mockRecommendedSearches.map((keyword) => (
              <MosaicPressable
                key={keyword}
                onPress={() => commitSearch(keyword)}
                accessibilityLabel={keyword}
                className="w-1/2 py-2"
              >
                <Text className="text-body text-text">{keyword}</Text>
              </MosaicPressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </MosaicScreen>
  );
}
