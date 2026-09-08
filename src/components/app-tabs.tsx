import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useColorScheme } from 'react-native';

import { darkTheme, lightTheme } from '@/theme';

function rgb(value: string) {
  return `rgb(${value})`;
}

export default function AppTabs() {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;

  return (
    <NativeTabs
      backgroundColor={rgb(theme.background)}
      indicatorColor={rgb(theme.secondary)}
      labelStyle={{
        selected: {
          color: rgb(theme.primary),
        },
      }}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>

        <NativeTabs.Trigger.Icon
          src={require('@assets/images/tabIcons/home.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="explore">
        <NativeTabs.Trigger.Label>Explore</NativeTabs.Trigger.Label>

        <NativeTabs.Trigger.Icon
          src={require('@assets/images/tabIcons/explore.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
