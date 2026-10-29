import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { View } from 'react-native';

import { MosaicIcon, MosaicIconButton, MosaicText } from '@/components/mosaic';

export interface PeriodNavigatorProps {
  label: string;
  onPrevious: () => void;
  onNext: () => void;
  previousAccessibilityLabel: string;
  nextAccessibilityLabel: string;
  nextDisabled?: boolean;
  className?: string;
}

/** `‹  Nov 3 – Nov 9, 2026  ›` row under the dimension switch. */
export function PeriodNavigator({
  label,
  onPrevious,
  onNext,
  previousAccessibilityLabel,
  nextAccessibilityLabel,
  nextDisabled = false,
  className,
}: PeriodNavigatorProps) {
  return (
    <View
      className={['flex-row items-center justify-between', className]
        .filter(Boolean)
        .join(' ')}
    >
      <MosaicIconButton
        variant="ghost"
        size="sm"
        onPress={onPrevious}
        accessibilityLabel={previousAccessibilityLabel}
      >
        <MosaicIcon as={ChevronLeft} size="sm" tone="text-muted" />
      </MosaicIconButton>

      <MosaicText variant="body" tone="text" weight="600" numberOfLines={1}>
        {label}
      </MosaicText>

      <MosaicIconButton
        variant="ghost"
        size="sm"
        disabled={nextDisabled}
        onPress={onNext}
        accessibilityLabel={nextAccessibilityLabel}
      >
        <MosaicIcon as={ChevronRight} size="sm" tone="text-muted" />
      </MosaicIconButton>
    </View>
  );
}
