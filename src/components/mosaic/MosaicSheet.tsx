import { BlurView } from 'expo-blur';
import { X } from 'lucide-react-native';
import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  useWindowDimensions,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Icon } from '@/components/ui/icon';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n/useI18n';

import { glassRimStyle, MosaicGlass } from './MosaicGlass';
import { MosaicIconButton } from './MosaicIconButton';
import { MosaicText } from './MosaicText';

export interface MosaicSheetProps {
  visible: boolean;
  onClose?: () => void;
  /** Renders a header row (title + close button) when provided */
  title?: string;
  /** Custom node rendered at the end of the header row (replaces the close button) */
  headerRight?: ReactNode;
  /** Footer actions, pinned below the scroll area */
  footer?: ReactNode;
  children: ReactNode;
  /** Drag handle above the header; shown by default */
  showHandle?: boolean;
  /** Scroll when content overflows; on by default */
  scrollable?: boolean;
  className?: string;
}

/**
 * Bottom sheet matching the prototype `.modal + .sheet`: a panel rising from
 * the bottom of the screen, based on RN Modal with no extra dependencies.
 *
 * Liquid-glass surface: the panel has no solid background — an absolute
 * `MosaicGlass` layer sits behind the content, so the sheet frosts whatever is
 * behind it (MosaicGlass platform tiers: iOS 26 native glass → blur → veil).
 * On Android the modal window has no blur sampling target, so the glass
 * degrades to a translucent veil over the scrim below.
 */
export function MosaicSheet({
  visible,
  onClose,
  title,
  headerRight,
  footer,
  children,
  showHandle = true,
  scrollable = true,
  className,
}: MosaicSheetProps) {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const { t } = useI18n();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <GestureHandlerRootView className="flex-1">
        <View className="flex-1 justify-end">
          <BlurView intensity={20} tint="dark" className="absolute inset-0" />
          {/* expo-blur is a no-op on Android without a blur target; add a scrim so the glass panel keeps contrast */}
          {Platform.OS === 'android' && (
            <View className="absolute inset-0 bg-black/25" />
          )}
          <Pressable
            onPress={onClose}
            accessibilityLabel={t('common.close')}
            className="absolute inset-0"
          />

          <KeyboardAvoidingView behavior="padding" className="w-full">
            <View
              className={[
                'w-full rounded-t-sheet px-[18px] pb-10 pt-3',
                className,
              ]
                .filter(Boolean)
                .join(' ')}
              style={{ maxHeight: useWindowDimensions().height * 0.8 }}
            >
              {/* Liquid-glass sheet surface: hairline rim + floating shadow define the edge.
                  The tint leans opaque so sheet content does not visually collide with the background */}
              <MosaicGlass
                className="absolute inset-0 rounded-t-sheet"
                style={[glassRimStyle, theme.shadows.sheet]}
                tintColor={
                  colorScheme === 'dark'
                    ? 'rgba(28,28,30,0.88)'
                    : 'rgba(252,253,248,0.88)'
                }
              />

              {showHandle && (
                <View className="mx-auto mb-4 h-[5px] w-11 rounded-full bg-primary-soft" />
              )}

              {title && (
                <View className="mb-3 flex-row items-center justify-between">
                  <MosaicText variant="title" tone="text" weight="600">
                    {title}
                  </MosaicText>
                  {headerRight
                    ? headerRight
                    : onClose && (
                        <MosaicIconButton
                          variant="glass"
                          size="md"
                          onPress={onClose}
                          accessibilityLabel={t('common.close')}
                        >
                          <Icon as={X} size="sm" className="text-text-muted" />
                        </MosaicIconButton>
                      )}
                </View>
              )}

              {scrollable ? (
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                >
                  {children}
                </ScrollView>
              ) : (
                children
              )}

              {footer && <View className="pt-3">{footer}</View>}
            </View>
          </KeyboardAvoidingView>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}
