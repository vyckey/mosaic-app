import { StatusBar } from 'expo-status-bar';
import type { ImageSource } from 'expo-image';
import { X } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { Gesture, GestureHandlerRootView, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/ui/icon';
import { useI18n } from '@/i18n/useI18n';

import { MosaicImage } from './MosaicImage';
import { MosaicText } from './MosaicText';

/** Upper bound for pinch / double-tap zoom (x) */
const MAX_ZOOM = 4;
/** Zoom target for double-tap in */
const DOUBLE_TAP_ZOOM = 2;

/** Clamp a zoom scale into [1, MAX_ZOOM]; callers animate the snap-back to 1 */
function clampScale(value: number): number {
  'worklet';
  return Math.min(MAX_ZOOM, Math.max(1, value));
}

/**
 * Keep a translation inside the zoom overflow box: at scale s the image exposes
 * (s - 1) * size of pannable slack, half on each side.
 */
function clampTranslate(value: number, scale: number, size: number): number {
  'worklet';
  const max = ((scale - 1) * size) / 2;
  return Math.min(max, Math.max(-max, value));
}

export interface MosaicImagePreviewProps {
  /** Renders the full-screen viewer when true */
  visible: boolean;
  /** All images in swipe order */
  images: ImageSource[];
  /** Index of the image currently on screen (controlled) */
  index: number;
  /** Fired when the user swipes to another image */
  onIndexChange: (next: number) => void;
  /** Fired on close (X button, single tap, Android back) */
  onClose: () => void;
}

interface PreviewPageProps {
  source: ImageSource;
  /** Page viewport size; the image is contained inside it */
  width: number;
  height: number;
  /** Pan is only armed while zoomed; the parent also locks paging on it */
  zoomed: boolean;
  onZoomChange: (zoomed: boolean) => void;
  onClose: () => void;
}

/**
 * One full-screen page of the viewer.
 *
 * Gestures: pinch to zoom (center anchored), double-tap to zoom 2x at the tap
 * point / back to fit, pan while zoomed (clamped to the zoom overflow box),
 * single tap on the fit image to dismiss.
 */
function PreviewPage({
  source,
  width,
  height,
  zoomed,
  onZoomChange,
  onClose,
}: PreviewPageProps) {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  // Last committed values; a new gesture continues from them instead of snapping
  const savedScale = useSharedValue(1);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  /** Animate back to the fit state and clear the committed values */
  const resetToFit = (): void => {
    'worklet';
    scale.value = withTiming(1);
    translateX.value = withTiming(0);
    translateY.value = withTiming(0);
    savedScale.value = 1;
    savedTranslateX.value = 0;
    savedTranslateY.value = 0;
  };

  /** Commit a zoom level, clamping the current translation into its slack box */
  const commit = (nextScale: number): void => {
    'worklet';
    const nextX = clampTranslate(translateX.value, nextScale, width);
    const nextY = clampTranslate(translateY.value, nextScale, height);
    savedScale.value = nextScale;
    savedTranslateX.value = nextX;
    savedTranslateY.value = nextY;
    translateX.value = nextX;
    translateY.value = nextY;
  };

  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = clampScale(savedScale.value * e.scale);
    })
    .onEnd(() => {
      if (scale.value <= 1.01) {
        resetToFit();
        runOnJS(onZoomChange)(false);
      } else {
        commit(scale.value);
        runOnJS(onZoomChange)(true);
      }
    });

  const pan = Gesture.Pan()
    .enabled(zoomed)
    .onUpdate((e) => {
      // Runtime gate too: React state can lag a beat behind a double-tap zoom
      if (savedScale.value <= 1) return;
      translateX.value = savedTranslateX.value + e.translationX;
      translateY.value = savedTranslateY.value + e.translationY;
    })
    .onEnd(() => {
      if (savedScale.value <= 1) return;
      commit(scale.value);
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .maxDuration(250)
    .onEnd((e) => {
      if (scale.value > 1) {
        resetToFit();
        runOnJS(onZoomChange)(false);
        return;
      }
      // Zoom DOUBLE_TAP_ZOOM x centered on the tapped point (clamped so the
      // tapped content stays in view)
      const nextX = clampTranslate(
        (width / 2 - e.x) * DOUBLE_TAP_ZOOM,
        DOUBLE_TAP_ZOOM,
        width,
      );
      const nextY = clampTranslate(
        (height / 2 - e.y) * DOUBLE_TAP_ZOOM,
        DOUBLE_TAP_ZOOM,
        height,
      );
      scale.value = withTiming(DOUBLE_TAP_ZOOM);
      translateX.value = withTiming(nextX);
      translateY.value = withTiming(nextY);
      savedScale.value = DOUBLE_TAP_ZOOM;
      savedTranslateX.value = nextX;
      savedTranslateY.value = nextY;
      runOnJS(onZoomChange)(true);
    });

  const singleTap = Gesture.Tap().onEnd(() => {
    // Fit scale only; a tap on the image or its letterbox dismisses the viewer
    if (scale.value > 1.01) return;
    runOnJS(onClose)();
  });

  // Double tap outranks single tap; pan is off at fit scale so the page list
  // keeps the horizontal drag for paging
  const gesture = Gesture.Simultaneous(
    pinch,
    pan,
    Gesture.Exclusive(doubleTap, singleTap),
  );

  const imageStyle = useAnimatedStyle(() => ({
    // Scale applies before translate, so drag stays 1:1 with the finger
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[{ width, height }, imageStyle]}>
        <MosaicImage
          source={source}
          width={width}
          height={height}
          contentFit="contain"
        />
      </Animated.View>
    </GestureDetector>
  );
}

export interface MosaicImagePreviewController {
  visible: boolean;
  images: ImageSource[];
  index: number;
  /** Open the viewer at `index` (defaults to the first image) */
  open: (images: ImageSource[], index?: number) => void;
  onIndexChange: (next: number) => void;
  onClose: () => void;
}

/**
 * Bundles MosaicImagePreview's controlled props into one piece of state:
 *
 *   const preview = useMosaicImagePreview();
 *   <MosaicImage source={src} onPress={() => preview.open(sources, i)} />
 *   <MosaicImagePreview {...preview} />
 */
export function useMosaicImagePreview(): MosaicImagePreviewController {
  const [state, setState] = useState<{
    images: ImageSource[];
    index: number;
  } | null>(null);

  const open = useCallback((images: ImageSource[], index = 0) => {
    setState({ images, index });
  }, []);
  const onIndexChange = useCallback((next: number) => {
    setState((prev) => (prev ? { ...prev, index: next } : prev));
  }, []);
  const onClose = useCallback(() => setState(null), []);

  return {
    visible: state !== null,
    images: state?.images ?? [],
    index: state?.index ?? 0,
    open,
    onIndexChange,
    onClose,
  };
}

/**
 * Full-screen image viewer over a black stage: swipe horizontally between
 * images, pinch / double-tap to zoom, pan while zoomed, single tap or the X
 * button to close, "n / total" counter on top.
 *
 * Controlled: pair it with `useMosaicImagePreview()` (see above) or wire the
 * props yourself. Closed → unmounted, so every open starts fresh at fit scale
 * and scrolled to `index` (closing snaps away instead of animating out).
 * Chrome is forced-dark in both color themes — the stage is always black.
 */
export function MosaicImagePreview({
  visible,
  images,
  index,
  onIndexChange,
  onClose,
}: MosaicImagePreviewProps) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  // Locks page swiping while zoomed so drags pan the image, not flip pages
  const [zoomed, setZoomed] = useState(false);

  if (!visible || images.length === 0) {
    return null;
  }

  const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(e.nativeEvent.contentOffset.x / width);
    if (next !== index && next >= 0 && next < images.length) {
      onIndexChange(next);
    }
  };

  return (
    <Modal
      visible
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <GestureHandlerRootView className="flex-1">
        <View className="flex-1 bg-black">
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEnabled={!zoomed}
            initialScrollIndex={index}
            getItemLayout={(_, i) => ({
              length: width,
              offset: width * i,
              index: i,
            })}
            keyExtractor={(_, i) => `image-${i}`}
            onMomentumScrollEnd={handleMomentumEnd}
            renderItem={({ item, index: i }) => (
              <PreviewPage
                source={item}
                width={width}
                height={height}
                zoomed={zoomed}
                onZoomChange={setZoomed}
                onClose={onClose}
              />
            )}
          />

          {/* Overlay chrome. The stage is always black, so the controls stay
              light-on-dark regardless of theme (rgba literals, same precedent
              as MosaicSheet's glass tints) */}
          <View
            pointerEvents="box-none"
            className="absolute inset-x-0 top-0 flex-row items-center justify-between px-2"
            style={{ paddingTop: insets.top + 8 }}
          >
            {/* Left spacer mirrors the close button so the counter stays centered */}
            <View className="h-11 w-11" />
            <MosaicText
              variant="caption"
              style={{ color: 'rgba(255,255,255,0.9)' }}
            >
              {`${index + 1} / ${images.length}`}
            </MosaicText>
            <Pressable
              onPress={onClose}
              accessibilityLabel={t('common.close')}
              accessibilityRole="button"
              className="h-11 w-11 items-center justify-center rounded-full bg-black/35"
            >
              <Icon as={X} size="md" className="text-white" />
            </Pressable>
          </View>
        </View>
      </GestureHandlerRootView>

      {/* Keep status-bar icons readable over the black stage */}
      <StatusBar style="light" />
    </Modal>
  );
}
