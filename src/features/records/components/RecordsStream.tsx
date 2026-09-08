import { MapPin } from 'lucide-react-native';
import { Image, View } from 'react-native';

import { MosaicIcon, MosaicPressable, MosaicText } from '@/components/mosaic';

import type { RecordsFragment } from '../types';

interface RecordsStreamProps {
  fragments: RecordsFragment[];
}

export function RecordsStream({ fragments }: RecordsStreamProps) {
  return (
    <View>
      {fragments.map((fragment, index) => {
        const isLast = index === fragments.length - 1;

        return (
          <MosaicPressable
            key={fragment.id}
            onPress={() => {
              // TODO: 打开碎片详情
              console.log('stream fragment:', fragment.id);
            }}
            className="flex-row items-start gap-3"
          >
            <MosaicText
              variant="tiny"
              tone="text-muted"
              className="w-11 shrink-0 leading-4 will-change-variable"
            >
              {fragment.time}
            </MosaicText>

            <View className="w-2 shrink-0 items-center self-stretch pt-1">
              <View className="h-2 w-2 rounded-full bg-primary" />
              {!isLast && <View className="w-px flex-1 bg-border" />}
            </View>

            <View
              className={[
                'min-w-0 flex-1 overflow-hidden',
                !isLast && 'pb-4',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <View className="flex-row items-start gap-1.5">
                {fragment.emoji ? (
                  <MosaicText variant="body" className="leading-5">
                    {fragment.emoji}
                  </MosaicText>
                ) : null}
                <MosaicText
                  variant="body"
                  weight="600"
                  className="flex-1 leading-5 will-change-variable"
                >
                  {fragment.content}
                </MosaicText>
              </View>
              {fragment.media?.length ? (
                <View className="mt-2 flex-row flex-wrap gap-1.5">
                  {fragment.media.map((media) => (
                    <Image
                      key={media.id}
                      source={{ uri: media.url }}
                      resizeMode="cover"
                      className="h-24 w-24 rounded-tile bg-surface"
                    />
                  ))}
                </View>
              ) : null}
              {fragment.tags?.length ? (
                <View className="mt-1.5 flex-row flex-wrap gap-1.5">
                  {fragment.tags.map((tag) => (
                    <View
                      key={tag}
                      className="rounded-full bg-background-muted px-2 py-0.5"
                    >
                      <MosaicText
                        variant="tiny"
                        tone="text-muted"
                        className="leading-4"
                      >
                        {tag}
                      </MosaicText>
                    </View>
                  ))}
                </View>
              ) : null}
              {fragment.location ? (
                <View className="mt-1.5 flex-row items-center gap-1">
                  <MosaicIcon as={MapPin} size="xs" tone="text-muted" />
                  <MosaicText
                    variant="tiny"
                    tone="text-muted"
                    className="flex-1 leading-4"
                    truncated
                  >
                    {fragment.location.name}
                  </MosaicText>
                </View>
              ) : null}
              <MosaicText
                variant="tiny"
                tone="text-muted"
                className="mt-0.5 leading-4 will-change-variable"
              >
                {fragment.type}
              </MosaicText>
            </View>
          </MosaicPressable>
        );
      })}
    </View>
  );
}
