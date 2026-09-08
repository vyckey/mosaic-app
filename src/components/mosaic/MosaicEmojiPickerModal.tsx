import { Smile } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { EmojiChip, type EmojiItem } from './EmojiChip';
import { MosaicIcon } from './MosaicIcon';
import { MosaicPressable } from './MosaicPressable';
import { MosaicSheet } from './MosaicSheet';
import { MosaicText } from './MosaicText';

export interface MosaicEmojiPickerModalProps {
  items: EmojiItem[];
  value?: string | null;
  onChange: (emoji: string | null) => void;
  /** 触发按钮未选中时的占位文案 */
  placeholder?: string;
  /** 弹层标题 */
  title?: string;
  className?: string;
  contentContainerClassName?: string;
}

export function MosaicEmojiPickerModal({
  items,
  value,
  onChange,
  placeholder,
  title,
  className,
  contentContainerClassName,
}: MosaicEmojiPickerModalProps) {
  const [visible, setVisible] = useState(false);

  const selected = items.find((item) => item.emoji === value);

  const handlePress = (item: EmojiItem) => {
    onChange(value === item.emoji ? null : item.emoji);
    setVisible(false);
  };

  return (
    <>
      <MosaicPressable
        onPress={() => setVisible(true)}
        hitSlop={{ top: 8, bottom: 8 }}
        className={['flex-row items-center gap-1 self-start pr-1', className]
          .filter(Boolean)
          .join(' ')}
      >
        {selected ? (
          <>
            <MosaicText variant="body">{selected.emoji}</MosaicText>
            <MosaicText variant="tiny" tone="text-muted">
              {selected.label}
            </MosaicText>
          </>
        ) : (
          <>
            <MosaicIcon as={Smile} size="sm" tone="text-muted" />
            <MosaicText variant="tiny" tone="text-muted">
              {placeholder}
            </MosaicText>
          </>
        )}
      </MosaicPressable>

      <MosaicSheet
        visible={visible}
        onClose={() => setVisible(false)}
        title={title}
      >
        <View
          className={[
            'flex-row flex-wrap justify-center gap-2.5',
            contentContainerClassName,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {items.map((item) => (
            <EmojiChip
              key={item.emoji}
              item={item}
              active={value === item.emoji}
              onPress={() => handlePress(item)}
            />
          ))}
        </View>
      </MosaicSheet>
    </>
  );
}
