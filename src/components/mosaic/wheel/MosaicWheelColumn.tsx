import * as Haptics from 'expo-haptics';
import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  Easing,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { useTheme } from '@/hooks/use-theme';

import { MosaicText } from '../MosaicText';
import { clampIndex, normalizeVisibleCount, wheelPadding } from './wheelUtils';

/** Value a wheel row can carry. Numbers keep their numeric type. */
export type WheelValue = string | number;

export interface WheelItem {
  value: WheelValue;
  /** Text shown in the row; defaults to `String(value)`. */
  label?: string;
}

/**
 * One column of a wheel picker. Units belong to the column, not to the picker:
 * a date wheel shows `年 / 月 / 日` while a metric wheel shows `kg / cm`, and
 * the two often sit next to each other.
 */
export interface WheelColumn {
  /** Stable id; also the key of this column in the picker's value map. */
  key: string;
  /** Accessible name of the column ("Year", "Month"…). */
  label?: string;
  items: WheelItem[];
  /** Unit rendered after every value, e.g. `年` or `kg`. */
  suffix?: string;
  /** Fixed width in px; ignored when `flex` is used instead. */
  width?: number;
  /** Share of the row width (defaults to 1), so a year can be wider than a day. */
  flex?: number;
  /** Wrap around after the last row (see `MosaicWheelColumnProps.loop`). */
  loop?: boolean;
}

export interface MosaicWheelColumnProps {
  items: WheelItem[];
  /** Centred row, derived from the controlled value. */
  selectedIndex: number;
  /** Row height in px — the snap interval at the same time. */
  itemHeight?: number;
  /** Rows on screen; even values round up to the next odd number. */
  visibleCount?: number;
  suffix?: string;
  width?: number;
  flex?: number;
  /**
   * Scroll endlessly in both directions: past the last row the wheel wraps to
   * the first one, so a day wheel goes 30 → 31 → 1 and an hour wheel 23 → 00.
   *
   * The rows are recycled, not duplicated — only the handful of rows around
   * the visible area is mounted, and each one is re-pointed at a new index as
   * it leaves the viewport. Callers whose rows are bounded (a 1–15 day range)
   * should leave it off.
   */
  loop?: boolean;
  disabled?: boolean;
  /** Light impact each time the centred row changes. */
  hapticFeedback?: boolean;
  /**
   * Dim rows by distance from the centre (default). When `false` every row
   * keeps full opacity and only the scale marks the selection.
   */
  fadeEdges?: boolean;
  /** Fires only after the wheel settles on a different row. */
  onSettle?: (index: number) => void;
  /** Accessible name of the column, e.g. "Year". */
  accessibilityLabel?: string;
  className?: string;
}

/** Mounted rows on each side of the visible area before a row is recycled. */
const OVERSCAN_ROWS = 3;

/** Milliseconds of snap animation added per row of travel. */
const SNAP_MS_PER_ROW = 55;
const SNAP_MIN_MS = 140;
const SNAP_MAX_MS = 420;

/**
 * Seconds of a flick's velocity that decide where it lands. A native wheel
 * already coasts quite far, so this stays short: 0.12 s reads as "keep going
 * with the finger's momentum" without overshooting half a screen.
 */
const FLICK_PROJECTION = 0.12;

/**
 * A wheel tick must never be able to break the picker. Builds without the
 * native haptics module (an Expo Go binary older than the JS package, for
 * example) reject with `UnavailabilityError`, which used to surface as an
 * uncaught promise rejection on every scroll.
 */
function hapticTick() {
  try {
    void Haptics.selectionAsync().catch(() => {});
  } catch {
    // Native module unavailable — the wheel simply stays silent.
  }
}

/** Positive modulo, so a virtual index below zero still maps into `items`. */
function wrapIndex(index: number, count: number): number {
  return ((index % count) + count) % count;
}

interface WheelRowProps {
  /** Virtual row index; unlike a list index it may be negative or huge. */
  position: number;
  item?: WheelItem;
  scroll: SharedValue<number>;
  itemHeight: number;
  /** Distance from the container's top to the centre of the viewport. */
  topPadding: number;
  /** Rows from the centre to the edge, used to fade and shrink the ends. */
  halfRows: number;
  fadeEdges: boolean;
  suffix?: string;
}

/**
 * One recycled wheel row.
 *
 * The row is absolutely positioned and its `translateY` is derived on the UI
 * thread from `position - scroll`, so the wheel never re-renders while it
 * moves. `position` only changes when the row leaves the viewport, which is
 * also when its label changes — the two happen in the same commit, so the
 * recycle is invisible.
 */
