/* eslint-disable */
/**
 * Reanimated 4 pulls in react-native-worklets, whose native module is not
 * available under Jest. The menu only needs the declarative `entering` /
 * `exiting` presets, so a tiny stub keeps the tests focused on behaviour.
 *
 * The wheel drives its rows from a shared value, so the imperative half of the
 * API (shared values, animated styles, reactions, animations) is stubbed too.
 * Values are plain objects and animations resolve immediately, which is enough
 * to render and to exercise the accessibility / settle paths.
 */
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

require('react-native-gesture-handler/jestSetup');

jest.mock('react-native-reanimated', () => {
  const { Image, ScrollView, Text, View } = require('react-native');

  const createAnimation = () => {
    const animation = {
      duration: () => animation,
      withInitialValues: () => animation,
    };
    return animation;
  };
  const createAnimatedComponent = (Component) => Component;

  /** Linear interpolation with the end values held beyond the input range. */
  const interpolate = (value, input, output) => {
    if (input.length < 2) {
      return output[0];
    }

    if (value <= input[0]) {
      return output[0];
    }

    const last = input.length - 1;
    if (value >= input[last]) {
      return output[last];
    }

    for (let i = 1; i <= last; i += 1) {
      if (value <= input[i]) {
        const span = input[i] - input[i - 1];
        const t = span === 0 ? 0 : (value - input[i - 1]) / span;
        return output[i - 1] + t * (output[i] - output[i - 1]);
      }
    }

    return output[last];
  };

  const easing = (t) => t;

  return {
    __esModule: true,
    default: {
      createAnimatedComponent,
      Image,
      ScrollView,
      Text,
      View,
    },
    createAnimatedComponent,
    cancelAnimation: () => {},
    Easing: {
      linear: easing,
      quad: easing,
      cubic: easing,
      out: () => easing,
      in: () => easing,
      inOut: () => easing,
    },
    Extrapolation: { CLAMP: 'clamp', EXTEND: 'extend', IDENTITY: 'identity' },
    FadeIn: createAnimation(),
    FadeOut: createAnimation(),
    interpolate,
    runOnJS: (fn) => fn,
    setGestureState: () => {},
    useAnimatedReaction: () => {},
    useAnimatedStyle: (factory) => {
      try {
        return factory();
      } catch {
        return {};
      }
    },
    // Gesture Handler registers its native handlers through this hook.
    useEvent: () => () => {},
    useSharedValue: (initial) => ({ value: initial }),
    withSpring: (toValue) => toValue,
    withTiming: (toValue, _config, callback) => {
      callback?.(true);
      return toValue;
    },
    ZoomIn: createAnimation(),
    ZoomOut: createAnimation(),
  };
});
