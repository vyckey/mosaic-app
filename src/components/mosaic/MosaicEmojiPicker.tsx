import { ScrollView, View } from 'react-native';

import { EmojiChip, type EmojiItem } from './EmojiChip';

export type { EmojiItem };

export type MosaicEmojiPickerMode = 'slider' | 'grid';

export interface MosaicEmojiPickerProps {
  mode?: MosaicEmojiPickerMode;
  items: EmojiItem[];
  value?: string | null;
  onChange: (emoji: string | null) => void;
  className?: string;
  contentContainerClassName?: string;
}

export function MosaicEmojiPicker({
  mode = 'grid',
  items,
  value,
  onChange,
  className,
  contentContainerClassName,
}: MosaicEmojiPickerProps) {
  const chips = items.map((item) => (
    <EmojiChip
      key={item.emoji}
      item={item}
      active={value === item.emoji}
      onPress={() => onChange(value === item.emoji ? null : item.emoji)}
    />
  ));

  if (mode === 'slider') {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className={className}
        contentContainerClassName={['gap-2.5', contentContainerClassName]
          .filter(Boolean)
          .join(' ')}
      >
        {chips}
      </ScrollView>
    );
  }

  return (
    <View className={className}>
      <View
        className={[
          'flex-row flex-wrap gap-2.5',
          contentContainerClassName,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {chips}
      </View>
    </View>
  );
}
