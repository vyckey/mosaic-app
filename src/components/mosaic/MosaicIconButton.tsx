import React from 'react';

import { Button } from '@/components/ui/button';

import { glassRimStyle, glassSurfaceClassName, MosaicGlass } from './MosaicGlass';

type BaseButtonProps = React.ComponentProps<typeof Button>;

export interface MosaicIconButtonProps extends Omit<
  BaseButtonProps,
  'variant' | 'size' | 'children'
> {
  children?: React.ReactNode;
  /**
   * soft = prototype .iconbtn (light sage fill, drawn as a circle);
   * glass = circular liquid-glass surface (transparent, for screen headers).
   */
  variant?: 'soft' | 'primary' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

type SolidVariant = Exclude<
  NonNullable<MosaicIconButtonProps['variant']>,
  'glass'
>;

const variantClassName: Record<SolidVariant, string> = {
  soft: 'bg-primary-muted data-[active=true]:bg-primary-soft',
  primary: 'bg-primary data-[active=true]:bg-primary-strong',
  ghost: 'bg-transparent data-[active=true]:bg-primary-muted',
};

/**
 * Sizes carry no radius: every icon button is a circle (rounded-full sits on
 * each branch) — the "controls = capsule" rule of the unified radius system.
 * lg matches the shared 50dp control height (lg MosaicButton / pill inputs);
 * xl is the floating create button (64 = tab bar height).
 */
const sizeClassName: Record<NonNullable<MosaicIconButtonProps['size']>, string> =
  {
    sm: 'h-8 w-8',
    md: 'h-9 w-9',
    lg: 'h-[50px] w-[50px]',
    xl: 'h-16 w-16',
  };

export function MosaicIconButton({
  variant = 'soft',
  size = 'md',
  className,
  children,
  ...props
}: MosaicIconButtonProps) {
  // Liquid-glass variant: a circular glass layer paints behind the icon.
  if (variant === 'glass') {
    return (
      <Button
        {...props}
        variant="ghost"
        size="default"
        className={[
          'items-center justify-center overflow-hidden rounded-full bg-transparent p-0',
          sizeClassName[size],
          'data-[active=true]:bg-primary-muted',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <MosaicGlass className={glassSurfaceClassName} style={glassRimStyle} />
        {children}
      </Button>
    );
  }

  return (
    <Button
      {...props}
      variant="ghost"
      size="default"
      className={[
        'items-center justify-center rounded-full p-0',
        sizeClassName[size],
        variantClassName[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Button>
  );
}
