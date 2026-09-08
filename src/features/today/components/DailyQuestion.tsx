import { MessageCircleQuestion, MoreHorizontal } from 'lucide-react-native';
import { View } from 'react-native';

import { MosaicButton, MosaicCard, MosaicSection, MosaicSectionHeader } from '@/components/mosaic';
import { Text } from '@/components/ui/text';

import type { DailyQuestion as DailyQuestionType } from '../types';

interface DailyQuestionProps {
  question: DailyQuestionType;
  onAnswer?: () => void;
  onMore?: () => void;
}

export function DailyQuestion({
  question,
  onAnswer,
  onMore,
}: DailyQuestionProps) {
  return (
    <MosaicSection spacing="lg">
      <MosaicCard className="items-center py-7">
        <View className="w-full px-4">
          <MosaicSectionHeader
            title="每日一问"
            icon={MessageCircleQuestion}
            actionIcon={MoreHorizontal}
            onAction={onMore}
            className="mb-6"
          />
        </View>

        <Text className="px-4 text-center text-lg font-medium leading-7 text-foreground">
          {question.question}
        </Text>

        <MosaicButton
          variant="secondary"
          className="mt-6 h-11 rounded-full"
          onPress={onAnswer}
        >
          <Text className="text-sm font-medium text-foreground">
            {question.answer ? '查看回答' : '回答一下'}
          </Text>
        </MosaicButton>
      </MosaicCard>
    </MosaicSection>
  );
}
