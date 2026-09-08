import { useCallback, useState } from 'react';
import type {
  NativeSyntheticEvent,
  StyleProp,
  TextInputContentSizeChangeEventData,
  TextInputProps,
  TextStyle,
} from 'react-native';

import { Textarea, TextareaInput } from '@/components/ui/textarea';

export interface MosaicTextAreaProps
  extends Omit<TextInputProps, 'style' | 'multiline' | 'textAlignVertical'> {
  /** Min height of the container, defaults to 120; with flex-1 the layout stretches it */
  minHeight?: number;
  /** Max height before the input scrolls internally, defaults to 240 */
  maxHeight?: number;
  /** Container layout (margins / padding / flex-1), e.g. diary body `mx-[18px] flex-1` */
  containerClassName?: string;
  /** Input typography override (fontSize / lineHeight, etc.) */
  style?: StyleProp<TextStyle>;
}

/**
 * Long-form plain text input (Moment caption / diary body, etc.).
 * Borderless and transparent by default so the page background shows through.
 * Grows with the content between minHeight and maxHeight, then scrolls internally.
 * Typography goes through the style prop — NativeWind preview does not apply
 * className font styles to TextInput (see MEMORY.md).
 */
export function MosaicTextArea({
  minHeight = 120,
  maxHeight = 240,
  containerClassName,
  style,
  placeholderTextColor = 'var(--color-text-muted)',
  onContentSizeChange,
  ...inputProps
}: MosaicTextAreaProps) {
  const [height, setHeight] = useState(minHeight);

  const handleContentSizeChange = useCallback(
    (event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
      const contentHeight = event.nativeEvent.contentSize.height;
      setHeight(Math.min(Math.max(contentHeight, minHeight), maxHeight));
      onContentSizeChange?.(event);
    },
    [minHeight, maxHeight, onContentSizeChange],
  );

  return (
    <Textarea
      className={containerClassName}
      // style takes precedence over className: overrides gluestack's default h-[100px] border and background
      style={{ height, borderWidth: 0, backgroundColor: 'transparent' }}
    >
      <TextareaInput
        {...inputProps}
        multiline
        onContentSizeChange={handleContentSizeChange}
        placeholderTextColor={placeholderTextColor}
        // NativeWind preview does not apply className font styles to TextInput, so typography must go through style (see MEMORY.md)
        style={[
          { fontSize: 14, lineHeight: 22, color: 'var(--color-text)', padding: 0 },
          style,
        ]}
      />
    </Textarea>
  );
}
