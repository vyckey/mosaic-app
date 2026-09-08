import { ChevronRight, Sparkles } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { MosaicCard, MosaicSection, MosaicSectionHeader } from '@/components/mosaic';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

import type { TodayFragment } from '../types';

interface TodayFragmentsProps {
  fragments: TodayFragment[];
  onPress?: (fragment: TodayFragment) => void;
}

export function TodayFragments({ fragments, onPress }: TodayFragmentsProps) {
  const visibleFragments = fragments.slice(0, 3);

  return (
    <MosaicSection spacing="lg">
      <MosaicCard>
        <MosaicSectionHeader
          title="今日碎片"
          icon={Sparkles}
          className="mb-4"
        />

        <View className="rounded-xl bg-background-muted">
          {visibleFragments.map((fragment, index) => (
            <Pressable
              key={fragment.id}
              onPress={() => onPress?.(fragment)}
              className="flex-row items-center px-4 py-4"
            >
              <Text className="w-14 text-xs text-text-muted">
                {fragment.time}
              </Text>

              <Text
                numberOfLines={1}
                className="ml-3 flex-1 text-sm text-foreground"
              >
                {fragment.content}
              </Text>

              <Icon
                as={ChevronRight}
                size="sm"
                className="ml-2 text-text-muted"
              />
            </Pressable>
          ))}
        </View>
      </MosaicCard>
    </MosaicSection>
  );
}
