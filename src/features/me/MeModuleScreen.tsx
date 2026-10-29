import { router } from 'expo-router';
import { View } from 'react-native';

import { MosaicScreen, MosaicScreenHeader } from '@/components/mosaic';
import { useI18n } from '@/i18n/useI18n';

import { meModules } from './modules';

export interface MeModuleScreenProps {
  /** Module key from the route (`/me/<key>`) */
  moduleKey: string;
}

/**
 * Second-level page of a Me module.
 *
 * Prototype stage: only the header (with the module title and the back
 * button) is implemented — the body is intentionally blank until each module
 * gets its own content.
 */
export function MeModuleScreen({ moduleKey }: MeModuleScreenProps) {
  const { t } = useI18n();
  const module = meModules.find((item) => item.key === moduleKey);

  return (
    <MosaicScreen>
      <MosaicScreenHeader
        title={module ? t(module.labelKey) : ''}
        onBack={() => router.back()}
      />

      <View className="flex-1" />
    </MosaicScreen>
  );
}
