import type { LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { Icon } from '@/components/ui/icon';

export interface MosaicIconBadgeProps {
  icon: LucideIcon;
  size?: 'sm' | 'md';
  className?: string;
}

export function MosaicIconBadge({
  icon,
  size = 'sm',
  className,
}: MosaicIconBadgeProps) {
  const sizeClassName = {
    sm: 'h-9 w-9 rounded-xl',
    md: 'h-10 w-10 rounded-xl',
  }[size];

  return (
    <View
      className={[
        'items-center justify-center bg-primary-soft',
        sizeClassName,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Icon as={icon} size="sm" className="text-primary" />
    </View>
  );
}
