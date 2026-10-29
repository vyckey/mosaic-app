import {
  Image as ExpoImage,
  type ImageContentFit,
  type ImageProps,
} from 'expo-image';
import { ImageOff } from 'lucide-react-native';
import type { DimensionValue } from 'react-native';
import { View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import type { ThemeRadius } from '@/theme/types';

import { MosaicIcon } from './MosaicIcon';
import { MosaicPressable } from './MosaicPressable';

/** Mosaic radius token names: tile 8 / btn 14 / stat 16 / card 22 / sheet 32 / full */
export type MosaicRadius = keyof ThemeRadius;

/**
 * The box style of the container — shared by the plain View and the press
 * container so the hit area always equals the image box.
 */
type BoxStyle = {
  width?: DimensionValue;
  height?: DimensionValue;
  aspectRatio?: number;
  borderRadius?: number;
  overflow?: 'hidden';
};

export interface MosaicImageProps {
  /** Image source — uri object, require() id, or placeholder string (blurhash) */
  source: ImageProps['source'];
  /** Box width. Without aspectRatio it defaults to filling the parent. */
  width?: DimensionValue;
  /** Box height. Without aspectRatio it defaults to filling the parent. */
  height?: DimensionValue;
  /**
   * Aspect ratio (width / height). Sizing rules:
   * - No ratio: both axes fill the parent (each falls back to '100%').
   * - Ratio set: only the axes you pass are written to the box; RN derives
   *   the missing axis from the ratio.
   *   · ratio alone → the parent must provide a determinate cross-axis size
   *     (column stretch or an explicit parent width)
   *   · height + ratio → the parent must allow width derivation
   * - width + height + ratio: allowed, but explicit sizes win — the ratio
   *   derives nothing in that case (precedence: width/height > aspectRatio).
   */
  aspectRatio?: number;
  /** How the image is fitted into the box; default "cover" */
  contentFit?: ImageContentFit;
  /** Mosaic radius token for the box corners; default "tile" (8) */
  radius?: MosaicRadius;
  /**
   * Optional expo-image placeholder (uri / blurhash string) rendered INSIDE
   * the image while loading. The built-in fallback tile below still covers
   * total failures, so a plain load failure is never an invisible box.
   */
  placeholder?: ImageProps['placeholder'];
  /** Fade-in duration in ms when the image appears; 0 disables, default 200 */
  transition?: number;
  /** Load success callback; receives the expo-image load event */
  onLoad?: ImageProps['onLoad'];
  /** Load failure callback; receives the expo-image error event */
  onError?: ImageProps['onError'];
  /** Tap handler — wraps the box in MosaicPressable, which owns the feedback */
  onPress?: () => void;
  /** Press fade amount forwarded to MosaicPressable; default 0.7, 1 = none */
  pressedOpacity?: number;
}

/**
 * MosaicImage — the base image element of the design system (expo-image).
 *
 * The container is the box: size it with width/height (or aspectRatio), round
 * it with Mosaic radius tokens (default "tile"); it clips (overflow-hidden) so
 * the corners shape both the image and the fallback art. The image always
 * fills the container. Defaults: contentFit="cover", 200ms fade-in,
 * memory-disk cache.
 *
 * Empty-box visibility (loading / failed load): a framed placeholder tile
 * (surface fill + hairline border + broken-image glyph) is layered UNDER the
 * image. It shows whenever nothing has painted yet — slow load or failed
 * load alike — and is covered the moment the image paints, so loaded photos
 * are visually unaffected. This is intentional v1: NO load/error state is
 * tracked (state machine distinguishing loading vs error, and per-purpose
 * art — avatars / diaries / timeline — is the later MosaicImageFallback
 * iteration). onError stays the seam for that work.
 *
 * Press container: with onPress the same box style is applied to the
 * MosaicPressable wrapper, so the hit area equals the image box in every
 * sizing mode. Press feedback (opacity) is owned by MosaicPressable; tune it
 * with pressedOpacity — MosaicImage never applies opacity itself.
 *
 * Usage:
 *   <MosaicImage source={{ uri }} width={128} height={128} />
 *   <MosaicImage source={{ uri }} aspectRatio={4 / 3} radius="card" onPress={...} />
 */
export function MosaicImage({
  source,
  width,
  height,
  aspectRatio,
  contentFit = 'cover',
  radius = 'tile',
  placeholder,
  transition = 200,
  onLoad,
  onError,
  onPress,
  pressedOpacity,
}: MosaicImageProps) {
  const theme = useTheme();

  const boxStyle: BoxStyle = {
    aspectRatio,
    // Always a token after the default — clipped by the container below.
    borderRadius: theme.radius[radius],
    // The container clips so rounded corners shape the fallback tile too.
    overflow: 'hidden',
  };

  if (aspectRatio === undefined) {
    // No ratio: fill the parent on both axes unless a size is given.
    boxStyle.width = width ?? '100%';
    boxStyle.height = height ?? '100%';
  } else {
    // Ratio set: only write explicit axes — RN derives the missing one.
    // With both axes given the ratio stays a no-op (explicit sizes win).
    if (width !== undefined) {
      boxStyle.width = width;
    }
    if (height !== undefined) {
      boxStyle.height = height;
    }
  }

  const content = (
    <>
      {/* Fallback tile layered under the image: visible while nothing has
          painted (loading or failed load), covered once the image paints.
          No state tracked — the border keeps the box outline visible. */}
      <View className="absolute inset-0 items-center justify-center border border-border bg-surface">
        <MosaicIcon as={ImageOff} size="lg" tone="text-muted" />
      </View>

      {/* The container owns the box; the image only fills it. */}
      <ExpoImage
        source={source}
        style={{ width: '100%', height: '100%' }}
        contentFit={contentFit}
        placeholder={placeholder}
        transition={transition}
        cachePolicy="memory-disk"
        onLoad={onLoad}
        onError={onError}
      />
    </>
  );

  if (onPress) {
    // The press container carries the same box style, so the hit area always
    // matches the image box (fill / explicit / ratio modes alike).
    return (
      <MosaicPressable
        onPress={onPress}
        style={boxStyle}
        pressedOpacity={pressedOpacity}
      >
        {content}
      </MosaicPressable>
    );
  }

  return <View style={boxStyle}>{content}</View>;
}
