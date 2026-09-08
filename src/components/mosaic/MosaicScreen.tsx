import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';

export interface MosaicScreenProps {
  children: ReactNode;
  /** 底部悬浮元素（如 Composer） */
  floating?: ReactNode;
  /** 禁用内边距（自定义布局时使用） */
  disablePadding?: boolean;
  className?: string;
  contentClassName?: string;
}

export function MosaicScreen({
  children,
  floating,
  disablePadding = false,
  className,
  contentClassName,
}: MosaicScreenProps) {
  return (
    <View className={['flex-1 bg-background', className].filter(Boolean).join(' ')}>
      <ScrollView
        className="flex-1"
        contentContainerClassName={[
          disablePadding ? '' : 'px-[18px] pb-40 pt-2',
          contentClassName,
        ]
          .filter(Boolean)
          .join(' ')}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>

      {floating && (
        <View className="absolute bottom-0 left-0 right-0 px-3 pb-6">
          {floating}
        </View>
      )}
    </View>
  );
}
