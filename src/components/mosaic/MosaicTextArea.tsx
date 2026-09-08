import { useCallback, useState } from 'react';
import type {
  StyleProp,
  TextInputContentSizeChangeEvent,
  TextInputProps,
  TextStyle,
} from 'react-native';
import { View } from 'react-native';

import { Textarea, TextareaInput } from '@/components/ui/textarea';

import { glassRimStyle, MosaicGlass } from './MosaicGlass';

export interface MosaicTextAreaProps
  extends Omit<TextInputProps, 'style' | 'multiline' | 'textAlignVertical'> {
  /** Min height of the container, defaults to 120; with flex-1 the layout stretches it */
  minHeight?: number;
  /** Max height before the input scrolls internally, defaults to 240 */
  maxHeight?: number;
  /** Container layout (margins / padding / flex-1), e.g. diary body `mx-[18px] flex-1` */
  containerClassName?: string;
  /**
   * Render the input on a liquid-glass surface (glass panel with a hairline rim).
   * In glass mode containerClassName styles the glass wrapper (padding / margins / flex).
   */
  glass?: boolean;
  /** Input typography override (fontSize / lineHeight, etc.) */
  style?: StyleProp<TextStyle>;
}

/**
 * Long-form plain text input (Moment caption / diary body, etc.).
 * Borderless and transparent by default so the page background shows through;
 * with `glass` it sits on an absolute MosaicGlass surface instead.
 * Grows with the content between minHeight and maxHeight, then scrolls internally.
 * Typography goes through the style prop — NativeWind preview does not apply
 * className font styles to TextInput (see MEMORY.md).
 */
export function MosaicTextArea({
  minHeight = 120,
  maxHeight = 240,
  containerClassName,
  glass = false,
  style,
  placeholderTextColor = 'var(--color-text-muted)',
  onContentSizeChange,
  ...inputProps
}: MosaicTextAreaProps) {
  const [height, setHeight] = useState(minHeight);

  const handleContentSizeChange = useCallback(
    // Since RN 0.88 TextInputContentSizeChangeEvent is NativeSyntheticEvent<{ contentSize }>
    (event: TextInputContentSizeChangeEvent) => {
      const contentHeight = event.nativeEvent.contentSize.height;
      setHeight(Math.min(Math.max(contentHeight, minHeight), maxHeight));
      onContentSizeChange?.(event);
    },
    [minHeight, maxHeight, onContentSizeChange],
  );

  const textarea = (
    <Textarea
      className={glass ? undefined : containerClassName}
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

  if (!glass) {
    return textarea;
  }

  // Glass mode: an absolute MosaicGlass layer frosts the surface behind the
  // input; the wrapper (rounded + clipped) takes containerClassName.
  return (
    <View
      className={['relative overflow-hidden rounded-stat', containerClassName]
        .filter(Boolean)
        .join(' ')}
    >
      <MosaicGlass
        className="absolute inset-0 rounded-stat"
        style={glassRimStyle}
      />
      {textarea}
    </View>
  );
}
