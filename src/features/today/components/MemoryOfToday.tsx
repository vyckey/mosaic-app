import { CalendarDays, MoreHorizontal } from 'lucide-react-native';
import { Image, Pressable, View } from 'react-native';

import { MosaicCard, MosaicSection, MosaicSectionHeader } from '@/components/mosaic';
import { Text } from '@/components/ui/text';

import type { MemoryOfToday as MemoryOfTodayType } from '../types';

interface MemoryOfTodayProps {
  memory: MemoryOfTodayType;
  onPress?: () => void;
  onMore?: () => void;
}

export function MemoryOfToday({ memory, onPress, onMore }: MemoryOfTodayProps) {
  return (
    <MosaicSection spacing="lg">
      <Pressable onPress={onPress} disabled={!onPress}>
        {({ pressed }) => (
          <View style={{ opacity: pressed ? 0.9 : 1 }}>
            <MosaicCard>
              <MosaicSectionHeader
                title="那年今日"
                icon={CalendarDays}
                actionIcon={MoreHorizontal}
                onAction={onMore}
                className="mb-4"
              />

              <View className="flex-row items-center">
                <View className="h-9 w-9 items-center justify-center rounded-full bg-primary-soft">
                  <Text className="text-sm font-medium text-primary">
                    {memory.author.name.slice(0, 1)}
                  </Text>
                </View>

                <View className="ml-3">
                  <Text className="text-sm font-medium text-foreground">
                    {memory.author.name}
                  </Text>

                  <Text className="mt-0.5 text-xs text-text-muted">
                    {memory.date}
                  </Text>
                </View>
              </View>

              <Text className="mt-4 text-[15px] leading-6 text-foreground">
                {memory.content}
              </Text>

              {memory.image && (
                <Image
                  source={{ uri: memory.image.uri }}
                  className="mt-4 h-52 w-full rounded-xl"
                  resizeMode="cover"
                />
              )}

              {(memory.likes !== undefined ||
                memory.comments !== undefined) && (
                <View className="mt-4 flex-row items-center">
                  {memory.likes !== undefined && (
                    <Text className="text-xs text-text-secondary">
                      ♡ {memory.likes}
                    </Text>
                  )}

                  {memory.comments !== undefined && (
                    <Text className="ml-4 text-xs text-text-secondary">
                      💬 {memory.comments}
                    </Text>
                  )}
                </View>
              )}
            </MosaicCard>
          </View>
        )}
      </Pressable>
    </MosaicSection>
  );
}