function WheelRow({
  position,
  item,
  scroll,
  itemHeight,
  topPadding,
  halfRows,
  fadeEdges,
  suffix,
}: WheelRowProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const delta = position - scroll.value;
    const distance = Math.min(Math.abs(delta) / halfRows, 1);

    return {
      opacity: fadeEdges ? 1 - 0.92 * distance : 1,
      transform: [
        { translateY: topPadding + delta * itemHeight },
        { scale: fadeEdges ? 1.06 - 0.12 * distance : 1 },
      ],
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          left: 0,
          right: 0,
          height: itemHeight,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 4,
        },
        animatedStyle,
      ]}
    >
      {item ? (
        <MosaicText
          variant="body"
          weight="500"
          numberOfLines={1}
          className="w-full text-center"
        >
          {item.label ?? String(item.value)}
          {suffix ? (
            <MosaicText variant="tiny" tone="text-muted">{` ${suffix}`}</MosaicText>
          ) : null}
        </MosaicText>
      ) : null}
    </Animated.View>
  );
}

/**
 * A single snapping wheel column.
 *
 * There is no list under it: the wheel is a stack of absolutely positioned
 * rows inside a clipped box, moved by a single Reanimated scroll value. A fixed
 * number of rows is mounted around the centre and rows that leave the box are
 * re-pointed at the opposite end, which is what makes a looping wheel truly
 * endless — no duplicated data, no unbounded list.
 *
 * The component is fully controlled: `selectedIndex` is the value, and
 * `onSettle` reports a new index after the wheel comes to rest. It never
 * corrects the value on its own — if `items` shrink below `selectedIndex` the
 * wheel simply clamps for display, and the owner is expected to clamp the
 * value too (a date wheel relies on that when 31 January turns into February).
 */
