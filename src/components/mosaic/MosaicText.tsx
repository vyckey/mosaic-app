import type { ReactNode } from 'react';
import { Text as RNText, type TextProps } from 'react-native';

export type MosaicTextVariant =
  | 'display'
  | 'title'
  | 'subtitle'
  | 'body'
  | 'caption'
  | 'tiny';

export type MosaicTextTone =
  | 'text'
  | 'text-muted'
  | 'text-subtle'
  | 'text-disabled'
  | 'primary'
  | 'primary-foreground'
  | 'danger'
  | 'success'
  | 'warning';

export type MosaicTextWeight = '400' | '500' | '600' | '700';

export interface MosaicTextProps extends TextProps {
  variant?: MosaicTextVariant;
  tone?: MosaicTextTone;
  weight?: MosaicTextWeight;
  truncated?: boolean;
  children?: ReactNode;
}

const variantClassName: Record<MosaicTextVariant, string> = {
  display: 'text-display leading-none',
  title: 'text-title leading-none',
  subtitle: 'text-subtitle leading-none',
  body: 'text-body leading-none',
  caption: 'text-caption leading-none',
  tiny: 'text-tiny leading-none',
};

const toneClassName: Record<MosaicTextTone, string> = {
  text: 'text-text',
  'text-muted': 'text-text-muted',
  'text-subtle': 'text-text-subtle',
  'text-disabled': 'text-text-disabled',
  primary: 'text-primary',
  'primary-foreground': 'text-primary-foreground',
  danger: 'text-danger',
  success: 'text-success',
  warning: 'text-warning',
};

const weightClassName: Record<MosaicTextWeight, string> = {
  '400': 'font-normal',
  '500': 'font-medium',
  '600': 'font-semibold',
  '700': 'font-bold',
};

export function MosaicText({
  variant = 'body',
  tone = 'text',
  weight,
  truncated,
  className,
  children,
  ...props
}: MosaicTextProps) {
  return (
    <RNText
      className={[
        variantClassName[variant],
        toneClassName[tone],
        weight && weightClassName[weight],
        truncated && 'truncate',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      numberOfLines={truncated ? 1 : undefined}
      {...props}
    >
      {children}
    </RNText>
  );
}
