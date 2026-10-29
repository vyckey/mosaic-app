import { Search } from 'lucide-react-native';
import { Pressable } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n/useI18n';

import { MosaicInput } from './MosaicInput';

export interface MosaicSearchBarProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  onSubmitEditing?: () => void;
  autoFocus?: boolean;
  /** Hot-zone mode (e.g. jumping to a search page): the field stays read-only and the whole row only fires onPress */
  onPress?: () => void;
  /** Layout classes for the field wrapper (e.g. flex-1 to fill a row) */
  className?: string;
}

/**
 * Timeline top search bar from the prototype; a thin wrapper over MosaicInput.
 * Reuses the shared pill/focus-rim/placeholder/caret machinery and adds:
 * - the i18n default placeholder,
 * - a read-only hot-zone mode (onPress) that turns the whole row into a
 *   navigation target,
 * - the lighter moss placeholder tone (textSubtle) that distinguishes search
 *   chrome from form fields.
 */
export function MosaicSearchBar({
  value,
  onChangeText,
  placeholder,
  onSubmitEditing,
  autoFocus,
  onPress,
  className,
}: MosaicSearchBarProps) {
  const { t } = useI18n();
  const theme = useTheme();

  const field = (
    <MosaicInput
      icon={Search}
      value={value}
      onChangeText={onChangeText}
      onSubmitEditing={onSubmitEditing}
      returnKeyType="search"
      autoFocus={autoFocus}
      placeholder={placeholder ?? t('search.placeholder')}
      // Lighter moss tone distinguishes search chrome from form fields;
      // theme hex (native prop, not a style) instead of var()
      placeholderTextColor={theme.colors.textSubtle}
      // Read-only in hot-zone mode: keeps Android's TextInput from stealing taps and opening the keyboard
      editable={!onPress}
      pointerEvents={onPress ? 'none' : undefined}
      wrapperClassName={className}
    />
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="search"
        className="active:opacity-70"
      >
        {field}
      </Pressable>
    );
  }

  return field;
}
