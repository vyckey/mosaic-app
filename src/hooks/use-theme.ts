/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { darkTheme, lightTheme, type MosaicTheme } from "@/theme";

import { useColorScheme } from "@/hooks/use-color-scheme";

export function useTheme(): MosaicTheme {
  const scheme = useColorScheme();

  return scheme === "dark" ? darkTheme : lightTheme;
}
