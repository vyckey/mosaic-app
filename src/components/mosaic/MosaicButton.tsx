import React from 'react';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

type BaseButtonProps = React.ComponentProps<typeof Button>;

export interface MosaicButtonProps
  extends Omit<BaseButtonProps, 'variant' | 'size'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * 对应原型 .btn / .btn.ghost / .btn.small。
 * primary 为鼠尾草绿实心；children 为纯字符串时自动套用正确的字号与前景色。
 */
const baseVariant: Record<
  NonNullable<MosaicButtonProps['variant']>,
  React.ComponentProps<typeof Button>['variant']
> = {
  primary: 'default',
  secondary: 'secondary',
  ghost: 'ghost',
  destructive: 'destructive',
};

const variantClassName: Record<NonNullable<MosaicButtonProps['variant']>, string> =
  {
    primary: 'data-[active=true]:bg-primary-strong',
    secondary: 'bg-secondary data-[active=true]:bg-surface-muted',
    ghost: 'bg-transparent data-[active=true]:bg-primary-muted',
    destructive: 'data-[active=true]:bg-danger-muted-foreground',
  };

const sizeClassName: Record<NonNullable<MosaicButtonProps['size']>, string> = {
  sm: 'h-8 rounded-btn px-3',
  md: 'h-11 rounded-btn px-4',
  lg: 'h-[50px] rounded-btn px-5',
};

const sizeTextClassName: Record<NonNullable<MosaicButtonProps['size']>, string> =
  {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-sm',
  };

export function MosaicButton({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: MosaicButtonProps) {
  const isPlainLabel = typeof children === 'string';

  return (
    <Button
      {...props}
      variant={baseVariant[variant]}
      size="default"
      className={[
        'justify-center rounded-btn',
        sizeClassName[size],
        variantClassName[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {isPlainLabel ? (
        <Text
          className={[
            'font-semibold',
            sizeTextClassName[size],
            variant === 'primary' || variant === 'destructive'
              ? 'text-primary-foreground'
              : 'text-text',
          ].join(' ')}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Button>
  );
}
