import { View } from 'react-native';

import {
  MosaicImage,
  MosaicImagePreview,
  MosaicText,
  useMosaicImagePreview,
} from '@/components/mosaic';

import type { MosaicMomentRecord } from '../../types';

export interface MomentEntryBodyProps {
  record: MosaicMomentRecord;
}

/**
 * Body for moment records: body text + photo grid. The grid is a responsive
 * 3-column layout: cells are fixed 31.6% wide (plus a 2.5% column margin on
 * the first two columns, so 3 cells + 2 gaps ≈ the full line) — every cell
 * keeps one identical size, including a lone cell on the last row.
 */
export function MomentEntryBody({ record }: MomentEntryBodyProps) {
  const { content, media } = record;
  const preview = useMosaicImagePreview();

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
        // Row gap only — column spacing comes from each cell's right margin.
        <View className="mt-5 flex-row flex-wrap gap-y-2.5">
          {media.map((item, index) => (
            // Uniform 3-column cell: 31.6% + 2.5% right margin on columns 0/1
            // fills the line (3×31.6 + 2×2.5 = 99.8%), while every cell — a
            // lone 4th image included — stays the SAME size (no grow, so a
            // partial last row never stretches). Square via inline aspectRatio.
            <View
              key={item.id}
              style={{
                aspectRatio: 1,
                marginRight: index % 3 === 2 ? 0 : '2.5%',
              }}
              className="w-[31.6%]"
            >
              <MosaicImage
                source={{ uri: item.url }}
                onPress={() =>
                  preview.open(
                    media.map((m) => ({ uri: m.url })),
                    index,
                  )
                }
              />
            </View>
          ))}
        </View>
      ) : null}

      {/* Full-screen viewer for the grid above (swipe / pinch / double-tap) */}
      <MosaicImagePreview {...preview} />
    </>
  );
}
