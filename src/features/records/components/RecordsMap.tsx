import { Pressable, View } from 'react-native';

import { Text } from '@/components/ui/text';
import {
  MosaicStat,
  MosaicStatGrid,
} from '@/components/mosaic';
import { useI18n } from '@/i18n/useI18n';

import {
  mockFeaturedLocationRecords,
  mockMapData,
} from '../mock';
import { RecordsStream } from './RecordsStream';

export function RecordsMap() {
  const { t } = useI18n();
  const featured = mockMapData.locations.find(
    (loc) => loc.id === mockMapData.featuredLocationId,
  );

  return (
    <View className="gap-4">
      <View className="h-[260px] overflow-hidden rounded-card bg-background-muted">
        {mockMapData.locations.map((location) => (
          <Pressable
            key={location.id}
            onPress={() => {
              // TODO: open location detail
              console.log('location:', location.name);
            }}
            className="absolute rounded-full bg-accent-clay px-2.5 py-1.5"
            style={{
              left: location.left,
              top: location.top,
            }}
          >
            <Text className="text-xs text-white will-change-variable">
              {location.name} · {location.count}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Flat stats row on the page canvas (no card chrome);
          MosaicStat blocks carry their own muted surface */}
      <View>
        <MosaicStatGrid>
          <MosaicStat value={String(mockMapData.cities)} label={t('records.cities')} />
          <MosaicStat value={String(mockMapData.countries)} label={t('records.countries')} />
          <MosaicStat value={String(mockMapData.footprints)} label={t('records.footprints')} />
        </MosaicStatGrid>
      </View>

      {/* Featured location records: flat section, entries share the page gutter */}
      <View>
        <Text className="text-body font-semibold text-text will-change-variable">
          {featured
            ? t('records.featuredLocation', {
                name: featured.name,
                count: featured.count,
              })
            : ''}
        </Text>

        <View className="mt-3">
          <RecordsStream records={mockFeaturedLocationRecords} inline />
        </View>
      </View>
    </View>
  );
}
