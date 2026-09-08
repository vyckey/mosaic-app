import { Image } from 'expo-image';
import { View } from 'react-native';

import { MosaicText } from '@/components/mosaic';

import type { MosaicMomentRecord } from '../../types';

export interface MomentEntryBodyProps {
  record: MosaicMomentRecord;
}

/**
 * Body for moment records: body text + photo grid. The grid uses fixed
 * 128×128 tiles that wrap, so 1/4/5/6/9 photos exercise every row shape.
 */
export function MomentEntryBody({ record }: MomentEntryBodyProps) {
  const { content, media } = record;

  return (
    <>
      {content !== '' && (
        // Line-height via inline style: NativeWind resolves conflicting className
        // utilities by stylesheet order, so the variant's `text-body`/`leading-none`
        // can beat a `leading-*` class. Per NativeWind docs `style` always wins.
        <MosaicText variant="body" className="mt-4" style={{ lineHeight: 26 }}>
          {content}
        </MosaicText>
      )}

      {media?.length ? (
        <View className="mt-5 flex-row flex-wrap gap-2.5">
          {media.map((item) => (
            <View
              key={item.id}
              className="h-32 w-32 overflow-hidden rounded-stat bg-surface"
            >
              <Image
                source={{ uri: item.url }}
                style={{ width: '100%', height: '100%' }}
                contentFit="cover"
              />
            </View>
          ))}
        </View>
      ) : null}
    </>
  );
}
