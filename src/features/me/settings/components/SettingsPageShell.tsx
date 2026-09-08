import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { MosaicScreenHeader } from '@/components/mosaic';

export interface SettingsPageShellProps {
  title: string;
  children: ReactNode;
}

export function SettingsPageShell({ title, children }: SettingsPageShellProps) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background">
      <View
        className="min-h-11 flex-row items-center px-2"
        style={{ paddingTop: insets.top + 4 }}
      >
        <MosaicScreenHeader
          title={title}
          onBack={() => router.back()}
          className="flex-1"
        />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[18px] pb-10 pt-2"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </View>
  );
}
