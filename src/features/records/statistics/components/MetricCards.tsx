import type { LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { MosaicIcon, MosaicText } from '@/components/mosaic';

export interface MetricCardItem {
  key: string;
  icon: LucideIcon;
  value: string;
  label: string;
  /** Optional comparison caption under the label, e.g. `↑ 18%`. */
  change?: string;
  changeTone?: 'success' | 'danger' | 'text-muted';
}

export interface MetricCardsProps {
  items: readonly MetricCardItem[];
  className?: string;
}

/** Equal-width metric cards shown under the period navigator. */
export function MetricCards({ items, className }: MetricCardsProps) {
  return (
    <View className={['flex-row gap-2', className].filter(Boolean).join(' ')}>
      {items.map((item) => (
        <View
          key={item.key}
          className="flex-1 items-center rounded-stat bg-surface-muted px-1.5 py-3"
        >
          <MosaicIcon as={item.icon} size="sm" tone="primary" />

          <MosaicText
            variant="title"
            tone="text"
            weight="600"
            className="mt-1.5"
            numberOfLines={1}
          >
            {item.value}
          </MosaicText>

          <MosaicText
            variant="tiny"
            tone="text-muted"
            className="mt-1 text-center"
            numberOfLines={2}
          >
            {item.label}
          </MosaicText>

          {item.change && (
            <MosaicText
              variant="tiny"
              tone={item.changeTone ?? 'text-muted'}
              weight="600"
              className="mt-0.5"
              numberOfLines={1}
            >
              {item.change}
            </MosaicText>
          )}
        </View>
      ))}
    </View>
  );
}
