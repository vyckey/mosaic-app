import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';

import '@/global.css';
import { I18nProvider } from '@/i18n/context';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GluestackUIProvider mode="system">
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <AnimatedSplashOverlay />

          <I18nProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen
                name="create"
                options={{
                  headerShown: false,
                  presentation: 'transparentModal',
                  animation: 'slide_from_bottom',
                }}
              />

              <Stack.Screen name="dev" />
            </Stack>
          </I18nProvider>
        </ThemeProvider>
      </GluestackUIProvider>
    </GestureHandlerRootView>
  );
}
