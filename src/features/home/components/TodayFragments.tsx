import { Text, View } from 'react-native';

import {
  MosaicCard,
  MosaicList,
  MosaicListRow,
  MosaicSectionHeader,
} from '@/components/mosaic';
import { useI18n } from '@/i18n/useI18n';

import type { TodayFragment } from '../types';

interface TodayFragmentsProps {
  fragments: TodayFragment[];
  onPress?: (fragment: TodayFragment) => void;
}

export function TodayFragments({ fragments, onPress }: TodayFragmentsProps) {
  const { t } = useI18n();

  const visibleFragments = fragments.slice(0, 3);

  return (
    <MosaicCard>
      <MosaicSectionHeader
        title={t('today.fragmentsTitle')}
        subtitle={t('today.fragmentsSubtitle', { count: fragments.length })}
        divider
        className="mb-0"
      />

      <MosaicList>
        {visibleFragments.map((fragment) => (
          <MosaicListRow
            key={fragment.id}
            leading={
              <View className="h-9 w-9 items-center justify-center rounded-stat bg-primary-muted">
                <Text className="text-lg">{fragment.emoji}</Text>
              </View>
            }
            title={fragment.content}
            subtitle={`${fragment.time} · ${fragment.type}`}
            onPress={() => onPress?.(fragment)}
          />
        ))}
      </MosaicList>
    </MosaicCard>
  );
}
