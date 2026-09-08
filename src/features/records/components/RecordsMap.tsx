import { Pressable, View } from 'react-native';

import { Text } from '@/components/ui/text';
import {
  MosaicCard,
  MosaicStat,
  MosaicStatGrid,
} from '@/components/mosaic';
import { useI18n } from '@/i18n/useI18n';

import {
  mockFeaturedLocationFragments,
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
              // TODO: 查看地点详情
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

      <MosaicCard>
        <MosaicStatGrid>
          <MosaicStat value={String(mockMapData.cities)} label={t('records.cities')} />
          <MosaicStat value={String(mockMapData.countries)} label={t('records.countries')} />
          <MosaicStat value={String(mockMapData.footprints)} label={t('records.footprints')} />
        </MosaicStatGrid>
      </MosaicCard>

      <MosaicCard>
        <Text className="text-body font-semibold text-text will-change-variable">
          {featured
            ? t('records.featuredLocation', {
                name: featured.name,
                count: featured.count,
              })
            : ''}
        </Text>

        <View className="mt-3">
          <RecordsStream fragments={mockFeaturedLocationFragments} />
        </View>
      </MosaicCard>
    </View>
  );
}
