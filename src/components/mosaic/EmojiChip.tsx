import { MosaicPressable } from './MosaicPressable';
import { MosaicText } from './MosaicText';

export interface EmojiItem {
  emoji: string;
  label: string;
}

export interface EmojiChipProps {
  item: EmojiItem;
  active: boolean;
  onPress: () => void;
}

export function EmojiChip({ item, active, onPress }: EmojiChipProps) {
  return (
    <MosaicPressable
      onPress={onPress}
      className={`w-16 items-center rounded-btn border-2 px-1 py-1.5 ${
        active ? 'border-primary bg-primary-muted' : 'border-transparent'
      }`}
    >
      <MosaicText variant="body" className="pt-1 text-center">
        {item.emoji}
      </MosaicText>
      <MosaicText
        variant="tiny"
        tone={active ? 'primary' : 'text-muted'}
        className="mt-2 text-center"
      >
        {item.label}
      </MosaicText>
    </MosaicPressable>
  );
}
