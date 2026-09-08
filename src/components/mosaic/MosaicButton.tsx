import React from 'react';

import { Button } from '@/components/ui/button';

type BaseButtonProps = React.ComponentProps<typeof Button>;

export interface MosaicButtonProps extends Omit<BaseButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function MosaicButton({
  variant = 'primary',
  className,
  ...props
}: MosaicButtonProps) {
  const variantClassName = {
    primary: 'bg-primary',
    secondary: 'bg-surface-secondary',
    ghost: 'bg-transparent',
  }[variant];

  return (
    <Button
      {...props}
      className={['h-[52px] rounded-2xl px-5', variantClassName, className]
        .filter(Boolean)
        .join(' ')}
    />
  );
}
