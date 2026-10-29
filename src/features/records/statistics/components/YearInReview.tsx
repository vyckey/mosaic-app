import { Star } from 'lucide-react-native';
import { View } from 'react-native';

import {
  MosaicCard,
  MosaicIcon,
  MosaicImage,
  MosaicText,
} from '@/components/mosaic';

export interface YearInReviewProps {
  title: string;
  summary: string;
  records: string;
  recordsLabel: string;
  /** Formatted change caption, e.g. `↑ 12%`. */
  change?: string;
  changeTone?: 'success' | 'danger' | 'text-muted';
  /** Comparison caption, e.g. `vs 2024`. */
  compareLabel?: string;
  photos: readonly string[];
}

/** Year-only cover card: three memories plus the year's record total. */
export function YearInReview({
  title,
  summary,
  records,
  recordsLabel,
  change,
  changeTone = 'success',
  compareLabel,
  photos,
}: YearInReviewProps) {
  return (
    <MosaicCard>
      <View className="flex-row items-center gap-2">
        <MosaicIcon as={Star} size="sm" tone="primary" />
        <MosaicText variant="title" tone="text" weight="600">
          {title}
        </MosaicText>
      </View>

      <MosaicText variant="tiny" tone="text-muted" className="mt-1">
        {summary}
      </MosaicText>

      <View className="mt-3 flex-row gap-2">
        {photos.slice(0, 3).map((uri, index) => (
          <View key={`${uri}-${index}`} className="flex-1">
            <MosaicImage source={{ uri }} aspectRatio={1} radius="tile" />
          </View>
        ))}

        <View
          className="flex-1 items-center justify-center rounded-stat bg-primary-muted px-1"
          style={{ aspectRatio: 1 }}
        >
          <MosaicText
            variant="title"
            tone="text"
            weight="700"
            numberOfLines={1}
          >
            {records}
          </MosaicText>
          <MosaicText
            variant="tiny"
            tone="text-muted"
            className="mt-0.5 text-center"
            numberOfLines={1}
          >
            {recordsLabel}
          </MosaicText>

          {change && (
            <MosaicText
              variant="tiny"
              tone={changeTone}
              weight="600"
              className="mt-1"
            >
              {change}
            </MosaicText>
          )}
          {compareLabel && (
            <MosaicText variant="tiny" tone="text-muted">
              {compareLabel}
            </MosaicText>
          )}
        </View>
      </View>
    </MosaicCard>
  );
}
