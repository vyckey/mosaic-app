import { X } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Icon } from '@/components/ui/icon';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n/useI18n';

import { glassRimStyle, MosaicGlass } from './MosaicGlass';
import { MosaicIconButton } from './MosaicIconButton';
import { MosaicText } from './MosaicText';

export interface MosaicDialogProps {
  visible: boolean;
  onClose?: () => void;
  title?: string;
  children: ReactNode;
  /** Pinned actions below the content, usually a row of buttons. */
  footer?: ReactNode;
  /** Width cap on tablets and web; the dialog always fits narrow screens. */
  maxWidth?: number;
  className?: string;
}

/**
 * Centred dialog for short, focused choices — a wheel, a confirmation, a small
 * form. It shares the sheet's glass chrome but stays in the middle of the
 * screen, so it never competes with content the user is still looking at.
 *
 * Unlike `MosaicSheet` the dialog does not scroll: keep the content short, or
 * put a scroll container inside it.
 */
export function MosaicDialog({
  visible,
  onClose,
  title,
  children,
  footer,
  maxWidth = 400,
  className,
}: MosaicDialogProps) {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const { t } = useI18n();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Gestures inside a modal need their own handler root on Android. */}
      <GestureHandlerRootView className="flex-1">
        <View className="flex-1 items-center justify-center px-[18px]">
          {/* Dimmed backdrop; tapping outside dismisses, like a native alert. */}
          <Pressable
            onPress={onClose}
            accessibilityLabel={t('common.close')}
            className="absolute inset-0 bg-black/30"
          />

          <View
            className={[
              'w-full overflow-hidden rounded-card px-[18px] pb-4 pt-4',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
            style={{ maxWidth, ...theme.shadows.popover }}
          >
            <MosaicGlass
              className="absolute inset-0 rounded-card"
              style={glassRimStyle}
              tintColor={
                colorScheme === 'dark'
                  ? 'rgba(28,28,30,0.94)'
                  : 'rgba(252,253,248,0.94)'
              }
            />

            {title && (
              <View className="mb-3 flex-row items-center justify-between">
                <MosaicText variant="subtitle" weight="600" className="flex-1">
                  {title}
                </MosaicText>
                {onClose && (
                  <MosaicIconButton
                    variant="glass"
                    size="sm"
                    onPress={onClose}
                    accessibilityLabel={t('common.close')}
                  >
                    <Icon as={X} size="2xs" className="text-text-muted" />
                  </MosaicIconButton>
                )}
              </View>
            )}

            {children}

            {footer && <View className="mt-4">{footer}</View>}
          </View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}
