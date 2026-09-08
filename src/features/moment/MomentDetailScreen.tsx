import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MosaicButton, MosaicScreenHeader } from '@/components/mosaic';
import { useI18n } from '@/i18n/useI18n';

import { MomentDetailView } from './MomentDetailView';
import type { MomentDetailViewProps } from './MomentDetailView';

export type MomentDetailScreenProps = MomentDetailViewProps;

/** Moment 展示页：上半部分为 Moment 内容，下半部分为评论区（评论暂未实现） */
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
          right={
            <MosaicButton
              size="sm"
              variant="ghost"
              onPress={() => {
                // TODO: 进入编辑模式
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
        {/* 上半部分：瞬间内容 */}
        <MomentDetailView
          record={record}
          mediaUris={mediaUris}
          user={user}
        />

        {/* TODO: 下半部分：评论区（MomentDetailComments）暂未实现 */}
      </ScrollView>
    </View>
  );
}
