import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';

import {
  MosaicButton,
  MosaicScreen,
  MosaicScreenHeader,
  MosaicText,
} from '@/components/mosaic';
import { useI18n } from '@/i18n/useI18n';

import type { MomentRecordDetailProps } from './MomentRecordDetail';
import { MomentRecordDetail } from './MomentRecordDetail';
import { findMomentRecord, getMomentMediaUris } from './mock';

export interface MomentDetailScreenProps extends Omit<
  MomentRecordDetailProps,
  'record'
> {
  /** Route param: the id of the moment to load. */
  recordId: string;
}

/** Moment detail page: upper half = moment content, lower half = comments (not implemented yet) */
export function MomentDetailScreen({
  recordId,
  mediaUris,
  user,
}: MomentDetailScreenProps) {
  const { t } = useI18n();
  // Route id → record. Swap the mock lookup for the real query later.
  const record = findMomentRecord(recordId);

  if (!record) {
    return (
      <MosaicScreen>
        <MosaicScreenHeader
          title={t('moment.title')}
          onBack={() => router.back()}
        />
        <View className="flex-1 items-center justify-center px-[18px]">
          <MosaicText variant="body" tone="text-muted">
            {t('moment.notFound')}
          </MosaicText>
        </View>
      </MosaicScreen>
    );
  }

  return (
    <MosaicScreen>
      <MosaicScreenHeader
        title={t('moment.title')}
        onBack={() => router.back()}
        actions={[
          <MosaicButton
            key="edit"
            size="md"
            variant="glass"
            onPress={() => {
              // TODO: enter edit mode
              router.push('/moment');
            }}
          >
            {t('moment.edit')}
          </MosaicButton>,
        ]}
      />

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[18px] pb-10 pt-2"
        showsVerticalScrollIndicator={false}
      >
        {/* Upper half: moment content */}
        <MomentRecordDetail
          record={record}
          mediaUris={mediaUris ?? getMomentMediaUris(record)}
          user={user}
        />

        {/* TODO: lower half: comments section (MomentDetailComments) not implemented yet */}
      </ScrollView>
    </MosaicScreen>
  );
}
