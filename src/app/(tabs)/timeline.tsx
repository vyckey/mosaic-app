import { MosaicButton } from '@/components/mosaic/MosaicButton';
import { ButtonText } from '@/components/ui/button';
import { useI18n } from '@/i18n/useI18n';
import { Text, View } from 'react-native';

export default function TimelineScreen() {
  const { t } = useI18n();

  return (
    <View className="flex-1 bg-background items-center justify-center">
      <Text className="text-text text-2xl font-bold">时间线</Text>
      <MosaicButton>
        <ButtonText>{t('common.save')}</ButtonText>
      </MosaicButton>
    </View>
  );
}
