import { useMemo } from 'react';
import { Platform } from 'react-native';
import { matchFont } from '@shopify/react-native-skia';

/**
 * Victory Native XL paints axis labels with Skia, so it needs a SkFont rather
 * than a React Native text style. `matchFont` resolves the system font, which
 * keeps the chart labels consistent with the rest of the app without shipping
 * an extra font asset.
 */
export function useChartFont(size = 10) {
  return useMemo(() => {
    try {
      return matchFont({
        fontFamily: Platform.select({
          ios: 'Helvetica',
          android: 'sans-serif',
          default: 'System',
        }),
        fontSize: size,
      });
    } catch {
      // Web / test environments may not provide a font manager. Charts still
      // render; only the axis captions are omitted.
      return null;
    }
  }, [size]);
}
