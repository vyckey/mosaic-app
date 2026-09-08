import { FlashList } from '@shopify/flash-list';
import type { ReactNode } from 'react';
import { Fragment } from 'react';
import { View } from 'react-native';

import { MosaicDivider } from '@/components/mosaic';

import type { MosaicRecord } from '../types';
import { RecordEntry } from './entry/RecordEntry';

interface RecordsStreamProps {
  records: MosaicRecord[];
  /** Rendered above the list; only applies in virtualized (page-level) mode */
  header?: ReactNode;
  /**
   * Render as a plain inline list instead of a virtualized FlashList.
   * Use when the stream is embedded inside a scrolling card (e.g. the
   * calendar day detail or the map featured location): nesting a
   * virtualized list inside a plain ScrollView breaks windowing, and
   * those call sites only ever hold a handful of items.
   */
  inline?: boolean;
}

/**
 * Hairline divider between feed entries, with breathing room on both sides
 * so the line reads as a boundary instead of a tight rule.
 */
function StreamSeparator() {
  return (
    <View className="py-5">
      <MosaicDivider />
    </View>
  );
}

/**
 * Record feed list — the only virtualization concern lives here: FlashList
 * windowing (or plain inline rendering), separators, header slot, and page
 * padding. Row rendering is delegated to RecordEntry, which dispatches the
 * type-specific body.
 */
export function RecordsStream({
  records,
  header,
  inline = false,
}: RecordsStreamProps) {
  if (inline) {
    return (
      <View>
        {records.map((record, index) => (
          <Fragment key={record.id}>
            {index > 0 && <StreamSeparator />}
            <RecordEntry record={record} />
          </Fragment>
        ))}
      </View>
    );
  }

  return (
    <FlashList
      data={records}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <RecordEntry record={item} padded />}
      ItemSeparatorComponent={StreamSeparator}
      ListHeaderComponent={
        header ? <View className="mb-4 px-[18px]">{header}</View> : null
      }
      showsVerticalScrollIndicator={false}
      // FlashList forwards style objects, not className. Mirrors MosaicScreen's
      // page padding: pt-2 and pb-40 clearance for the floating tab-bar capsule.
      // Horizontal gutters live on each entry (`padded`) so separators stay
      // full-bleed. Keep in sync with MosaicScreen defaults.
      contentContainerStyle={{
        paddingTop: 8,
        paddingBottom: 160,
      }}
    />
  );
}
