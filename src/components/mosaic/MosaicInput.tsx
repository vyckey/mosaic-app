import type { ReactNode } from 'react';
import { useState } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

import { Icon } from '@/components/ui/icon';

import { MosaicText } from './MosaicText';

export interface MosaicInputProps extends TextInputProps {
  icon?: LucideIcon;
  error?: string | null;
  trailing?: ReactNode;
  containerClassName?: string;
}

export function MosaicInput({
  icon,
  error,
  trailing,
  containerClassName,
  className,
  style,
  onFocus,
  onBlur,
  ...inputProps
}: MosaicInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View className="gap-1.5">
      <View
        className={[
          'flex-row items-center gap-2 rounded-tile border bg-surface px-3',
          error ? 'border-danger' : focused ? 'border-primary' : 'border-border',
          containerClassName,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {icon && <Icon as={icon} size="sm" className="text-text-muted" />}
        <TextInput
          {...inputProps}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          placeholderTextColor="var(--color-text-muted)"
          className={['h-11 min-w-0 flex-1 text-body leading-none web:outline-none', className]
            .filter(Boolean)
            .join(' ')}
          style={[{ color: 'var(--color-text)' }, style]}
        />
        {trailing}
      </View>
      {error && (
        <MosaicText variant="tiny" tone="danger">
          {error}
        </MosaicText>
      )}
    </View>
  );
}
