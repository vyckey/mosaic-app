import { Stack } from 'expo-router';

import { ProfileProvider } from '@/features/me/settings/profile-context';

export default function SettingsLayout() {
  return (
    <ProfileProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ProfileProvider>
  );
}
