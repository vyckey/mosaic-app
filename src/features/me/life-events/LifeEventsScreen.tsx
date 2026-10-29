import { router } from 'expo-router';
import {
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  ChevronRight,
  Milestone,
  Plus,
  Search,
} from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';

import {
  MosaicChip,
  MosaicChipGroup,
  MosaicIcon,
  MosaicIconButton,
  MosaicImagePreview,
  MosaicPressable,
  MosaicScreen,
  MosaicScreenHeader,
  MosaicSearchBar,
  MosaicText,
  useMosaicImagePreview,
} from '@/components/mosaic';
import { Icon } from '@/components/ui/icon';
import { useI18n } from '@/i18n/useI18n';

import { lifeEventCategories } from './categories';
import { LifeEventsOverview } from './components/LifeEventsOverview';
import { LifeEventsTimeline } from './components/LifeEventsTimeline';
import {
  computeLifeEventStats,
  groupLifeEventsByYear,
  matchesLifeEventQuery,
} from './format';
import { mockLifeEvents } from './mock';
import type { LifeEvent, LifeEventCategoryId } from './types';

/** `all` is a virtual filter option, not a stored category */
type CategoryFilter = 'all' | LifeEventCategoryId;

type SortOrder = 'desc' | 'asc';

/**
 * “Life Events” second-level page — the user's life archive.
 *
 * Text-first, timeline-driven: a typographic overview, one horizontally
 * scrollable category filter, then year-grouped rows with a thin rail. Photos
 * are only 44px thumbnails; full images belong to the detail page.
 */
export function LifeEventsScreen() {
  const { t } = useI18n();
  const preview = useMosaicImagePreview();

  const [category, setCategory] = useState<CategoryFilter>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [collapsedYears, setCollapsedYears] = useState<Set<number>>(
    () => new Set(),
  );

  const stats = useMemo(() => computeLifeEventStats(mockLifeEvents), []);

  const visibleEvents = useMemo(
    () =>
      mockLifeEvents.filter(
        (event) =>
          (category === 'all' || event.category === category) &&
          matchesLifeEventQuery(event, query),
      ),
    [category, query],
  );

  const groups = useMemo(
    () => groupLifeEventsByYear(visibleEvents, sortOrder),
    [visibleEvents, sortOrder],
  );

  const categoryOptions = [
    { value: 'all', label: t('lifeEvents.categories.all') },
    ...lifeEventCategories.map((item) => ({
      value: item.id as string,
      label: t(item.labelKey),
    })),
  ];

  const toggleYear = (year: number) => {
    setCollapsedYears((previous) => {
      const next = new Set(previous);
      if (next.has(year)) {
        next.delete(year);
      } else {
        next.add(year);
      }
      return next;
    });
  };

  const openEvent = (event: LifeEvent) => {
    router.push({
      pathname: '/me/life-events/[id]',
      params: { id: event.id },
    });
  };

  const openPhoto = (photos: string[], index: number) => {
    preview.open(
      photos.map((uri) => ({ uri })),
      index,
    );
  };

  /** One tap flips the timeline direction; the label and icon spell out which. */
  const toggleSortOrder = () =>
    setSortOrder((order) => (order === 'desc' ? 'asc' : 'desc'));

  const sortLabel = t(
    sortOrder === 'desc'
      ? 'lifeEvents.sort.newestFirst'
      : 'lifeEvents.sort.oldestFirst',
  );

  return (
    <MosaicScreen>
      <MosaicScreenHeader
        title={t('lifeEvents.title')}
        onBack={() => router.back()}
        actions={[
          <MosaicIconButton
            key="search"
            variant="glass"
            size="md"
            accessibilityLabel={t('lifeEvents.search')}
            onPress={() => setSearching((open) => !open)}
          >
            <MosaicIcon as={Search} size="md" tone="text" />
          </MosaicIconButton>,
          <MosaicIconButton
            key="add"
            variant="glass"
            size="md"
            accessibilityLabel={t('lifeEvents.add')}
            onPress={() => router.push('/me/life-events/new')}
          >
            <MosaicIcon as={Plus} size="md" tone="text" />
          </MosaicIconButton>,
        ]}
      />

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[18px] pb-40 pt-2"
        showsVerticalScrollIndicator={false}
      >
        <LifeEventsOverview stats={stats} />

        {searching && (
          <View className="mt-5">
            <MosaicSearchBar
              value={query}
              onChangeText={setQuery}
              placeholder={t('lifeEvents.searchPlaceholder')}
              autoFocus
            />
          </View>
        )}

        <View className="mt-8">
          <View className="flex-row items-center justify-between">
            <MosaicText variant="body" weight="600">
              {t('lifeEvents.timeline')}
            </MosaicText>

            {/* Sort lives next to the section title instead of behind an
                overflow sheet: one tap flips newest/oldest, the icon and label
                both reflect the active direction. */}
            <MosaicChip
              label={sortLabel}
              icon={
                sortOrder === 'desc' ? ArrowDownWideNarrow : ArrowUpNarrowWide
              }
              onPress={toggleSortOrder}
            />
          </View>

          <View className="mt-3">
            <MosaicChipGroup
              options={categoryOptions}
              value={category}
              onChange={(value) => setCategory(value as CategoryFilter)}
              scrollable
            />
          </View>

          <View className="mt-6">
            {groups.length > 0 ? (
              <LifeEventsTimeline
                groups={groups}
                collapsedYears={collapsedYears}
                onToggleYear={toggleYear}
                onEventPress={openEvent}
                onPhotoPress={openPhoto}
              />
            ) : (
              <View className="items-center gap-2 py-12">
                <View className="h-12 w-12 items-center justify-center rounded-full bg-primary-muted">
                  <MosaicIcon as={Milestone} size="md" tone="primary-strong" />
                </View>
                <MosaicText variant="body" weight="500" className="mt-1">
                  {t('lifeEvents.empty')}
                </MosaicText>
                <MosaicText variant="caption" tone="text-muted">
                  {t('lifeEvents.emptyHint')}
                </MosaicText>
              </View>
            )}
          </View>

          {/* Lightweight add entry at the end of the timeline — the global `+`
              stays the primary record action, so no floating FAB here. */}
          <MosaicPressable
            onPress={() => router.push('/me/lifeEvents.new')}
            className="mt-8 flex-row items-center gap-3 rounded-card border border-dashed border-border p-4"
          >
            <View className="h-10 w-10 items-center justify-center rounded-full bg-primary-muted">
              <MosaicIcon as={Plus} size="md" tone="primary-strong" />
            </View>

            <View className="min-w-0 flex-1">
              <MosaicText variant="body" weight="600">
                {t('lifeEvents.add')}
              </MosaicText>
              <MosaicText variant="tiny" tone="text-muted" className="mt-0.5">
                {t('lifeEvents.addHint')}
              </MosaicText>
            </View>

            <Icon as={ChevronRight} size="sm" className="text-text-subtle" />
          </MosaicPressable>
        </View>
      </ScrollView>

      <MosaicImagePreview {...preview} />
    </MosaicScreen>
  );
}
