import { ChevronRight, Sparkles } from 'lucide-react-native';
import { View } from 'react-native';

import {
  MosaicCard,
  MosaicIcon,
  MosaicPressable,
  MosaicText,
} from '@/components/mosaic';

export interface AiInsightCardProps {
  title: string;
  body: string;
  onPress?: () => void;
}

/** Tappable AI summary card at the bottom of the Emotions block. */
export function AiInsightCard({ title, body, onPress }: AiInsightCardProps) {
  return (
    <MosaicPressable onPress={onPress} accessibilityLabel={`${title}. ${body}`}>
      <MosaicCard tone="insight" className="gap-2">
        <View className="flex-row items-center gap-2">
          <MosaicIcon as={Sparkles} size="sm" tone="primary" />
          <MosaicText variant="caption" tone="text" weight="600">
            {title}
          </MosaicText>
          <View className="flex-1" />
          <MosaicIcon as={ChevronRight} size="sm" tone="text-muted" />
        </View>

        <MosaicText variant="caption" tone="text-muted">
          {body}
        </MosaicText>
      </MosaicCard>
    </MosaicPressable>
  );
}
