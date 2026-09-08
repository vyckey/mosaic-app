import { ChevronRight } from 'lucide-react-native';
import { ImageBackground, View } from 'react-native';

import { MosaicCard, MosaicPressable, MosaicText } from '@/components/mosaic';
import { Icon } from '@/components/ui/icon';
import { useI18n } from '@/i18n/useI18n';
import { radius } from '@/theme/radius';

import type { MemoryOfToday as MemoryOfTodayType } from '../types';

interface MemoryOfTodayProps {
  memory: MemoryOfTodayType;
  onPress?: () => void;
}

interface PhotoOverlayProps {
  label?: string;
  badge?: string;
  compact?: boolean;
}

function PhotoOverlay({ label, badge, compact }: PhotoOverlayProps) {
  return (
    <>
      {badge && (
        <View
          className={`absolute right-2 top-2 rounded-full bg-black/30 px-1.5 py-0.5 ${
            compact ? 'px-1' : ''
          }`}
        >
          <MosaicText
            tone="text"
            className={`text-white ${compact ? 'text-micro' : 'text-tiny'}`}
            numberOfLines={1}
          >
            {badge}
          </MosaicText>
        </View>
      )}

      {label && (
        <View
          className={`absolute bottom-0 left-0 right-0 bg-black/40 px-2 ${
            compact ? 'pb-1 pt-2' : 'pb-1.5 pt-4'
          }`}
        >
          <MosaicText
            tone="text"
            weight="500"
            className={`text-white ${compact ? 'text-micro' : 'text-xs'}`}
            numberOfLines={1}
          >
            {label}
          </MosaicText>
        </View>
      )}
    </>
  );
}

export function MemoryOfToday({ memory, onPress }: MemoryOfTodayProps) {
  const { t } = useI18n();

  const [first, second, third] = memory.photos;

  return (
    <MosaicPressable onPress={onPress} disabled={!onPress}>
      <MosaicCard tone="soft">
        <MosaicText variant="tiny" tone="text-muted" className="mb-3">
          {t('today.memoryOfToday')}
        </MosaicText>

        <View className="h-[178px] flex-row gap-1.5">
          {first && (
            <View className="flex-[1.35] overflow-hidden rounded-stat">
              <ImageBackground
                source={{ uri: first.uri }}
                className="h-full w-full"
                // Mirrors the parent's rounded-stat: the image's own clip stays
                // in step with the tile corner instead of a stale magic number
                imageStyle={{ borderRadius: radius.stat }}
                resizeMode="cover"
              >
                <PhotoOverlay label={first.label} badge={first.badge} />
              </ImageBackground>
            </View>
          )}

          <View className="flex-[0.825] gap-1.5">
            {second && (
              <View className="flex-1 overflow-hidden rounded-stat">
                <ImageBackground
                  source={{ uri: second.uri }}
                  className="h-full w-full"
                  imageStyle={{ borderRadius: radius.stat }}
                  resizeMode="cover"
                >
                  <PhotoOverlay
                    label={second.label}
                    badge={second.badge}
                    compact
                  />
                </ImageBackground>
              </View>
            )}
            {third && (
              <View className="flex-1 overflow-hidden rounded-stat">
                <ImageBackground
                  source={{ uri: third.uri }}
                  className="h-full w-full"
                  imageStyle={{ borderRadius: radius.stat }}
                  resizeMode="cover"
                >
                  <PhotoOverlay
                    label={third.label}
                    badge={third.badge}
                    compact
                  />
                </ImageBackground>
              </View>
            )}
          </View>
        </View>

        <MosaicText variant="body" tone="text" weight="500" className="mt-4 leading-6">
          "{memory.content}"
        </MosaicText>

        <View className="mt-3 flex-row items-center justify-between">
          <MosaicText variant="tiny" tone="text-muted">
            {memory.meta}
          </MosaicText>
          <MosaicText variant="tiny" tone="text-muted">
            {memory.date}
          </MosaicText>
        </View>

        {memory.previousYear && (
          <View className="mt-4 border-t border-border pt-3">
            <MosaicText variant="caption" tone="text-muted">
              {memory.previousYear.year} · {memory.previousYear.content}
            </MosaicText>
            <MosaicText variant="tiny" tone="text-muted" className="mt-1">
              {memory.previousYear.meta}
            </MosaicText>
          </View>
        )}

        <View className="mt-3 flex-row items-center justify-end">
          <MosaicText variant="tiny" tone="text-muted">
            {t('today.viewAll')}
          </MosaicText>
          <Icon as={ChevronRight} size="sm" className="text-text-subtle" />
        </View>
      </MosaicCard>
    </MosaicPressable>
  );
}
