import { MapPin, User } from 'lucide-react-native';
import { View } from 'react-native';

import {
  MosaicImage,
  MosaicImagePreview,
  MosaicText,
  useMosaicImagePreview,
} from '@/components/mosaic';
import { Avatar } from '@/components/ui/avatar';
import { Icon } from '@/components/ui/icon';

import { formatIsoDateTime } from './format';
import {
  mockMomentMediaUris,
  mockMomentRecord,
  mockMomentUser,
} from './mock';
import type { MomentRecord } from './types';
import type { MomentUser } from './mock';

export interface MomentRecordDetailProps {
  /** Moment to render; falls back to mock (route params / API later) */
  record?: MomentRecord;
  /** media_id → renderable url */
  mediaUris?: Record<number, string>;
  /** post author */
  user?: MomentUser;
}

/** Detail page upper section: a single Moment (author, tags, body, photos, location) */
export function MomentRecordDetail({
  record = mockMomentRecord,
  mediaUris = mockMomentMediaUris,
  user = mockMomentUser,
}: MomentRecordDetailProps) {
  const { content, location, tags, recorded_at } = record;
  const photos = content.media_ids
    .map((id) => mediaUris[id])
    .filter((url): url is string => Boolean(url));
  const preview = useMosaicImagePreview();
  // Fullest available place label: address first, then reverse-geo levels
  const locationLabel =
    location?.address ??
    [location?.district, location?.city, location?.admin_area]
      .filter(Boolean)
      .join(' ');

  return (
    <View>
      <View className="mt-3 flex-row items-center gap-3">
        <Avatar className="h-12 w-12 shrink-0 bg-primary-muted">
          {user.avatarUri ? (
            <MosaicImage source={{ uri: user.avatarUri }} />
          ) : (
            <Icon as={User} size="lg" className="h-7 w-7 text-text-muted" />
          )}
        </Avatar>

        <View className="min-w-0 flex-1">
          <MosaicText variant="body" weight="600" truncated>
            {user.name}
          </MosaicText>
          <View className="mt-0.5 flex-row items-center">
            <MosaicText variant="tiny" tone="text-muted">
              {formatIsoDateTime(recorded_at)}
            </MosaicText>
            {content.emoji !== '' && (
              <MosaicText
                style={{ fontSize: 16, lineHeight: 20 }}
                className="ml-1.5"
              >
                {content.emoji}
              </MosaicText>
            )}
          </View>
        </View>
      </View>

      {tags.length > 0 && (
        <View className="mt-4 flex-row flex-wrap items-center gap-2">
          {tags.map((tag) => (
            <MosaicText key={tag.id} variant="caption" tone="primary" weight="500">
              #{tag.name}
            </MosaicText>
          ))}
        </View>
      )}

      {content.text !== '' && (
        // Line-height via inline style: NativeWind resolves conflicting className
        // utilities by stylesheet order, so the variant's `text-body`/`leading-none`
        // can beat a `leading-*` class. Per NativeWind docs `style` always wins.
        <MosaicText variant="body" className="mt-4" style={{ lineHeight: 26 }}>
          {content.text}
        </MosaicText>
      )}

      {photos.length > 0 && (
        <View className="mt-5 flex-row flex-wrap gap-y-2.5">
          {photos.map((url, index) => (
            // Same uniform 3-column cell as the feed grid (see MomentEntryBody).
            <View
              key={url}
              style={{
                aspectRatio: 1,
                marginRight: index % 3 === 2 ? 0 : '2.5%',
              }}
              className="w-[31.6%]"
            >
              <MosaicImage
                source={{ uri: url }}
                onPress={() =>
                  preview.open(
                    photos.map((uri) => ({ uri })),
                    index,
                  )
                }
              />
            </View>
          ))}
        </View>
      )}

      {/* Full-screen viewer for the photos above (swipe / pinch / double-tap) */}
      <MosaicImagePreview {...preview} />

      {location && locationLabel ? (
        <View className="mt-4 flex-row items-center">
          <Icon as={MapPin} size="sm" className="text-primary" />
          <MosaicText variant="tiny" tone="text" className="ml-1.5">
            {locationLabel}
          </MosaicText>
        </View>
      ) : null}
    </View>
  );
}
