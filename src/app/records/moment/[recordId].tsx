import { useLocalSearchParams } from 'expo-router';

import { MomentDetailScreen } from '@/features/records/moment/MomentDetailScreen';

export default function MomentDetailRoute() {
  const { recordId } = useLocalSearchParams<{ recordId: string }>();

  return <MomentDetailScreen recordId={recordId} />;
}
