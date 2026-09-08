import { BlurTargetView } from 'expo-blur';
import { TabList, Tabs, TabSlot, TabTrigger } from 'expo-router/ui';
import { useRef, type ComponentRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useI18n } from '@/i18n/useI18n';

import { AppTab } from '@/components/app-tabs/AppTab';
import { CreateButton } from '@/components/app-tabs/CreateButton';
import { MosaicGlass } from '@/components/mosaic';

/**
 * Floating glass tab bar height — keep in sync with the capsule's `h-16`
 * className below (NativeWind class names must stay static literals).
 */
const BAR_HEIGHT = 64;

/** Gap between the bar and the screen bottom (excluding safe area) */
const BAR_BOTTOM_GAP = 12;

/** Horizontal margin of the bar from the screen edges */
const BAR_HORIZONTAL_MARGIN = 16;

/** Gap between the glass capsule and the create button */
const BAR_GAP = 12;

/** Create button size (h-16 w-16), matched to the bar height */
const CREATE_BUTTON_SIZE = 64;

export default function AppTabs() {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();

  // Android blur sampling target: wraps the page content the glass bar blurs
  const blurTargetRef = useRef<ComponentRef<typeof View>>(null);

  const bottomOffset = insets.bottom + BAR_BOTTOM_GAP;

  return (
    <Tabs>
      {/* Page content fills the screen (Android blur sampling target); the glass bar floats above it */}
      <BlurTargetView ref={blurTargetRef} style={styles.blurTarget}>
        <TabSlot />
      </BlurTargetView>

      {/*
        Floating liquid glass capsule (four tabs).
        Note: expo-router's Tabs only recurses Fragment / TabList chains from its
        direct children to resolve TabTriggers, so TabList must stay a direct child
        of Tabs; use asChild to let MosaicGlass act as the TabList container.
      */}
      <TabList asChild>
        <MosaicGlass
          className="h-16 flex-row items-center"
          style={{
            position: 'absolute',
            left: BAR_HORIZONTAL_MARGIN,
            right: BAR_HORIZONTAL_MARGIN + CREATE_BUTTON_SIZE + BAR_GAP,
            bottom: bottomOffset,
            borderRadius: BAR_HEIGHT / 2,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: 'rgba(255,255,255,0.55)',
            // Android elevation shadow (follows borderRadius)
            elevation: 8,
            // iOS shadow (may be clipped under overflow:hidden; iOS 26 native glass brings its own depth)
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.18,
            shadowRadius: 16,
          }}
          variant="regular"
          blurIntensity={60}
          blurTarget={blurTargetRef}
        >
          <TabTrigger name="index" href="/home" asChild>
            <AppTab name="home" label={t('tab.home')} />
          </TabTrigger>

          <TabTrigger name="records" href="/records" asChild>
            <AppTab name="records" label={t('tab.records')} />
          </TabTrigger>

          <TabTrigger name="chat" href="/chat" asChild>
            <AppTab name="chat" label={t('tab.chat')} />
          </TabTrigger>

          <TabTrigger name="me" href="/me" asChild>
            <AppTab name="me" label={t('tab.me')} />
          </TabTrigger>
        </MosaicGlass>
      </TabList>

      {/* Create button: floats standalone on the far right */}
      <View
        pointerEvents="box-none"
        style={{
          position: 'absolute',
          right: BAR_HORIZONTAL_MARGIN,
          bottom: bottomOffset,
        }}
      >
        <CreateButton />
      </View>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  blurTarget: {
    flex: 1,
  },
});
