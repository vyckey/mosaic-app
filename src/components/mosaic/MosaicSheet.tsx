import { BlurView } from 'expo-blur';
import { X } from 'lucide-react-native';
import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Pressable,
  ScrollView,
  useWindowDimensions,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Icon } from '@/components/ui/icon';
import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n/useI18n';

import { MosaicIconButton } from './MosaicIconButton';
import { MosaicText } from './MosaicText';

export interface MosaicSheetProps {
  visible: boolean;
  onClose?: () => void;
  /** 传入即显示头部标题 + 关闭按钮（原型「记下这一刻 ✕」） */
  title?: string;
  /** 头部右侧自定义操作；提供时替换默认关闭按钮（渲染在滚动区外） */
  headerRight?: ReactNode;
  /** 页脚操作区（渲染在滚动区外，固定于底部） */
  footer?: ReactNode;
  children: ReactNode;
  /** 顶部拖拽把手，默认显示（原型 .handle） */
  showHandle?: boolean;
  /** 内容超高时滚动，默认开启 */
  scrollable?: boolean;
  className?: string;
}

/**
 * 对应原型 .modal + .sheet：从底部升起的弹层。
 * 基于 RN Modal，无额外依赖；后续如需手势拖拽可平滑替换为
 * `npx gluestack-ui@latest add dialog` 生成的组件。
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
          <Pressable
            onPress={onClose}
            accessibilityLabel={t('common.close')}
            className="absolute inset-0"
          />

          <KeyboardAvoidingView behavior="padding" className="w-full">
            <View
              className={[
                'w-full rounded-t-sheet bg-surface px-[18px] pb-10 pt-3',
                className,
              ]
                .filter(Boolean)
                .join(' ')}
              style={[
                { maxHeight: useWindowDimensions().height * 0.8 },
                theme.shadows.sheet,
              ]}
            >
              {showHandle && (
                <View className="mx-auto mb-4 h-[5px] w-11 rounded-full bg-primary-soft" />
              )}

              {title && (
                <View className="mb-3 flex-row items-center justify-between">
                  <MosaicText variant="title" tone="text" weight="600">
                    {title}
                  </MosaicText>
                  {headerRight ? (
                    headerRight
                  ) : (
                    onClose && (
                      <MosaicIconButton
                        variant="soft"
                        size="md"
                        onPress={onClose}
                        accessibilityLabel={t('common.close')}
                      >
                        <Icon as={X} size="sm" className="text-text-muted" />
                      </MosaicIconButton>
                    )
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
