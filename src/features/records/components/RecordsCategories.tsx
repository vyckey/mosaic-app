import { View } from 'react-native';

import { MosaicCard, MosaicPressable, MosaicProgress, MosaicText } from '@/components/mosaic';
import { useI18n } from '@/i18n/useI18n';

import type { RecordsCategory } from '../types';

interface CategoryCardProps {
  category: RecordsCategory;
}

function CategoryCard({ category }: CategoryCardProps) {
  const { t } = useI18n();
  const progress = category.count / category.maxCount;

  return (
    <MosaicPressable
      onPress={() => {
        // TODO: 打开分类详情
        console.log('category:', category.name);
      }}
    >
      <MosaicCard className="gap-1">
        <MosaicText variant="body" tone="text">
          {category.emoji} {category.name}
        </MosaicText>

        <MosaicText variant="title" tone="text">
          {category.count}
        </MosaicText>

        <MosaicProgress progress={progress} className="my-1" />

        <MosaicText variant="tiny" tone="text-muted">
          {t('records.viewDetail')}
        </MosaicText>
      </MosaicCard>
    </MosaicPressable>
  );
}

interface RecordsCategoriesProps {
  categories: RecordsCategory[];
}

export function RecordsCategories({ categories }: RecordsCategoriesProps) {
  return (
    <View className="flex-row flex-wrap gap-3">
      {categories.map((category) => (
        <View key={category.id} className="w-[48%] flex-1 min-w-[48%]">
          <CategoryCard category={category} />
        </View>
      ))}
    </View>
  );
}
