import * as Device from 'expo-device';
import { Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedIcon } from '@/components/animated-icon';
import { HintRow } from '@/components/hint-row';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/layout';

function getDevMenuHint() {
  if (Platform.OS === 'web') {
    return (
      <ThemedText className="text-foreground">use browser devtools</ThemedText>
    );
  }

  if (Device.isDevice) {
    return (
      <ThemedText className="text-foreground">
        shake device or press{' '}
        <ThemedText className="font-mono text-muted-foreground">m</ThemedText>{' '}
        in terminal
      </ThemedText>
    );
  }

  const shortcut = Platform.OS === 'android' ? 'cmd+m (or ctrl+m)' : 'cmd+d';

  return (
    <ThemedText className="text-foreground">
      press{' '}
      <ThemedText className="font-mono text-muted-foreground">
        {shortcut}
      </ThemedText>
    </ThemedText>
  );
}

export default function HomeScreen() {
  return (
    <ThemedView className="flex-1 bg-background" style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView className="bg-background" style={styles.heroSection}>
          <AnimatedIcon />

          <ThemedText
            className="text-4xl font-bold text-foreground"
            style={styles.title}
          >
            Welcome to Expo
          </ThemedText>
        </ThemedView>

        <ThemedText
          className="font-mono text-muted-foreground"
          style={styles.code}
        >
          get started
        </ThemedText>

        <ThemedView
          className="bg-card border border-border"
          style={styles.stepContainer}
        >
          <HintRow
            title="Try editing"
            hint={
              <ThemedText className="font-mono text-muted-foreground">
                src/app/index.tsx
              </ThemedText>
            }
          />

          <HintRow title="Dev tools" hint={getDevMenuHint()} />

          <HintRow
            title="Fresh start"
            hint={
              <ThemedText className="font-mono text-muted-foreground">
                npm run reset-project
              </ThemedText>
            }
          />
        </ThemedView>

        {Platform.OS === 'web' && <WebBadge />}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    textAlign: 'center',
  },
  code: {
    textTransform: 'uppercase',
  },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: 'stretch',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
});
