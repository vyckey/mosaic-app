import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';

export interface MosaicScreenProps {
  children: ReactNode;
  /**
   * Bottom-floating slot (e.g. a Composer). NOTE: with the liquid-glass tab bar
   * floating above the page bottom, anything here needs extra bottom offset
   * (safe-area + bar height) so it does not slide under the glass capsule.
   */
  floating?: ReactNode;
  /** Disable the default content padding when driving a custom layout */
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
    // Liquid-glass theme: the page canvas must stay opaque (`bg-background`) —
    // floating glass layers (tab bar capsule, header buttons) blur-sample this
    // content. A transparent screen would expose the window background and make
    // the glass look invisible/white.
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
