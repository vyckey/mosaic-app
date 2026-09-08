import React from 'react';

import { Button } from '@/components/ui/button';

type BaseButtonProps = React.ComponentProps<typeof Button>;

export interface MosaicIconButtonProps extends Omit<
  BaseButtonProps,
  'variant' | 'size'
> {
  /** soft = 原型 .iconbtn（浅鼠尾草底圆角方块） */
  variant?: 'soft' | 'primary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const variantClassName: Record<
  NonNullable<MosaicIconButtonProps['variant']>,
  string
> = {
  soft: 'bg-primary-muted data-[active=true]:bg-primary-soft',
  primary: 'bg-primary data-[active=true]:bg-primary-strong',
  ghost: 'bg-transparent data-[active=true]:bg-primary-muted',
};

const sizeClassName: Record<NonNullable<MosaicIconButtonProps['size']>, string> =
  {
    sm: 'h-8 w-8 rounded-tile',
    md: 'h-9 w-9 rounded-tile',
    lg: 'h-11 w-11 rounded-stat',
  };

export function MosaicIconButton({
  variant = 'soft',
  size = 'md',
  className,
  ...props
}: MosaicIconButtonProps) {
  return (
    <Button
      {...props}
      variant="ghost"
      size="default"
      className={[
        'items-center justify-center rounded-tile p-0',
        sizeClassName[size],
        variantClassName[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  );
}
