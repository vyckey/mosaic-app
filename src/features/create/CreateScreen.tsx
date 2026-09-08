// features/create/CreateScreen.tsx

import { router } from 'expo-router';

import { CreateSheet, type CreateActionType } from './CreateSheet';

export function CreateScreen() {
  const handleAction = (action: CreateActionType) => {
    switch (action) {
      case 'text':
        router.push('/create/text');
        break;

      case 'photo':
        router.push('/create/photo');
        break;

      case 'voice':
        router.push('/create/voice');
        break;

      case 'link':
        router.push('/create/link');
        break;
    }
  };

  return <CreateSheet onAction={handleAction} onClose={() => router.back()} />;
}
