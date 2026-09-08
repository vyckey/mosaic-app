import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useRef } from 'react';

import { MosaicIconButton } from '@/components/mosaic';
import { Icon } from '@/components/ui/icon';
import { useI18n } from '@/i18n/useI18n';

export function CreateButton() {
  const { t } = useI18n();
  const navigating = useRef(false);

  const handlePress = () => {
    if (navigating.current) return;
    navigating.current = true;
    router.push('/create');
    setTimeout(() => {
      navigating.current = false;
    }, 500);
  };

  return (
    <MosaicIconButton
      onPress={handlePress}
      variant="primary"
      size="xl"
      // The FAB floats above page content, so keep the drop shadow
      // (MosaicIconButton itself is flat); the pressed state comes from the
      // primary variant (bg-primary-strong).
      className="shadow-lg"
      accessibilityLabel={t('common.create')}
    >
      <Icon as={Plus} size="xl" className="text-primary-foreground" />
    </MosaicIconButton>
  );
}
