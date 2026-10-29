import { View } from 'react-native';

import {
  MosaicHeatmap,
  type MosaicHeatmapCell,
  type MosaicHeatmapSelection,
} from '@/components/mosaic';

import type { StatisticsSnapshot } from '../types';
import { RecordsBarChart } from './RecordsBarChart';

export interface RecordsActivityProps {
  snapshot: StatisticsSnapshot;
  /** Monday-first weekday captions resolved by the screen. */
  weekdayLabels: readonly string[];
  selectedCell?: MosaicHeatmapSelection;
  onCellPress?: (cell: MosaicHeatmapCell) => void;
  accessibilityLabel?: (cell: MosaicHeatmapCell) => string;
}

/**
 * Records Activity block:
 * - Week: one bar per weekday
 * - Month: calendar-week heatmap (Mon–Sun)
 * - Year: 5 week buckets × 12 months
 *
 * All bucketing already happened in `createStatisticsSnapshot`; this component
 * only chooses the right visual and supplies labels.
 */
export function RecordsActivity({
  snapshot,
  weekdayLabels,
  selectedCell,
  onCellPress,
  accessibilityLabel,
}: RecordsActivityProps) {
  if (snapshot.dimension === 'week') {
    return (
      <RecordsBarChart
        data={weekdayLabels.map((label, index) => ({
          x: index,
          records: snapshot.dailyRecords[index] ?? 0,
          label,
        }))}
      />
    );
  }

  const heatmap = snapshot.heatmap;
  if (!heatmap) {
    return <View />;
  }

  const rowLabels = Array.from(
    { length: heatmap.rowCount },
    (_, index) => `W${index + 1}`,
  );
  const columnLabels =
    snapshot.dimension === 'month'
      ? weekdayLabels
      : Array.from({ length: 12 }, (_, index) => String(index + 1));

  return (
    <MosaicHeatmap
      data={heatmap.cells}
      rowLabels={rowLabels}
      columnLabels={columnLabels}
      rowLabelWidth={snapshot.dimension === 'year' ? 24 : 28}
      showLegend
      selectedCell={selectedCell}
      onCellPress={onCellPress}
      accessibilityLabel={accessibilityLabel}
    />
  );
}
