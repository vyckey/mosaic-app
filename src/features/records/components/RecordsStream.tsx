import { FlashList } from '@shopify/flash-list';
import type { ReactNode } from 'react';
import { Fragment } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MosaicDivider } from '@/components/mosaic';

import type { MosaicRecord } from '../types';
import { RecordEntry } from './entry/RecordEntry';

interface RecordsStreamProps {
  records: MosaicRecord[];
  /** Rendered above the list; only applies in virtualized (page-level) mode */
  header?: ReactNode;
  /**
   * Render as a plain inline list instead of a virtualized FlashList.
   * Use when the stream is embedded inside another scroll container
   * (e.g. the calendar view's ScrollView page or the map's featured
   * location card): nesting a virtualized list inside a plain ScrollView
   * breaks windowing, and those call sites only ever hold a handful of
   * items.
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
  const insets = useSafeAreaInsets();

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
      // FlashList forwards style objects, not className. The scroller owns its
      // own padding: exact safe-area top (offsets were flattened to +0 across
      // screens) and pb-160 (= pb-40) clearance for the floating tab-bar
      // capsule. Horizontal gutters live on each entry (`padded`) so
      // separators stay full-bleed.
      contentContainerStyle={{
        paddingTop: insets.top,
        paddingBottom: 160,
      }}
    />
  );
}
