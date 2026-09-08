import { VariableContextProvider } from 'nativewind';
import React, { useEffect } from 'react';
import { Appearance, useColorScheme, View, type ViewProps } from 'react-native';

import { OverlayProvider } from '@gluestack-ui/core/overlay/creator';
import { ToastProvider } from '@gluestack-ui/core/toast/creator';

import { darkTheme, lightTheme } from '@/theme';
import { toCssVariables } from './config';

export type ModeType = 'light' | 'dark' | 'system';

type Props = {
  mode?: ModeType;
  children?: React.ReactNode;
  style?: ViewProps['style'];
};

export function GluestackUIProvider({
  mode = 'system',
  children,
  style,
}: Props) {
  const systemColorScheme = useColorScheme();

  useEffect(() => {
    Appearance.setColorScheme(mode === 'system' ? 'unspecified' : mode);
  }, [mode]);

  const effectiveMode =
    mode === 'system'
      ? systemColorScheme === 'dark'
        ? 'dark'
        : 'light'
      : mode;

  const theme = effectiveMode === 'dark' ? darkTheme : lightTheme;

  return (
    <VariableContextProvider value={toCssVariables(theme)}>
      <View
        style={[
          {
            flex: 1,
            width: '100%',
            height: '100%',
          },
          style,
        ]}
      >
        <OverlayProvider>
          <ToastProvider>{children}</ToastProvider>
        </OverlayProvider>
      </View>
    </VariableContextProvider>
  );
}
