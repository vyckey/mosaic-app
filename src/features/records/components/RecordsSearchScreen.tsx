import { Flame, History, Trash2 } from 'lucide-react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  MosaicChip,
  MosaicPressable,
  MosaicSearchBar,
  MosaicSectionHeader,
} from '@/components/mosaic';
import { Text } from '@/components/ui/text';
import { useI18n } from '@/i18n/useI18n';

import { mockRecentSearches, mockRecommendedSearches } from '../mock';

const MAX_RECENT_SEARCHES = 10;

/** 碎片 Tab 的独立搜索页：进入自动聚焦唤起键盘，下方展示最近搜索与推荐 */
export function RecordsSearchScreen() {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();

  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(mockRecentSearches);
  /** 最近搜索的删除模式：开启后胶囊上才显示删除标识 */
  const [removingRecent, setRemovingRecent] = useState(false);

  /** 执行搜索：写入输入框并记入最近搜索（去重、置顶、封顶），同时退出删除模式 */
  const commitSearch = (keyword: string) => {
    const trimmed = keyword.trim();
    if (!trimmed) return;

    setQuery(trimmed);
    setRecentSearches((prev) =>
      [trimmed, ...prev.filter((item) => item !== trimmed)].slice(0, MAX_RECENT_SEARCHES),
    );
    setRemovingRecent(false);
    // TODO: 接入真实搜索结果列表
  };

  const removeRecent = (keyword: string) => {
    setRecentSearches((prev) => prev.filter((item) => item !== keyword));
  };

  return (
    <View className="flex-1 bg-background">
      {/* 顶部：自动聚焦的搜索条 + 取消（固定，不随内容滚动） */}
      <View
        className="flex-row items-center gap-2 px-[18px] pb-2"
        style={{ paddingTop: insets.top + 4 }}
      >
        <MosaicSearchBar
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => commitSearch(query)}
          autoFocus
          className="flex-1"
        />

        <MosaicPressable onPress={() => router.back()} accessibilityLabel={t('common.back')}>
          <Text className="text-body text-primary">{t('common.cancel')}</Text>
        </MosaicPressable>
      </View>

      {/* 下方：最近搜索 + 推荐 */}
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

            {/* 圆角胶囊：点胶囊执行搜索；进入删除模式后 ✕ 才出现，点击可删除该条 */}
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

          {/* 纯文字、两列网格 */}
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
    </View>
  );
}
