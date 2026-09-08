import { Search } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n/useI18n';

export interface MosaicSearchBarProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  onSubmitEditing?: () => void;
  autoFocus?: boolean;
  /** Hot-zone mode (e.g. jumping to a search page): the bar stays read-only and the whole row only fires onPress */
  onPress?: () => void;
  className?: string;
}

/** Timeline top search bar from the prototype; a sage rim shows on focus */
export function MosaicSearchBar({
  value,
  onChangeText,
  placeholder,
  onSubmitEditing,
  autoFocus,
  onPress,
  className,
}: MosaicSearchBarProps) {
  const theme = useTheme();
  const { t } = useI18n();
  const [focused, setFocused] = useState(false);
  const resolvedPlaceholder = placeholder ?? t('search.placeholder');

  const containerClassName = [
    'h-10 flex-row items-center gap-2 rounded-full border bg-surface px-3.5',
    focused && !onPress ? 'border-primary' : 'border-border',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      <Icon as={Search} size="sm" className="text-text-muted" />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onSubmitEditing={onSubmitEditing}
        returnKeyType="search"
        autoFocus={autoFocus}
        placeholder={resolvedPlaceholder}
        placeholderTextColor={theme.colors.textSubtle}
        selectionColor={theme.colors.primary}
        // Read-only in entry mode: keeps Android's TextInput from stealing taps and opening the keyboard
        editable={!onPress}
        pointerEvents={onPress ? 'none' : undefined}
        className="h-10 flex-1 text-body leading-none text-text web:outline-none"
      />
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="search"
        className={`${containerClassName} active:opacity-70`}
      >
        {content}
      </Pressable>
    );
  }

  return <View className={containerClassName}>{content}</View>;
}
