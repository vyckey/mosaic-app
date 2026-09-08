import { ScrollView, View } from 'react-native';

import { MosaicChip } from './MosaicChip';

export interface MosaicChipOption {
  value: string;
  label: string;
  emoji?: string;
}

export interface MosaicChipGroupProps {
  options: MosaicChipOption[];
  value?: string;
  onChange?: (value: string) => void;
  /** 横向滚动模式（原型 .subnav：时间流/日历/地图/分类） */
  scrollable?: boolean;
  className?: string;
}

/**
 * 受控的胶囊筛选组：覆盖原型 .chips 筛选（近30天/近1年/全部）
 * 与 .subnav 视图切换两种场景。
 */
export function MosaicChipGroup({
  options,
  value,
  onChange,
  scrollable = false,
  className,
}: MosaicChipGroupProps) {
  const chips = options.map((option) => (
    <MosaicChip
      key={option.value}
      label={option.label}
      emoji={option.emoji}
      active={option.value === value}
      onPress={onChange ? () => onChange(option.value) : undefined}
    />
  ));

  if (scrollable) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName={['gap-2', className]
          .filter(Boolean)
          .join(' ')}
      >
        {chips}
      </ScrollView>
    );
  }

  return (
    <View className={['flex-row flex-wrap gap-2', className].filter(Boolean).join(' ')}>
      {chips}
    </View>
  );
}
