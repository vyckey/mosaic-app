import { View } from 'react-native';

import { MosaicPressable } from '../MosaicPressable';
import { MosaicText } from '../MosaicText';

export interface MosaicTagsProps {
  tags: string[];
  /**
   * Optional press handler, wired up by the caller. Defaults to a console log
   * until tag pages exist. The component itself never edits the list.
   */
  onPressTag?: (tag: string) => void;
  className?: string;
}

/**
 * Read-only tag list. Each tag is tappable for future tag-page navigation, but
 * for now a press only logs the tag — there is no picker or editing UI here.
 * Use `MosaicTagsEditor` when the tags need to be changed.
 */
export function MosaicTags({ tags, onPressTag, className }: MosaicTagsProps) {
  if (tags.length === 0) return null;

  const handlePress = (tag: string) => {
    // TODO: navigate to the tag page once it lands.
    console.log('[MosaicTags] tag pressed:', tag);
    onPressTag?.(tag);
  };

  return (
    <View
      className={['flex-row flex-wrap items-center gap-2', className]
        .filter(Boolean)
        .join(' ')}
    >
      {tags.map((tag) => (
        <MosaicPressable
          key={tag}
          onPress={() => handlePress(tag)}
          hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
          accessibilityLabel={`#${tag}`}
        >
          <MosaicText variant="caption" tone="primary" weight="500">
            #{tag}
          </MosaicText>
        </MosaicPressable>
      ))}
    </View>
  );
}
