import { MapPin, MoreHorizontal } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { memo } from 'react';
import { View } from 'react-native';

import {
  MosaicIcon,
  MosaicIconButton,
  MosaicPressable,
  MosaicText,
} from '@/components/mosaic';
import { useI18n } from '@/i18n/useI18n';

import { parseRecordTimeParts } from '../../format';
import type { MosaicRecord } from '../../types';
import { RecordEntryBody } from './RecordEntryBody';

export interface RecordEntryProps {
  record: MosaicRecord;
  /**
   * Apply the 18px page gutters on the entry itself instead of the list
   * container — keeps dividers full-bleed (they touch the screen edges).
   */
  padded?: boolean;
  /** Row press handler; the list wires navigation here */
  onPress?: () => void;
  /**
   * Body override slot. Defaults to `<RecordEntryBody>`, which dispatches on
   * `record.type`; embedders can swap in a compact/custom body.
   */
  children?: ReactNode;
}

/**
 * Shared skeleton for one record row: date block on the left (big day number
 * over 今天/昨天 · month · yyyy/MM), emphasized HH:mm + emoji on the right →
 * [body slot] → tags → location.
 *
 * Avatars/usernames are intentionally absent: every record is the user's own,
 * so the date is the useful identity here.
 *
 * Everything type-specific lives in the body slot (MoodEntryBody,
 * MomentEntryBody, …); this component only renders what all types share.
 *
 * Memoized so FlashList row recycling only re-renders rows whose data changed.
 */
export const RecordEntry = memo(function RecordEntry({
  record,
  padded = false,
  onPress,
  children,
}: RecordEntryProps) {
  const { t } = useI18n();
  const { time, emoji, tags, location } = record;
  const { day, clock, label } = parseRecordTimeParts(time);

  /** Resolve the util's date label into display text (今天/昨天 via i18n). */
  const subLabel = (() => {
    switch (label.kind) {
      case 'today':
        return t('common.today');
      case 'yesterday':
        return t('common.yesterday');
      case 'month':
        // Month-only labels render as localized month names (十一月 / Nov)
        return t(`common.months.${Number(label.month) - 1}`);
      case 'yearMonth':
        return `${label.year}/${label.month}`;
    }
  })();

  return (
    <MosaicPressable
      onPress={
        onPress ??
        (() => {
          // TODO: open record detail
          console.log('record entry:', record.id);
        })
      }
      className={['min-w-0 overflow-hidden', padded && 'px-[18px]']
        .filter(Boolean)
        .join(' ')}
    >
      {/* Header row: fixed-width date column + a right column that stacks the
          clock/emoji and everything below it, so tags · body · location all
          start at the clock's x position. */}
      <View className="flex-row items-start gap-1">
        <View className="w-14 shrink-0 self-stretch">
          <MosaicText variant="title" weight="700">
            {day}
          </MosaicText>
          <MosaicText variant="tiny" tone="text-muted" className="mt-1">
            {subLabel}
          </MosaicText>
          {/* <View className="mt-2 h-4 w-[3px] ml-3 rounded-full bg-border-muted" /> */}
        </View>

        <View className="min-w-0 flex-1">
          {/* Entry actions: floating at the row's top-right so it never shifts
              the clock baseline; wiring the sheet is a TODO */}
          <MosaicIconButton
            size="sm"
            variant="ghost"
            className="absolute right-0 top-0"
            accessibilityLabel={t('common.more')}
            onPress={() => {
              // TODO: action sheet (share / delete / …)
              console.log('record actions:', record.id);
            }}
          >
            <MosaicIcon as={MoreHorizontal} size="md" tone="text-muted" />
          </MosaicIconButton>

          <View className="flex-row items-center pr-8">
            {/* lineHeight 20 matches the emoji box so every row's clock sits on
                one horizontal line (with or without an emoji) */}
            <MosaicText variant="body" weight="400" style={{ lineHeight: 20 }}>
              {clock}
            </MosaicText>
            {emoji ? (
              <MosaicText
                style={{ fontSize: 16, lineHeight: 20 }}
                className="ml-1.5"
              >
                {emoji}
              </MosaicText>
            ) : null}
          </View>

          {tags?.length ? (
            <View className="mt-4 flex-row flex-wrap items-center gap-2">
              {tags.map((tag) => (
                <MosaicText
                  key={tag}
                  variant="caption"
                  tone="primary"
                  weight="500"
                >
                  #{tag}
                </MosaicText>
              ))}
            </View>
          ) : null}

          {/* Type-specific body; default dispatches on record.type */}
          {children ?? <RecordEntryBody record={record} />}

          {location ? (
            <View className="mt-4 flex-row items-center">
              <MosaicIcon as={MapPin} size="sm" tone="primary" />
              <MosaicText variant="tiny" tone="text" className="ml-1.5">
                {location.address ?? location.name}
              </MosaicText>
            </View>
          ) : null}
        </View>
      </View>
    </MosaicPressable>
  );
});
