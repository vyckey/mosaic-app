import React from 'react';

import { Button } from '@/components/ui/button';

type BaseButtonProps = React.ComponentProps<typeof Button>;

export interface MosaicIconButtonProps extends Omit<
  BaseButtonProps,
  'variant' | 'size'
> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function MosaicIconButton({
  variant = 'ghost',
  size = 'md',
  className,
  ...props
}: MosaicIconButtonProps) {
  const variantClassName = {
    primary: 'bg-primary',
    secondary: 'bg-surface-secondary',
    ghost: 'bg-transparent',
  }[variant];

  const sizeClassName = {
    sm: 'h-9 w-9 rounded-xl',
    md: 'h-11 w-11 rounded-xl',
    lg: 'h-12 w-12 rounded-2xl',
  }[size];

  return (
    <Button
      {...props}
      className={[
        'items-center justify-center p-0',
        sizeClassName,
        variantClassName,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  );
}
