import { router } from 'expo-router';

import {
  CreateSheet,
  type CreateActionType,
  type CreateFormat,
} from './CreateSheet';

export function CreateScreen() {
  const handleAction = (
    action: CreateActionType,
    draft?: string,
    format?: CreateFormat,
    tags?: string[],
  ) => {
    if (action === 'moment') {
      router.replace('/moment');
      return;
    }
    if (action === 'text') {
      router.push({
        pathname: format === 'RICH_TEXT' ? '/diary-rich-text' : '/diary',
        params: {
          ...(draft ? { draft } : {}),
          ...(format ? { format } : {}),
          ...(tags?.length ? { tags: tags.join(',') } : {}),
        },
      });
      return;
    }
    console.log('create action:', action, draft, format, tags);
  };

  return (
    <CreateSheet
      visible
      onAction={handleAction}
      onClose={() => router.back()}
    />
  );
}
