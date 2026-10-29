import type { LucideIcon } from 'lucide-react-native';
import { AlertTriangle } from 'lucide-react-native';
import { View } from 'react-native';

import { MosaicText } from '@/components/mosaic';
import { Icon } from '@/components/ui/icon';

export interface SettingsNoteProps {
  title?: string;
  message: string;
  icon?: LucideIcon;
  tone?: 'neutral' | 'warning' | 'danger';
}

const toneClassName = {
  neutral: 'bg-surface-muted text-text-muted',
  warning: 'bg-warning-muted text-warning-muted-foreground',
  danger: 'bg-danger-muted text-danger-muted-foreground',
} as const;

/** Inline explanatory / warning block used above destructive actions. */
export function SettingsNote({
  title,
  message,
  icon = AlertTriangle,
  tone = 'neutral',
}: SettingsNoteProps) {
  return (
    <View
      className={[
        'w-full flex-row gap-3 rounded-stat p-4',
        toneClassName[tone].split(' ')[0],
      ].join(' ')}
    >
      <Icon
        as={icon}
        size="sm"
        className={['mt-0.5 shrink-0', toneClassName[tone].split(' ')[1]].join(
          ' ',
        )}
      />
      <View className="min-w-0 flex-1 gap-1">
        {title && (
          <MosaicText variant="body" weight="600">
            {title}
          </MosaicText>
        )}
        <MosaicText variant="tiny" tone="text-muted">
          {message}
        </MosaicText>
      </View>
    </View>
  );
}