export function MosaicWheelColumn({
  items,
  selectedIndex,
  itemHeight = 40,
  visibleCount = 5,
  suffix,
  width,
  flex = 1,
  loop = false,
  disabled = false,
  hapticFeedback = true,
  fadeEdges = true,
  onSettle,
  accessibilityLabel,
  className,
}: MosaicWheelColumnProps) {
  const theme = useTheme();
  const visibleRows = normalizeVisibleCount(visibleCount);
  const totalHeight = visibleRows * itemHeight;
  const count = items.length;
  const index = clampIndex(selectedIndex, count);
  const looping = loop && count > 1;

  const halfRows = (visibleRows - 1) / 2;
  const topPadding = wheelPadding(itemHeight, visibleRows);
  const slotCount = visibleRows + OVERSCAN_ROWS * 2;
  const middleSlot = (slotCount - 1) / 2;

  // Position of the wheel in rows. It is unbounded while looping, so a flick
  // can cross the end of the list without anything having to jump.
  const scroll = useSharedValue(index);
  /** Virtual index of the first mounted row; mirrored into state for labels. */
  const baseValue = useSharedValue(index - middleSlot);
  const [base, setBase] = useState(index - middleSlot);
  /** Wheel position when the current drag started. */
  const dragStart = useSharedValue(index);
  /** Last row that already produced a haptic tick. */
  const hapticIndex = useSharedValue(index);
  const hapticsEnabled = useSharedValue(hapticFeedback && !disabled);
  /** Last row handed to `onSettle`, used to drop redundant callbacks. */
  const settledIndex = useRef(index);
  const onSettleRef = useRef(onSettle);

  useEffect(() => {
    onSettleRef.current = onSettle;
  }, [onSettle]);

  useEffect(() => {
    hapticsEnabled.value = hapticFeedback && !disabled;
  }, [disabled, hapticFeedback, hapticsEnabled]);

  /** Reports a settled row, folding the virtual index back into the list. */
  const commit = (target: number) => {
    if (count === 0) {
      return;
    }

    const next = looping ? wrapIndex(target, count) : clampIndex(target, count);

    if (next === settledIndex.current) {
      return;
    }

    settledIndex.current = next;
    onSettleRef.current?.(next);
  };

  /** Animates the wheel onto a row; `notify` reports it once it gets there. */
  const snapTo = (target: number, notify: boolean) => {
    'worklet';
    const distance = Math.abs(target - scroll.value);
    const duration = Math.min(
      SNAP_MAX_MS,
      Math.max(SNAP_MIN_MS, distance * SNAP_MS_PER_ROW),
    );

    scroll.value = withTiming(
      target,
      { duration, easing: Easing.out(Easing.cubic) },
      (finished) => {
        if (finished && notify) {
          runOnJS(commit)(target);
        }
      },
    );
  };

  /**
   * Re-points the window as the wheel moves. It only fires once the centre has
   * drifted a couple of rows, so a long flick re-renders a few times at most;
   * rows that leave the window are three rows outside the visible area, which
   * is what keeps the recycle invisible.
   */
  useAnimatedReaction(
    () => Math.round(scroll.value),
    (centre) => {
      if (Math.abs(centre - (baseValue.value + middleSlot)) > OVERSCAN_ROWS - 1) {
        const next = centre - middleSlot;
        baseValue.value = next;
        runOnJS(setBase)(next);
      }
    },
    [middleSlot],
  );

  /** One tick per row crossed, matched to the snap that the wheel settles on. */
  useAnimatedReaction(
    () => Math.round(scroll.value),
    (centre) => {
      if (centre === hapticIndex.value) {
        return;
      }

      hapticIndex.value = centre;

      if (hapticsEnabled.value) {
        runOnJS(hapticTick)();
      }
    },
  );

  // Follow external value changes: another column clamping this one, a reset,
  // the accessibility actions. The wheel animates along the shortest path that
  // keeps its direction — a looping wheel never rewinds a whole cycle.
  useEffect(() => {
    if (count === 0 || index === settledIndex.current) {
      return;
    }

    settledIndex.current = index;
    const target = looping
      ? index + count * Math.round((scroll.value - index) / count)
      : index;
    snapTo(target, false);
    // `snapTo` only reads shared values and the geometry computed above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, index, looping]);

  /** Grabs the current position so a drag continues from it. */
  const beginDrag = () => {
    'worklet';
    cancelAnimation(scroll);
    dragStart.value = scroll.value;
  };

  /** Moves the wheel under the finger; a bounded wheel stops at its ends. */
  const dragTo = (translationY: number) => {
    'worklet';
    const next = dragStart.value - translationY / itemHeight;
    // Reanimated shared values are mutable by design; the React Compiler rule
    // cannot see through the worklet boundary and reports a false positive.
    // eslint-disable-next-line react-hooks/immutability
    scroll.value = looping ? next : Math.min(Math.max(next, 0), count - 1);
  };

  /** Projects the flick, snaps onto a row, and reports it once it lands. */
  const endDrag = (velocityY: number, success: boolean) => {
    'worklet';
    const projected = success
      ? scroll.value - (velocityY * FLICK_PROJECTION) / itemHeight
      : scroll.value;
    const rounded = Math.round(projected);
    const target = looping ? rounded : Math.min(Math.max(rounded, 0), count - 1);

    snapTo(target, true);
  };

  const pan = Gesture.Pan()
    .enabled(!disabled && count > 0)
    .onBegin(beginDrag)
    .onUpdate((event) => {
      'worklet';
      dragTo(event.translationY);
    })
    // The settle callback reaches `onSettle` through `runOnJS`, so the refs it
    // reads only ever run after a gesture — never during render.
    // eslint-disable-next-line react-hooks/refs
    .onEnd((event, success) => {
      'worklet';
      endDrag(event.velocityY, success);
    });

  /** The labels of the mounted window, keyed by their virtual position. */
  const rows = useMemo(() => {
    return Array.from({ length: slotCount }, (_, slot) => {
      const position = base + slot;
      let item: WheelItem | undefined;

      if (looping) {
        item = items[wrapIndex(position, count)];
      } else if (position >= 0 && position < count) {
        item = items[position];
      }

      return { position, item };
    });
  }, [base, count, items, looping, slotCount]);

  /** Steps a column through the accessibility actions, wrapping when looping. */
  const selectIndex = (next: number) => {
    if (count === 0) {
      return;
    }

    const target = looping ? wrapIndex(next, count) : clampIndex(next, count);

    if (target === index) {
      return;
    }

    settledIndex.current = target;
    snapTo(
      looping
        ? target + count * Math.round((scroll.value - target) / count)
        : target,
      false,
    );
    onSettleRef.current?.(target);
  };

  const currentLabel =
    count > 0 ? (items[index].label ?? String(items[index].value)) : '';

  return (
    <View
      className={className}
      style={[
        width === undefined ? { flex } : { width },
        { height: totalHeight },
        disabled && { opacity: 0.45 },
      ]}
      accessible={!disabled}
      accessibilityRole={disabled ? undefined : 'adjustable'}
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{
        text: suffix ? `${currentLabel} ${suffix}` : currentLabel,
      }}
      accessibilityState={{ disabled }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(event) => {
        const delta = event.nativeEvent.actionName === 'increment' ? 1 : -1;
        selectIndex(index + delta);
      }}
    >
      {/* Selection band: two hairlines mark the centred row. Columns sit side
          by side, so their lines join into one rule across the picker — a
          tinted pill per column would read as a row of separate boxes. */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: topPadding,
          left: 0,
          right: 0,
          height: itemHeight,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderColor: theme.colors.border,
        }}
      />

      <GestureDetector gesture={pan}>
        <View
          collapsable={false}
          style={{ height: totalHeight, overflow: 'hidden' }}
        >
          {rows.map((row) => (
            <WheelRow
              key={row.position}
              position={row.position}
              item={row.item}
              scroll={scroll}
              itemHeight={itemHeight}
              topPadding={topPadding}
              halfRows={halfRows}
              fadeEdges={fadeEdges}
              suffix={suffix}
            />
          ))}
        </View>
      </GestureDetector>
    </View>
  );
}
