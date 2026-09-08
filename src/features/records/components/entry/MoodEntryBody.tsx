import { MosaicText } from '@/components/mosaic';

import type { MosaicMoodRecord } from '../../types';

export interface MoodEntryBodyProps {
  record: MosaicMoodRecord;
}

/**
 * Body for mood records: text only (header already carries the mood emoji).
 * Renders nothing when the mood has no words — the row is then just the
 * header, which matches how quick mood taps behave.
 */
export function MoodEntryBody({ record }: MoodEntryBodyProps) {
  const { content } = record;

  if (!content) return null;

  return (
    // Line-height via inline style: NativeWind resolves conflicting className
    // utilities by stylesheet order, so the variant's `text-body`/`leading-none`
    // can beat a `leading-*` class. Per NativeWind docs `style` always wins.
    <MosaicText variant="body" className="mt-4" style={{ lineHeight: 26 }}>
      {content}
    </MosaicText>
  );
}
