import { View } from 'react-native';

import { MosaicCard, MosaicChip, MosaicText } from '@/components/mosaic';
import { useI18n } from '@/i18n/useI18n';

interface TodayInsightProps {
  title?: string;
  highlight?: string;
  detail?: string;
  onAccurate?: () => void;
  onChat?: () => void;
}

export function TodayInsight({
  highlight,
  detail,
  onAccurate,
  onChat,
}: TodayInsightProps) {
  const { t } = useI18n();

  const resolvedHighlight = highlight ?? t('today.insightHighlight');
  const resolvedDetail = detail ?? t('today.insightDetail');

  return (
    <MosaicCard tone="insight">
      <MosaicText variant="tiny" tone="text-muted">
        {t('today.aiInsight')}
      </MosaicText>

      <MosaicText variant="body" tone="text" weight="600" className="mt-3">
        {resolvedHighlight}
      </MosaicText>

      <MosaicText variant="body" tone="text-muted" className="mt-1">
        {resolvedDetail}
      </MosaicText>

      <View className="mt-4 flex-row gap-2">
        <MosaicChip label={t('today.accurate')} onPress={onAccurate} />
        <MosaicChip label={t('today.chatMore')} onPress={onChat} />
      </View>
    </MosaicCard>
  );
}
