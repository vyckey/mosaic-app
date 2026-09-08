import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ExternalLink } from '@/components/external-link';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/layout';
import { darkTheme, lightTheme } from '@/theme';

function rgb(value: string) {
  return `rgb(${value})`;
}

export default function ExploreScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const colorScheme = useColorScheme();

  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
    web: {
      paddingTop: Spacing.six,
      paddingBottom: Spacing.four,
    },
  });

  return (
    <ScrollView
      style={[
        styles.scrollView,
        {
          backgroundColor: rgb(theme.colors.background),
        },
      ]}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}
    >
      <ThemedView className="flex-1 bg-background" style={styles.container}>
        <ThemedView className="bg-background" style={styles.titleContainer}>
          <ThemedText className="text-2xl font-semibold text-foreground">
            Explore{' '}
          </ThemedText>
          <ThemedText
            className="text-sm text-muted-foreground"
            style={styles.centerText}
          >
            This starter app includes example{'\n'}
            code to help you get started.
          </ThemedText>
          <ExternalLink href="https://docs.expo.dev" asChild>
            <Pressable style={({ pressed }) => pressed && styles.pressed}>
              <ThemedView className="bg-card" style={styles.linkButton}>
                <ThemedText className="text-sm font-medium text-primary">
                  Expo documentation
                </ThemedText>

                <SymbolView
                  tintColor={rgb(theme.colors.primaryForeground)}
                  name={{
                    ios: 'arrow.up.right.square',
                    android: 'link',
                    web: 'link',
                  }}
                  size={12}
                />
              </ThemedView>
            </Pressable>
          </ExternalLink>
        </ThemedView>
        <ThemedView className="bg-background" style={styles.sectionsWrapper}>
          <Collapsible title="File-based routing">
            <ThemedText className="text-sm text-foreground">
              This app has two screens:{' '}
              <ThemedText className="font-mono text-muted-foreground">
                src/app/index.tsx
              </ThemedText>{' '}
              and{' '}
              <ThemedText className="font-mono text-muted-foreground">
                src/app/explore.tsx
              </ThemedText>
            </ThemedText>

            <ThemedText className="text-sm text-foreground">
              The layout file in{' '}
              <ThemedText className="font-mono text-muted-foreground">
                src/app/_layout.tsx
              </ThemedText>{' '}
              sets up the tab navigator.
            </ThemedText>

            <ExternalLink href="https://docs.expo.dev/router/introduction">
              <ThemedText className="text-sm font-medium text-primary">
                Learn more
              </ThemedText>
            </ExternalLink>
          </Collapsible>

          <Collapsible title="Android, iOS, and web support">
            <ThemedView className="bg-card" style={styles.collapsibleContent}>
              <ThemedText className="text-sm text-foreground">
                You can open this project on Android, iOS, and the web. To open
                the web version, press{' '}
                <ThemedText className="font-semibold text-primary">
                  w
                </ThemedText>{' '}
                in the terminal running this project.
              </ThemedText>

              <Image
                source={require('@assets/images/tutorial-web.png')}
                style={styles.imageTutorial}
              />
            </ThemedView>
          </Collapsible>

          <Collapsible title="Images">
            <ThemedText className="text-sm text-foreground">
              For static images, you can use the{' '}
              <ThemedText className="font-mono text-muted-foreground">
                @2x
              </ThemedText>{' '}
              and{' '}
              <ThemedText className="font-mono text-muted-foreground">
                @3x
              </ThemedText>{' '}
              suffixes to provide files for different screen densities.
            </ThemedText>

            <Image
              source={require('@assets/images/react-logo.png')}
              style={styles.imageReact}
            />

            <ExternalLink href="https://reactnative.dev/docs/images">
              <ThemedText className="text-sm font-medium text-primary">
                Learn more
              </ThemedText>
            </ExternalLink>
          </Collapsible>

          <Collapsible title="Light and dark mode components">
            <ThemedText className="text-sm text-foreground">
              This template has light and dark mode support. The{' '}
              <ThemedText className="font-mono text-muted-foreground">
                useColorScheme()
              </ThemedText>{' '}
              hook lets you inspect what the user&apos;s current color scheme
              is, and so you can adjust UI colors accordingly.
            </ThemedText>

            <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
              <ThemedText className="text-sm font-medium text-primary">
                Learn more
              </ThemedText>
            </ExternalLink>
          </Collapsible>

          <Collapsible title="Animations">
            <ThemedText className="text-sm text-foreground">
              This template includes an example of an animated component. The{' '}
              <ThemedText className="font-mono text-muted-foreground">
                src/components/ui/collapsible.tsx
              </ThemedText>{' '}
              component uses the powerful{' '}
              <ThemedText className="font-mono text-muted-foreground">
                react-native-reanimated
              </ThemedText>{' '}
              library to animate opening this hint.
            </ThemedText>
          </Collapsible>
        </ThemedView>
        {Platform.OS === 'web' && <WebBadge />}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },

  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  container: {
    maxWidth: MaxContentWidth,
    flexGrow: 1,
  },

  titleContainer: {
    gap: Spacing.three,
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.six,
  },

  centerText: {
    textAlign: 'center',
  },

  pressed: {
    opacity: 0.7,
  },

  linkButton: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.five,
    justifyContent: 'center',
    gap: Spacing.one,
    alignItems: 'center',
  },

  sectionsWrapper: {
    gap: Spacing.five,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
  },

  collapsibleContent: {
    alignItems: 'center',
  },

  imageTutorial: {
    width: '100%',
    aspectRatio: 296 / 171,
    borderRadius: Spacing.three,
    marginTop: Spacing.two,
  },

  imageReact: {
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
});
