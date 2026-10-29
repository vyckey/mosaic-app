import type { ReactNode } from 'react';
import { View } from 'react-native';

export interface MosaicScreenProps {
  children: ReactNode;
  className?: string;
}

/**
 * Outermost page boundary: a full-bleed opaque canvas. Pages compose their own
 * header / scroller / body inside it.
 *
 * Liquid-glass theme: the canvas must stay opaque (`bg-background`) — floating
 * glass layers (tab bar capsule, header buttons) blur-sample this content. A
 * transparent screen would expose the window background and make the glass look
 * invisible/white.
 *
 * The top safe area is NOT the frame's job — each surface owns it where the
 * content actually starts: MosaicScreenHeader carries it for fixed headers,
 * and each scroller (page ScrollView, RecordsStream's FlashList) puts it on
 * its content container so content can scroll under the status bar.
 */
export function MosaicScreen({ children, className }: MosaicScreenProps) {
  return (
    <View className={['flex-1 bg-background', className].filter(Boolean).join(' ')}>
      {children}
    </View>
  );
}
