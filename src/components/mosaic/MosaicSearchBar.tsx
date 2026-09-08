import { Search } from 'lucide-react-native';
import { useState } from 'react';
import { TextInput, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n/useI18n';

export interface MosaicSearchBarProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  onSubmitEditing?: () => void;
  autoFocus?: boolean;
  className?: string;
}

/** 对应原型时间线顶部的搜索条，聚焦时出现鼠尾草描边 */
export function MosaicSearchBar({
  value,
  onChangeText,
  placeholder,
  onSubmitEditing,
  autoFocus,
  className,
}: MosaicSearchBarProps) {
  const theme = useTheme();
  const { t } = useI18n();
  const [focused, setFocused] = useState(false);
  const resolvedPlaceholder = placeholder ?? t('search.placeholder');

  return (
    <View
      className={[
        'h-10 flex-row items-center gap-2 rounded-btn border bg-surface px-3.5',
        focused ? 'border-primary' : 'border-border',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
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
        className="h-10 flex-1 text-body leading-none text-text web:outline-none"
      />
    </View>
  );
}
