import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { ScrollView } from 'react-native';

import { MosaicScreen, MosaicScreenHeader } from '@/components/mosaic';

export interface SettingsPageShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  /** Content pinned after the scroll body (e.g. a destructive page action) */
  footer?: ReactNode;
}

/** Shared frame for settings pages: self-inset glass header + scrolling body */
export function SettingsPageShell({
  title,
  subtitle,
  children,
  footer,
}: SettingsPageShellProps) {
  return (
    <MosaicScreen>
      <MosaicScreenHeader title={title} subtitle={subtitle} onBack={() => router.back()} />

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-5 px-[18px] pb-12 pt-2"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
        {footer}
      </ScrollView>
    </MosaicScreen>
  );
}
