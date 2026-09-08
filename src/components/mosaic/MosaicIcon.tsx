import type { LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { Icon } from '@/components/ui/icon';

export type MosaicIconSize = 'xs' | 'sm' | 'md' | 'lg';

export type MosaicIconTone =
  | 'text'
  | 'text-muted'
  | 'primary'
  | 'primary-strong'
  | 'primary-foreground'
  | 'danger'
  | 'success'
  | 'success-foreground'
  | 'warning';

export interface MosaicIconProps {
  as: LucideIcon;
  size?: MosaicIconSize;
  tone?: MosaicIconTone;
  badge?: boolean;
  className?: string;
}

const toneClassName: Record<MosaicIconTone, string> = {
  text: 'text-text',
  'text-muted': 'text-text-muted',
  primary: 'text-primary',
  'primary-strong': 'text-primary-strong',
  'primary-foreground': 'text-primary-foreground',
  danger: 'text-danger',
  success: 'text-success',
  'success-foreground': 'text-success-foreground',
  warning: 'text-warning',
};

const badgeSizeClassName: Record<MosaicIconSize, string> = {
  xs: 'h-6 w-6',
  sm: 'h-8 w-8',
  md: 'h-9 w-9',
  lg: 'h-10 w-10',
};

export function MosaicIcon({
  as,
  size = 'md',
  tone = 'text',
  badge = false,
  className,
}: MosaicIconProps) {
  const iconElement = (
    <Icon
      as={as}
      size={size === 'xs' ? '2xs' : size}
      className={[toneClassName[tone], className].filter(Boolean).join(' ')}
    />
  );

  if (badge) {
    return (
      <View
        className={[
          'items-center justify-center rounded-full bg-primary-muted',
          badgeSizeClassName[size],
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {iconElement}
      </View>
    );
  }

  return iconElement;
}
