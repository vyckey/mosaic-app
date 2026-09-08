import { Heart } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { MosaicButton, MosaicCard, MosaicText } from '@/components/mosaic';
import { Icon } from '@/components/ui/icon';
import { useI18n } from '@/i18n/useI18n';

import type { DailyQuestion as DailyQuestionType } from '../types';

interface DailyQuestionProps {
  question: DailyQuestionType;
  onAnswer?: () => void;
  onFavorite?: () => void;
}

export function DailyQuestion({
  question,
  onAnswer,
  onFavorite,
}: DailyQuestionProps) {
  const { t } = useI18n();

  return (
    <MosaicCard tone="lav">
      <View className="flex-row items-start justify-between">
        <MosaicText variant="tiny" tone="text-muted">
          {t('today.dailyQuestion')}
        </MosaicText>

        {onFavorite && (
          <Pressable onPress={onFavorite} hitSlop={8}>
            {({ pressed }) => (
              <Icon
                as={Heart}
                size="sm"
                className={pressed ? 'text-text' : 'text-text-muted'}
              />
            )}
          </Pressable>
        )}
      </View>

      <MosaicText variant="subtitle" tone="text" className="mt-2">
        {question.question}
      </MosaicText>

      <MosaicButton
        variant="primary"
        size="sm"
        onPress={onAnswer}
        className="mt-5 self-start"
      >
        {question.answer ? t('today.viewAnswer') : t('today.answer')}
      </MosaicButton>
    </MosaicCard>
  );
}
