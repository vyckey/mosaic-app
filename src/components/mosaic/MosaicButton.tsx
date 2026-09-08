import React from 'react';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

import { glassRimStyle, glassSurfaceClassName, MosaicGlass } from './MosaicGlass';

type BaseButtonProps = React.ComponentProps<typeof Button>;

export interface MosaicButtonProps
  extends Omit<BaseButtonProps, 'variant' | 'size' | 'children'> {
  /**
   * Plain-string children automatically get the variant's font size and
   * foreground color. Composite children (icons, fragments, components) are
   * rendered as-is and must style their own text — they are deliberately not
   * wrapped recursively, since icons/nodes may not belong inside a Text.
   *
   * Icon-only buttons (no children) should pass `accessibilityLabel` so screen
   * readers can announce the action.
   */
  children?: React.ReactNode;
  /**
   * glass = liquid-glass pill (transparent; for screen-header actions).
   * The other variants map onto the matching gluestack button styles.
   */
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'glass';
  /**
   * Label tone for the glass variant: `primary` paints the label in the sage
   * accent so a glass CTA keeps the emphasis without a solid fill.
   * Ignored by the solid variants (their label colors are fixed by the variant).
   */
  tone?: 'default' | 'primary';
  /**
   * MosaicButton is the single owner of button dimensions: the base Button is
   * always rendered with size="default" and these classes win conflicts (see
   * sizeClassName).
   */
  size?: 'sm' | 'md' | 'lg';
}

type NonGlassVariant = Exclude<
  NonNullable<MosaicButtonProps['variant']>,
  'glass'
>;

interface VariantConfig {
  /** gluestack Button variant: supplies the default background + disabled look */
  base: React.ComponentProps<typeof Button>['variant'];
  /**
   * Mosaic classes appended after the base tva classes. The whole string is
   * resolved by tailwind-merge inside tva (base → variants → className), so
   * conflicting utilities are last-wins: these reliably override gluestack.
   */
  className: string;
  /** Foreground applied to plain-string labels */
  textClassName: string;
}

/**
 * Single source of truth for the non-glass variants: adding e.g. `outline`
 * later only means adding one entry here — no new conditionals in the render.
 */
const variantConfig: Record<NonGlassVariant, VariantConfig> = {
  primary: {
    base: 'default',
    className: 'data-[active=true]:bg-primary-strong',
    textClassName: 'text-primary-foreground',
  },
  secondary: {
    base: 'secondary',
    className: 'bg-secondary data-[active=true]:bg-surface-muted',
    textClassName: 'text-secondary-foreground',
  },
  ghost: {
    base: 'ghost',
    className: 'bg-transparent data-[active=true]:bg-primary-muted',
    textClassName: 'text-text',
  },
  destructive: {
    base: 'destructive',
    // Pressed shade of the danger hue (rose700 light / rose200 dark). The ramp
    // only ships a "-muted-foreground" entry at that strength, and it mirrors
    // primary's primaryStrong pressed state; a muted background here would
    // leave white labels unreadable.
    className: 'data-[active=true]:bg-danger-muted-foreground',
    textClassName: 'text-danger-foreground',
  },
};

/**
 * Sizes are merged after the base tva output (h-fit, size-default px-4/py-2,
 * rounded-md), so tailwind-merge lets these win every height/padding conflict —
 * dimensions stay owned by MosaicButton. Radius is not a size concern: each
 * branch renders `rounded-full`, so every button is a pill — the same corner
 * shape as the pill input fields.
 */
const sizeClassName: Record<NonNullable<MosaicButtonProps['size']>, string> = {
  sm: 'h-8 px-3',
  md: 'h-11 px-4',
  lg: 'h-[50px] px-5',
};

const sizeTextClassName: Record<NonNullable<MosaicButtonProps['size']>, string> =
  {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-sm',
  };

export function MosaicButton({
  variant = 'primary',
  tone = 'default',
  size = 'md',
  className,
  children,
  ...props
}: MosaicButtonProps) {
  const isPlainLabel = typeof children === 'string';

  // Liquid-glass variant: an absolute, touch-transparent glass layer paints
  // behind the label (glassSurfaceClassName = inset-0; a childless MosaicGlass
  // sets pointerEvents="none", so presses and scrolls pass through untouched).
  if (variant === 'glass') {
    return (
      <Button
        {...props}
        variant="ghost"
        size="default"
        className={[
          'justify-center overflow-hidden rounded-full bg-transparent',
          sizeClassName[size],
          'data-[active=true]:bg-primary-muted',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <MosaicGlass className={glassSurfaceClassName} style={glassRimStyle} />
        {isPlainLabel ? (
          <Text
            className={[
              'font-semibold',
              sizeTextClassName[size],
              tone === 'primary' ? 'text-primary' : 'text-text',
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

  const config = variantConfig[variant];

  return (
    <Button
      {...props}
      variant={config.base}
      size="default"
      className={[
        'justify-center rounded-full',
        sizeClassName[size],
        config.className,
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
            config.textClassName,
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
