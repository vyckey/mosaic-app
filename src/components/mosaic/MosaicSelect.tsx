import { Check } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { useI18n } from '@/i18n/useI18n';

import { MosaicButton } from './MosaicButton';
import { MosaicText } from './MosaicText';

export interface MosaicSelectProps<T extends string> {
  /** 可选项列表 */
  options: { label: string; value: T }[];
  /** 暂存的选中值，状态由使用方持有 */
  stagedValue?: T;
  /** 点击选项时回调，使用方更新暂存值 */
  onStage?: (value: T) => void;
  /** 点击「保存」时回调，使用方提交暂存值并关闭弹层 */
  onSave?: () => void;
  className?: string;
}

/** select 式选项面板：点选仅暂存，「保存」时经 onSave 提交；通常置于 MosaicSheet 内 */
export function MosaicSelect<T extends string>({
  options,
  stagedValue,
  onStage,
  onSave,
  className,
}: MosaicSelectProps<T>) {
  const { t } = useI18n();

  return (
    <View className={['w-full', className].filter(Boolean).join(' ')}>
      <View className="w-full gap-1">
        {options.map((option) => {
          const isSelected = stagedValue === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onStage?.(option.value)}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              className={`w-full flex-row items-center justify-between rounded-sm px-3 py-3 active:bg-accent/50 ${
                isSelected ? 'bg-accent' : ''
              }`}
            >
              <MosaicText variant="body">{option.label}</MosaicText>
              {isSelected && (
                <Icon as={Check} size="sm" className="shrink-0 text-primary" />
              )}
            </Pressable>
          );
        })}
      </View>

      <MosaicButton
        variant="primary"
        size="lg"
        onPress={onSave}
        className="mt-3 w-full"
      >
        {t('common.save')}
      </MosaicButton>
    </View>
  );
}
