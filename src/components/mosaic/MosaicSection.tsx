import React from 'react';
import { View } from 'react-native';

type BaseViewProps = React.ComponentProps<typeof View>;

export interface MosaicSectionProps extends BaseViewProps {
  spacing?: 'none' | 'sm' | 'md' | 'lg';
}

export function MosaicSection({
  spacing = 'md',
  className,
  ...props
}: MosaicSectionProps) {
  const spacingClassName = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  }[spacing];

  return (
    <View
      {...props}
      className={['w-full', spacingClassName, className]
        .filter(Boolean)
        .join(' ')}
    />
  );
}
