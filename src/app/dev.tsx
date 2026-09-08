import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MosaicButton, MosaicScreenHeader, MosaicText } from '@/components/mosaic';
import { useI18n } from '@/i18n/useI18n';

/** 原型/开发期的页面入口集合，便于逐页走查 UI */
export default function DevScreen() {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background">
      <View
        className="min-h-11 flex-row items-center px-2"
        style={{ paddingTop: insets.top + 4 }}
      >
        <MosaicScreenHeader
          title={t('dev.title')}
          onBack={() => router.back()}
          className="flex-1"
        />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[18px] pb-10 pt-2"
        showsVerticalScrollIndicator={false}
      >
        <MosaicText variant="caption" tone="text-muted" className="mb-2 mt-4">
          {t('dev.moment')}
        </MosaicText>
        <MosaicButton
          variant="secondary"
          className="mb-2.5 w-full"
          onPress={() => router.push('/moment-detail')}
        >
          {t('dev.momentDetail')}
        </MosaicButton>
        <MosaicButton
          variant="secondary"
          className="w-full"
          onPress={() => router.push('/moment')}
        >
          {t('dev.momentEdit')}
        </MosaicButton>
      </ScrollView>
    </View>
  );
}
