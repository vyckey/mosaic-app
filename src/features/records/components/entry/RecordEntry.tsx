import { Image } from 'expo-image';
import { MapPin, User } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { memo } from 'react';
import { View } from 'react-native';

import { MosaicIcon, MosaicPressable, MosaicText } from '@/components/mosaic';
import { Avatar } from '@/components/ui/avatar';
import { Icon } from '@/components/ui/icon';

import type { MosaicRecord } from '../../types';
import { RecordEntryBody } from './RecordEntryBody';

export interface RecordEntryProps {
  record: MosaicRecord;
  /**
   * Apply the 18px page gutters on the entry itself instead of the list
   * container — keeps dividers full-bleed (they touch the screen edges).
   */
  padded?: boolean;
  /** Row press handler; the list wires navigation here */
  onPress?: () => void;
  /**
   * Body override slot. Defaults to `<RecordEntryBody>`, which dispatches on
   * `record.type`; embedders can swap in a compact/custom body.
   */
  children?: ReactNode;
}

/**
 * Shared skeleton for one record row (Moments style): avatar + username /
 * timestamp · category + emoji → [body slot] → tags → location.
 *
 * Everything type-specific lives in the body slot (MoodEntryBody,
 * MomentEntryBody, …); this component only renders what all types share.
 *
 * Memoized so FlashList row recycling only re-renders rows whose data changed.
 */
export const RecordEntry = memo(function RecordEntry({
  record,
  padded = false,
  onPress,
  children,
}: RecordEntryProps) {
  const { time, emoji, author, tags, location, typeLabel } = record;

  return (
    <MosaicPressable
      onPress={
        onPress ??
        (() => {
          // TODO: open record detail
          console.log('record entry:', record.id);
        })
      }
      className={['min-w-0 overflow-hidden', padded && 'px-[18px]']
        .filter(Boolean)
        .join(' ')}
    >
      {/* Header: avatar + author name, timestamp · category + emoji below */}
      <View className="flex-row items-center gap-3">
        <Avatar className="h-12 w-12 shrink-0 bg-primary-muted">
          {author?.avatarUri ? (
            <Image
              source={{ uri: author.avatarUri }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
            />
          ) : (
            <Icon as={User} size="lg" className="h-7 w-7 text-text-muted" />
          )}
        </Avatar>

        <View className="min-w-0 flex-1">
          <MosaicText variant="body" weight="600" truncated>
            {author?.name ?? typeLabel}
          </MosaicText>
          <View className="mt-0.5 flex-row items-center">
            <MosaicText variant="tiny" tone="text-muted">
              {time}
              {author ? ` · ${typeLabel}` : ''}
            </MosaicText>
            {emoji ? (
              <MosaicText
                style={{ fontSize: 16, lineHeight: 20 }}
                className="ml-1.5"
              >
                {emoji}
              </MosaicText>
            ) : null}
          </View>
        </View>
      </View>

      {/* Type-specific body; default dispatches on record.type */}
      {children ?? <RecordEntryBody record={record} />}

      {tags?.length ? (
        <View className="mt-4 flex-row flex-wrap items-center gap-2">
          {tags.map((tag) => (
            <MosaicText
              key={tag}
              variant="caption"
              tone="primary"
              weight="500"
            >
              #{tag}
            </MosaicText>
          ))}
        </View>
      ) : null}

      {location ? (
        <View className="mt-4 flex-row items-center">
          <MosaicIcon as={MapPin} size="sm" tone="primary" />
          <MosaicText variant="tiny" tone="text" className="ml-1.5">
            {location.address ?? location.name}
          </MosaicText>
        </View>
      ) : null}
    </MosaicPressable>
  );
});
