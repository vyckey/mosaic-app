import { useLocalSearchParams } from 'expo-router';

import { LifeEventDetailScreen } from '@/features/me/life-events/LifeEventDetailScreen';

export default function LifeEventDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <LifeEventDetailScreen eventId={id} />;
}
