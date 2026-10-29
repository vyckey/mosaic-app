import { router } from 'expo-router';
import { ScrollView } from 'react-native';

import {
  MosaicButton,
  MosaicScreen,
  MosaicScreenHeader,
} from '@/components/mosaic';
import { useI18n } from '@/i18n/useI18n';

import type { MomentRecordDetailProps } from './MomentRecordDetail';
import { MomentRecordDetail } from './MomentRecordDetail';

export type MomentDetailScreenProps = MomentRecordDetailProps;

/** Moment detail page: upper half = moment content, lower half = comments (not implemented yet) */
export function MomentDetailScreen({
  record,
  mediaUris,
  user,
}: MomentDetailScreenProps) {
  const { t } = useI18n();

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
        <MomentRecordDetail record={record} mediaUris={mediaUris} user={user} />

        {/* TODO: lower half: comments section (MomentDetailComments) not implemented yet */}
      </ScrollView>
    </MosaicScreen>
  );
}
