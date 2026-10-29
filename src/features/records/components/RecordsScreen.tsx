import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MosaicChipGroup, MosaicScreen } from '@/components/mosaic';
import { MosaicSearchBar } from '@/components/mosaic/MosaicSearchBar';
import { useI18n } from '@/i18n/useI18n';

import { mockCategories, mockMosaicRecords } from '../mock';
import type { RecordsView } from '../types';
import { RecordsCalendar } from './RecordsCalendar';
import { RecordsCategories } from './RecordsCategories';
import { RecordsMap } from './RecordsMap';
import { RecordsStream } from './RecordsStream';

export function RecordsScreen() {
  const { t } = useI18n();
  const [view, setView] = useState<RecordsView>('stream');
  // Non-stream views: plain ScrollView page — the scroller owns the top inset
  // and pb-40 clears the floating capsule. (The stream view's FlashList owns
  // its padding inside RecordsStream.)
  const insets = useSafeAreaInsets();

  const viewSwitcher = (
    <MosaicChipGroup
      options={[
        { value: 'stream', label: t('records.stream') },
        { value: 'calendar', label: t('records.calendar') },
        { value: 'map', label: t('records.map') },
        { value: 'category', label: t('records.category') },
      ]}
      value={view}
      onChange={(value) => setView(value as RecordsView)}
      scrollable
    />
  );

  if (view === 'stream') {
    // Stream view: the FlashList IS the page scroller (a virtualized list
    // cannot live inside MosaicScreen's ScrollView), so the search bar and
    // view switcher ride in its header instead.
    return (
      <View className="flex-1 bg-background">
        <RecordsStream
          records={mockMosaicRecords}
          header={
            <>
              <MosaicSearchBar
                placeholder={t('search.placeholder')}
                onPress={() => router.push('/search')}
              />
              <View className="mt-3">{viewSwitcher}</View>
            </>
          }
        />
      </View>
    );
  }

  return (
    <MosaicScreen>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[18px] pb-40"
        contentContainerStyle={{ paddingTop: insets.top }}
        showsVerticalScrollIndicator={false}
      >
        <MosaicSearchBar
          placeholder={t('search.placeholder')}
          onPress={() => router.push('/search')}
        />

        <View className="mt-3">{viewSwitcher}</View>

        <View className="mt-4">
          {view === 'calendar' && <RecordsCalendar />}
          {view === 'map' && <RecordsMap />}
          {view === 'category' && (
            <RecordsCategories categories={mockCategories} />
          )}
        </View>
      </ScrollView>
    </MosaicScreen>
  );
}
