import { useState } from 'react';

import { useI18n } from '@/i18n/useI18n';

import { MosaicPressable } from './MosaicPressable';
import { MosaicTagPickerSheet } from './MosaicTagPickerSheet';
import { MosaicText } from './MosaicText';
import { useTagCatalog } from './tag-catalog';

export interface MosaicTagsProps {
  value: string[];
  onChange: (tags: string[]) => void;
  /** Empty-state hint shown when no tags; defaults to # + t('tag.emptyPlaceholder') */
  placeholder?: string;
  className?: string;
}

export function MosaicTags({
  value,
  onChange,
  placeholder,
  className,
}: MosaicTagsProps) {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);
  const catalog = useTagCatalog();

  return (
    <>
      <MosaicPressable
        onPress={() => setVisible(true)}
        hitSlop={{ top: 8, bottom: 8 }}
        className={[
          'flex-row flex-wrap items-center gap-2 self-start',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {value.length === 0 ? (
          <MosaicText variant="caption" tone="text-subtle" weight="500">
            #{placeholder ?? t('tag.emptyPlaceholder')}
          </MosaicText>
        ) : (
          value.map((tag) => (
            <MosaicText key={tag} variant="caption" tone="primary" weight="500">
              #{tag}
            </MosaicText>
          ))
        )}
      </MosaicPressable>

      <MosaicTagPickerSheet
        visible={visible}
        onClose={() => setVisible(false)}
        onDone={(next) => {
          onChange(next);
          catalog.touch(next);
          setVisible(false);
        }}
        onCreate={catalog.add}
        selected={value}
        allTags={catalog.all}
        recentTags={catalog.recent}
        popularTags={catalog.popular}
      />
    </>
  );
}
