import { Image } from 'expo-image';
import { Clock, MapPin, User } from 'lucide-react-native';
import { View } from 'react-native';

import { MosaicText } from '@/components/mosaic';
import { Avatar } from '@/components/ui/avatar';
import { Icon } from '@/components/ui/icon';
import { useI18n } from '@/i18n/useI18n';

import { formatIsoDateTime } from './format';
import {
  mockMomentMediaUris,
  mockMomentRecord,
  mockMomentUser,
} from './mock';
import type { MomentRecord } from './types';
import type { MomentUser } from './mock';

export interface MomentDetailViewProps {
  /** 待展示的 Moment；未传时使用 mock（后续由路由参数/接口注入） */
  record?: MomentRecord;
  /** media_id → 可渲染地址 */
  mediaUris?: Record<number, string>;
  /** 作者信息 */
  user?: MomentUser;
}

/** 展示页上半部分：单条 Moment 内容（作者、标签、正文、照片、位置） */
export function MomentDetailView({
  record = mockMomentRecord,
  mediaUris = mockMomentMediaUris,
  user = mockMomentUser,
}: MomentDetailViewProps) {
  const { t } = useI18n();

  const { content, location, tags, recorded_at } = record;
  const photos = content.media_ids
    .map((id) => mediaUris[id])
    .filter((url): url is string => Boolean(url));

  return (
    <View>
      <View className="mt-3 flex-row items-center gap-3">
        <Avatar className="h-12 w-12 bg-primary-muted">
          {user.avatarUri ? (
            <Image
              source={{ uri: user.avatarUri }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
            />
          ) : (
            <Icon as={User} size="lg" className="h-7 w-7 text-text-muted" />
          )}
        </Avatar>

        <View className="flex-1">
          <MosaicText variant="body" weight="600" truncated>
            {user.name}
          </MosaicText>
          <View className="mt-0.5 flex-row items-center">
            <Icon as={Clock} size="2xs" className="text-text-muted" />
            <MosaicText variant="tiny" tone="text-muted" className="ml-1">
              {formatIsoDateTime(recorded_at)}
            </MosaicText>
          </View>
        </View>

        {content.emoji !== '' && (
          <MosaicText style={{ fontSize: 24, lineHeight: 30 }}>
            {content.emoji}
          </MosaicText>
        )}
      </View>

      {tags.length > 0 && (
        <View className="mt-3 flex-row flex-wrap items-center gap-2">
          {tags.map((tag) => (
            <MosaicText key={tag.id} variant="caption" tone="primary" weight="500">
              #{tag.name}
            </MosaicText>
          ))}
        </View>
      )}

      {content.text !== '' && (
        <MosaicText variant="body" className="mt-3">
          {content.text}
        </MosaicText>
      )}

      {photos.length > 0 && (
        <View className="mt-4 flex-row flex-wrap gap-2.5">
          {photos.map((url) => (
            <View
              key={url}
              className="h-32 w-32 overflow-hidden rounded-tile bg-surface"
            >
              <Image
                source={{ uri: url }}
                style={{ width: '100%', height: '100%' }}
                contentFit="cover"
              />
            </View>
          ))}
        </View>
      )}

      {location && (
        <View className="mt-4 flex-row items-center">
          <Icon as={MapPin} size="sm" className="text-primary" />
          <MosaicText variant="tiny" tone="text" className="ml-1.5">
            {location.address ?? t('moment.addLocation')}
          </MosaicText>
        </View>
      )}
    </View>
  );
}
