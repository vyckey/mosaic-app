import { MapPin, Users } from 'lucide-react-native';
import { View } from 'react-native';

import {
    MosaicIcon,
    MosaicImage,
    MosaicPressable,
    MosaicText,
} from '@/components/mosaic';
import { useI18n } from '@/i18n/useI18n';

import { getLifeEventCategory } from '../categories';
import { formatLifeEventDayLabel } from '../format';
import type { LifeEvent } from '../types';

export interface LifeEventItemProps {
  event: LifeEvent;
  /** Hide the connector line under the node (last event of a year group) */
  isLast?: boolean;
  onPress: () => void;
  onPhotoPress: (photos: string[], index: number) => void;
}

/** Thumbnail edge reserved on the right of the content column */
const THUMB_SIZE = 44;

/**
 * One timeline node: a category circle on a thin vertical rail + text-first
 * content (date hint → title → description → category / place / people), with
 * an optional 44px photo thumbnail pinned to the bottom-right.
 */
export function LifeEventItem({
  event,
  isLast = false,
  onPress,
  onPhotoPress,
}: LifeEventItemProps) {
  const { t } = useI18n();
  const category = getLifeEventCategory(event.category);
  const dayLabel = formatLifeEventDayLabel(event.date, t);
  const photos = event.photos ?? [];

  const metaItems = [
    {
      key: 'category',
      icon: category.icon,
      label: t(category.labelKey),
    },
    event.location
      ? { key: 'location', icon: MapPin, label: event.location }
      : null,
    event.people?.length
      ? {
          key: 'people',
          icon: Users,
          label: event.people.join(', '),
        }
      : null,
  ].filter(Boolean) as {
    key: string;
    icon: typeof category.icon;
    label: string;
  }[];

  return (
    <MosaicPressable
      onPress={onPress}
      accessibilityLabel={event.title}
      className="flex-row gap-3"
    >
      {/* Timeline rail: node + connector */}
      <View className="w-7 items-center">
        <View className="h-[30px] w-[30px] items-center justify-center rounded-full bg-primary-muted">
          <MosaicIcon as={category.icon} size="sm" tone="primary-strong" />
        </View>
        {!isLast && <View className="mt-1 w-px flex-1 bg-border" />}
      </View>

      {/* Content */}
      <View
        className={['min-w-0 flex-1', !isLast && 'pb-7']
          .filter(Boolean)
          .join(' ')}
      >
        <View className="flex-row items-end gap-3">
          <View className="min-w-0 flex-1">
            {(dayLabel || event.importance) && (
              <View className="flex-row flex-wrap items-center gap-1.5">
                {dayLabel ? (
                  <MosaicText variant="tiny" tone="primary" weight="500">
                    {dayLabel}
                  </MosaicText>
                ) : null}
                {dayLabel && event.importance ? (
                  <MosaicText variant="tiny" tone="text-subtle">
                    ·
                  </MosaicText>
                ) : null}
                {event.importance ? (
                  <MosaicText variant="tiny" tone="text-muted">
                    {t(`lifeEvents.importance.${event.importance}`)}
                  </MosaicText>
                ) : null}
              </View>
            )}

            <MosaicText variant="subtitle" weight="600" className="mt-1">
              {event.title}
            </MosaicText>

            {event.description ? (
              <MosaicText
                variant="caption"
                tone="text-muted"
                numberOfLines={2}
                className="mt-1"
              >
                {event.description}
              </MosaicText>
            ) : null}

            {metaItems.length > 0 && (
              <View className="mt-2 flex-row flex-wrap items-center gap-x-3 gap-y-1">
                {metaItems.map((item) => (
                  <View key={item.key} className="flex-row items-center gap-1">
                    <MosaicIcon as={item.icon} size="xs" tone="text-muted" />
                    <MosaicText
                      variant="tiny"
                      tone="text-muted"
                      numberOfLines={1}
                    >
                      {item.label}
                    </MosaicText>
                  </View>
                ))}
              </View>
            )}
          </View>

          {photos.length > 0 ? (
            <View
              className="relative shrink-0"
              style={{ width: THUMB_SIZE, height: THUMB_SIZE }}
            >
              <MosaicImage
                source={{ uri: photos[0] }}
                width={THUMB_SIZE}
                height={THUMB_SIZE}
                radius="tile"
                onPress={() => onPhotoPress(photos, 0)}
              />
              {photos.length > 1 ? (
                <View className="absolute -right-1 -bottom-1 rounded-full bg-text px-1">
                  <MosaicText
                    tone="primary-foreground"
                    style={{ fontSize: 10, lineHeight: 14 }}
                  >
                    +{photos.length - 1}
                  </MosaicText>
                </View>
              ) : null}
            </View>
          ) : null}
        </View>
      </View>
    </MosaicPressable>
  );
}
