import React from 'react';

import { Card } from '@/components/ui/card';

type BaseCardProps = React.ComponentProps<typeof Card>;

export interface MosaicCardProps extends Omit<BaseCardProps, 'variant'> {
  variant?: 'default' | 'muted';
  padded?: boolean;
}

export function MosaicCard({
  variant = 'default',
  padded = true,
  className,
  ...props
}: MosaicCardProps) {
  const variantClassName = {
    default: 'bg-card border-border',
    muted: 'bg-background-muted border-border-muted',
  }[variant];

  return (
    <Card
      {...props}
      className={[
        'rounded-2xl border shadow-sm',
        padded && 'p-5',
        variantClassName,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  );
}
