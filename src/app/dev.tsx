import { router } from 'expo-router';
import { ScrollView } from 'react-native';

import {
  MosaicButton,
  MosaicScreen,
  MosaicScreenHeader,
  MosaicText,
} from '@/components/mosaic';
import { useI18n } from '@/i18n/useI18n';

/** Prototype/dev-stage entry list for walking through screens one by one */
export default function DevScreen() {
  const { t } = useI18n();

  return (
    <MosaicScreen>
      <MosaicScreenHeader
        title={t('dev.title')}
        onBack={() => router.back()}
      />

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
    </MosaicScreen>
  );
}
