import { useState } from 'react';
import { View } from 'react-native';

import { MosaicChipGroup, MosaicScreen } from '@/components/mosaic';
import { MosaicSearchBar } from '@/components/mosaic/MosaicSearchBar';
import { useI18n } from '@/i18n/useI18n';

import { mockCategories, mockRecordsFragments } from '../mock';
import type { RecordsView } from '../types';
import { RecordsCalendar } from './RecordsCalendar';
import { RecordsCategories } from './RecordsCategories';
import { RecordsMap } from './RecordsMap';
import { RecordsStream } from './RecordsStream';

export function RecordsScreen() {
  const { t } = useI18n();
  const [view, setView] = useState<RecordsView>('stream');
  const [query, setQuery] = useState('');

  return (
    <MosaicScreen>
      <MosaicSearchBar
        value={query}
        onChangeText={setQuery}
        placeholder={t('search.placeholder')}
      />

      <View className="mt-3">
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
      </View>

      <View className="mt-4">
        {view === 'stream' && <RecordsStream fragments={mockRecordsFragments} />}
        {view === 'calendar' && <RecordsCalendar />}
        {view === 'map' && <RecordsMap />}
        {view === 'category' && (
          <RecordsCategories categories={mockCategories} />
        )}
      </View>
    </MosaicScreen>
  );
}
