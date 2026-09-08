import { useRef, type ComponentRef } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { BlurTargetView } from 'expo-blur';
import { router } from 'expo-router';

import { useTheme } from '@/hooks/use-theme';

import { AuthBlurProvider } from './components/auth-blur-context';
import { AuthFlow } from './components/AuthFlow';

interface BlobProps {
  /** Solid theme color (see note in LoginScreen) */
  color: string;
  /** Position in dp; give exactly one of `left` / `right` */
  top: number;
  left?: number;
  right?: number;
  size: number;
}

/** One pastel circle of the auth backdrop, drawn with explicit inline styles */
function Blob({ color, top, left, right, size }: BlobProps) {
  return (
    <View
      style={{
        position: 'absolute',
        top,
        left,
        right,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
      }}
    />
  );
}

export function LoginScreen() {
  const theme = useTheme();
  const handleComplete = () => {
    router.replace('/(tabs)/home');
  };

  // The decorative backdrop: picture the glass controls frost on Android
  const blurTargetRef = useRef<ComponentRef<typeof View>>(null);

  return (
    <View className="flex-1 bg-background">
      {/* Soft pastel blobs give the glass something to blur — glass only reads as
          glass when there is a picture behind it (design.md 5.2). Rendered with
          inline styles: className positioning/`rounded-full` proved unreliable
          on this NativeWind setup (blobs came out as sharp rectangles), while
          theme colors come straight from useTheme() — solid tokens only, since
          `<theme color>/<alpha>` compiles to color-mix, which NativeWind cannot
          evaluate on RN. */}
      <BlurTargetView
        ref={blurTargetRef}
        // Third-party components take style, not className (no cssInterop here)
        style={StyleSheet.absoluteFill}
      >
        {/* The canvas color must sit on a CHILD of BlurTargetView: expo-blur's
            Android BlurView captures the inner target child view, not the styled
            host wrapper — without this, blob-free areas sample the window's
            frame-clear background and smear white under dark mode. */}
        <View
          pointerEvents="none"
          style={[styles.blobLayer, { backgroundColor: theme.colors.background }]}
        >
          {/* Sage wash behind the title / right of the field */}
          <Blob color={theme.colors.primaryMuted} top={110} right={-100} size={300} />
          {/* Lavender wash behind the field and the left of the CTA */}
          <Blob color={theme.colors.accentLavMuted} top={320} left={-110} size={350} />
          {/* Clay wash behind the agreement row and social sign-in */}
          <Blob color={theme.colors.warningMuted} top={500} right={-70} size={300} />
          {/* Small saturated sage dot for a touch of depth */}
          <Blob color={theme.colors.primarySoft} top={155} left={40} size={56} />
        </View>
      </BlurTargetView>

      <AuthBlurProvider target={blurTargetRef}>
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            className="flex-1"
            contentContainerClassName="flex-1"
            keyboardShouldPersistTaps="handled"
          >
            <AuthFlow onComplete={handleComplete} />
          </ScrollView>
        </KeyboardAvoidingView>
      </AuthBlurProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  /** Full-screen layer the blobs are positioned against */
  blobLayer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
});
