import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MosaicButton, MosaicScreenHeader } from '@/components/mosaic';
import { useI18n } from '@/i18n/useI18n';

import { MomentRecordDetail } from './MomentRecordDetail';
import type { MomentRecordDetailProps } from './MomentRecordDetail';

export type MomentDetailScreenProps = MomentRecordDetailProps;

/** Moment detail page: upper half = moment content, lower half = comments (not implemented yet) */
export function MomentDetailScreen({
  record,
  mediaUris,
  user,
}: MomentDetailScreenProps) {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background">
      <View
        className="min-h-11 flex-row items-center px-2"
        style={{ paddingTop: insets.top + 4 }}
      >
        <MosaicScreenHeader
          title={t('moment.title')}
          onBack={() => router.back()}
          actions={
            <MosaicButton
              size="sm"
              variant="glass"
              onPress={() => {
                // TODO: enter edit mode
                router.push('/moment');
              }}
            >
              {t('moment.edit')}
            </MosaicButton>
          }
          className="flex-1"
        />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[18px] pb-10 pt-2"
        showsVerticalScrollIndicator={false}
      >
        {/* Upper half: moment content */}
        <MomentRecordDetail
          record={record}
          mediaUris={mediaUris}
          user={user}
        />

        {/* TODO: lower half: comments section (MomentDetailComments) not implemented yet */}
      </ScrollView>
    </View>
  );
}
