import { useLocalSearchParams } from 'expo-router';

import { MeModuleScreen } from '@/features/me/MeModuleScreen';

export default function MeModuleRoute() {
  const { module } = useLocalSearchParams<{ module: string }>();

  return <MeModuleScreen moduleKey={module} />;
}
