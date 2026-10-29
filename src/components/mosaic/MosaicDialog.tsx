import {
  createContext,
  useContext,
  useMemo,
  type FC,
  type ReactNode,
} from 'react';
import { Modal, Pressable, View, type DimensionValue } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n/useI18n';

import { MosaicButton, type MosaicButtonProps } from './MosaicButton';
import { glassRimStyle, MosaicGlass } from './MosaicGlass';
import { MosaicText } from './MosaicText';

/** Props accepted by the default `OkBtn` / `CancelBtn` handed to `footer`. */
export interface MosaicDialogActionProps extends Omit<
  MosaicButtonProps,
  'variant' | 'onPress'
> {
  /** Replaces the default action (close for Cancel, confirm for Ok). */
  onPress?: () => void;
}

/** The default action buttons, exposed so a render footer can arrange them. */
export interface MosaicDialogFooterExtra {
  /** Primary confirm button; calls `onConfirm`, falling back to `onClose`. */
  OkBtn: FC<MosaicDialogActionProps>;
  /** Secondary button that closes the dialog. */
  CancelBtn: FC<MosaicDialogActionProps>;
}

/**
 * Footer content:
 *
 * - omitted → the default Cancel / Ok row
 * - `null` → no footer at all
 * - a node → replaces the row, still pinned below the content
 * - a function → receives the default row and the two buttons, so it can
 *   re-order them, split them, or keep only one
 */
export type MosaicDialogFooter =
  | ReactNode
  | ((originNode: ReactNode, extra: MosaicDialogFooterExtra) => ReactNode);

/** Actions the default buttons read from context; keeps their identity stable. */
interface DialogActions {
  close?: () => void;
  confirm: () => void;
}

const DialogActionsContext = createContext<DialogActions | null>(null);

const useDialogActions = (): DialogActions =>
  useContext(DialogActionsContext) ?? { confirm: () => {} };

const CancelBtn: FC<MosaicDialogActionProps> = ({
  onPress,
  children,
  ...props
}) => {
  const { close } = useDialogActions();
  const { t } = useI18n();

  return (
    <MosaicButton
      variant="secondary"
      className="flex-1"
      onPress={onPress ?? close}
      {...props}
    >
      {children ?? t('common.cancel')}
    </MosaicButton>
  );
};

const OkBtn: FC<MosaicDialogActionProps> = ({
  onPress,
  children,
  ...props
}) => {
  const { confirm } = useDialogActions();
  const { t } = useI18n();

  return (
    <MosaicButton
      variant="primary"
      className="flex-1"
      onPress={onPress ?? confirm}
      {...props}
    >
      {children ?? t('common.confirm')}
    </MosaicButton>
  );
};

/** Stable identity for the `extra` argument across renders. */
const FOOTER_EXTRA: MosaicDialogFooterExtra = { OkBtn, CancelBtn };

export interface MosaicDialogProps {
  visible: boolean;
  onClose?: () => void;
  /**
   * Fired by the default `OkBtn`. The dialog does not close itself — flip
   * `visible` here (or call `onClose`) to dismiss it. When omitted, Ok falls
   * back to `onClose`.
   */
  onConfirm?: () => void;
  title?: string;
  children: ReactNode;
  /** @see MosaicDialogFooter */
  footer?: MosaicDialogFooter;
  /**
   * Width cap on tablets and web; the dialog always fits narrow screens.
   * Accepts px (`400`) or a percentage of the available width (`'80%'`).
   */
  maxWidth?: DimensionValue;
  className?: string;
}

/**
 * Centred dialog for short, focused choices — a wheel, a confirmation, a small
 * form. It shares the sheet's glass chrome but stays in the middle of the
 * screen, so it never competes with content the user is still looking at.
 *
 * The footer defaults to a Cancel / Ok row; pass `footer={null}` for a dialog
 * without actions, or a render function to arrange the default buttons:
 *
 * ```tsx
 * <MosaicDialog
 *   footer={(_, { OkBtn, CancelBtn }) => (
 *     <View className="flex-row-reverse gap-2.5">
 *       <OkBtn className="flex-none px-6" />
 *       <CancelBtn />
 *     </View>
 *   )}
 * >
 *   …
 * </MosaicDialog>
 * ```
 *
 * Unlike `MosaicSheet` the dialog does not scroll: keep the content short, or
 * put a scroll container inside it.
 */
export function MosaicDialog({
  visible,
  onClose,
  onConfirm,
  title,
  children,
  footer,
  maxWidth = 400,
  className,
}: MosaicDialogProps) {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const { t } = useI18n();

  const actions = useMemo<DialogActions>(
    () => ({
      close: onClose,
      confirm: () => (onConfirm ?? onClose)?.(),
    }),
    [onClose, onConfirm],
  );

  const originNode = (
    <View className="flex-row gap-2.5">
      <CancelBtn />
      <OkBtn />
    </View>
  );

  const resolvedFooter =
    footer === undefined
      ? originNode
      : typeof footer === 'function'
        ? footer(originNode, FOOTER_EXTRA)
        : footer;

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
        <View className="flex-1 items-center justify-center px-[16px]">
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

            {/* No close button: the backdrop already dismisses the dialog, and
                a button beside a short title just crowds it. */}
            {title && (
              <MosaicText
                variant="subtitle"
                weight="600"
                className="mb-3 text-center"
              >
                {title}
              </MosaicText>
            )}

            {children}

            <DialogActionsContext.Provider value={actions}>
              {resolvedFooter != null && (
                <View className="mt-4">{resolvedFooter}</View>
              )}
            </DialogActionsContext.Provider>
          </View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}
