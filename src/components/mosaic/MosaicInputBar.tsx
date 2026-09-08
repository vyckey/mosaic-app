import type { LucideIcon } from 'lucide-react-native';
import { Pressable, Text, TextInput, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n/useI18n';

export interface MosaicInputBarAction {
  icon?: LucideIcon;
  /** 优先于 icon 显示（原型 quick-action 使用 emoji） */
  emoji?: string;
  /** 图标下方小字标签，如「心情 / 拍照 / 录音」 */
  label?: string;
  onPress?: () => void;
  accessibilityLabel?: string;
}

export interface MosaicInputBarProps {
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChangeText?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onSubmitEditing?: () => void;
  autoFocus?: boolean;
  editable?: boolean;
  actions?: MosaicInputBarAction[];
  className?: string;
}

/**
 * 对应原型 .quick-composer：悬浮胶囊快速记录器。
 * 定位由父级决定（absolute 或文档流均可）。
 */
export function MosaicInputBar({
  placeholder,
  value,
  defaultValue,
  onChangeText,
  onFocus,
  onBlur,
  onSubmitEditing,
  autoFocus,
  editable = true,
  actions = [],
  className,
}: MosaicInputBarProps) {
  const theme = useTheme();
  const { t } = useI18n();
  const resolvedPlaceholder = placeholder ?? t('composer.placeholder');

  return (
    <View className={['w-full px-3', className].filter(Boolean).join(' ')}>
      <View
        className="flex-row items-center gap-1 rounded-full border border-border bg-surface px-2 py-1.5"
        style={theme.shadows.popover}
      >
        <TextInput
          className="h-11 flex-1 rounded-full px-3 py-0 text-body leading-5 text-text will-change-variable"
          style={{ textAlignVertical: 'center' }}
          placeholder={resolvedPlaceholder}
          placeholderTextColor={theme.colors.textMuted}
          value={value}
          defaultValue={defaultValue}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          onSubmitEditing={onSubmitEditing}
          autoFocus={autoFocus}
          editable={editable}
          multiline={false}
        />

        {actions.map((action, index) => (
          <Pressable
            key={index}
            onPress={action.onPress}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={action.accessibilityLabel ?? action.label}
            className="h-11 min-w-11 flex-col items-center justify-center rounded-full px-1.5 active:bg-primary-muted"
          >
            {action.emoji ? (
              <Text className="text-lg leading-5">{action.emoji}</Text>
            ) : action.icon ? (
              <Icon as={action.icon} size="md" className="text-text-muted" />
            ) : null}
            {action.label && (
              <Text className="text-[9px] text-text-subtle">
                {action.label}
              </Text>
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );
}
