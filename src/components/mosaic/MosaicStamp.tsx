import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';
import { View } from 'react-native';

/**
 * Tone the stamp is cut out of: the perforation holes are painted in this
 * color, so pass the tone of whatever surface sits behind the stamp.
 */
export type MosaicStampTone = 'background' | 'surface' | 'surface-muted';

const toneClassName: Record<MosaicStampTone, string> = {
  background: 'bg-background',
  surface: 'bg-surface',
  'surface-muted': 'bg-surface-muted',
};

type StampEdge = 'top' | 'bottom' | 'left' | 'right';

export interface MosaicStampProps {
  /** Content clipped into the stamp shape (e.g. a MosaicImage) */
  children?: ReactNode;
  /**
   * Perforation hole diameter d. Each edge reserves a straight run of d at
   * BOTH ends, so the pattern reads `_^_^_^_` and the corners stay square.
   */
  holeSize?: number;
  /** Semicircle notches per edge; default 5 */
  holesPerEdge?: number;
  /** Surface tone behind the stamp (holes are painted with it); default background */
  tone?: MosaicStampTone;
  /** Box of the stamp — size it here (flex / width+height / aspect ratio) */
  className?: string;
}

/** Edge rows leave d at both ends and center the holes on the border line */
const edgeStyle = (edge: StampEdge, d: number): ViewStyle => {
  switch (edge) {
    case 'top':
      return { left: d, right: d, top: -d / 2 };
    case 'bottom':
      return { left: d, right: d, bottom: -d / 2 };
    case 'left':
      return { top: d, bottom: d, left: -d / 2 };
    case 'right':
      return { top: d, bottom: d, right: -d / 2 };
  }
};

const edgeClassName: Record<StampEdge, string> = {
  top: 'absolute flex-row justify-between',
  bottom: 'absolute flex-row justify-between',
  left: 'absolute flex-col justify-between',
  right: 'absolute flex-col justify-between',
};

const edges: StampEdge[] = ['top', 'bottom', 'left', 'right'];

/**
 * MosaicStamp — clips its content into a postage-stamp shape.
 *
 * The content fills the box; holes of diameter `holeSize` are painted on the
 * four edges in the `tone` color and clipped by the box, so each hole bites a
 * semicircle out of the content edge (no outer paper frame). Sizing is owned
 * by the caller through `className` (e.g. flex-1, w-32 aspect-square).
 *
 * Usage:
 *   <MosaicStamp className="flex-1" tone="background">
 *     <MosaicImage source={{ uri }} radius={0} />
 *   </MosaicStamp>
 */
export function MosaicStamp({
  children,
  holeSize = 4,
  holesPerEdge = 5,
  tone = 'background',
  className,
}: MosaicStampProps) {
  return (
    <View
      className={['overflow-hidden', className].filter(Boolean).join(' ')}
    >
      {children}

      {edges.map((edge) => (
        <View
          key={edge}
          className={edgeClassName[edge]}
          style={edgeStyle(edge, holeSize)}
          pointerEvents="none"
        >
          {Array.from({ length: holesPerEdge }, (_, index) => (
            <View
              key={index}
              className={`rounded-full ${toneClassName[tone]}`}
              style={{ width: holeSize, height: holeSize }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}
