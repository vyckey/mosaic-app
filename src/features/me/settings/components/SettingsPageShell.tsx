import type { ReactNode } from 'react';
import { ScrollView } from 'react-native';
import { router } from 'expo-router';

import { MosaicScreen, MosaicScreenHeader } from '@/components/mosaic';

export interface SettingsPageShellProps {
  title: string;
  children: ReactNode;
}

/** Shared frame for settings sub-pages: self-inset glass header + scrolling body */
export function SettingsPageShell({ title, children }: SettingsPageShellProps) {
  return (
    <MosaicScreen>
      <MosaicScreenHeader
        title={title}
        onBack={() => router.back()}
      />

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[18px] pb-10 pt-2"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </MosaicScreen>
  );
}
