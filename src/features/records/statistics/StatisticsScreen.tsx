import { router } from 'expo-router';
import {
  BarChart3,
  CalendarDays,
  FileText,
  Flame,
  Heart,
  Image as ImageIcon,
  PieChart,
  Smile,
  Type,
} from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';

import {
  MosaicButton,
  MosaicCard,
  MosaicIcon,
  MosaicIconButton,
  MosaicScreen,
  MosaicScreenHeader,
  MosaicSegmentedControl,
  MosaicSheet,
  MosaicText,
  MosaicDateTimePicker,
  type MosaicHeatmapCell,
} from '@/components/mosaic';
import { useI18n } from '@/i18n/useI18n';

import { createStatisticsSnapshot } from './aggregate';
import { changeTone, formatChange, formatCompactNumber } from './format';
import { mockDailyActivity } from './mock';
import {
  formatComparisonLabel,
  formatDayLabel,
  formatMonthName,
  formatPeriodLabel,
  formatRangeLabel,
  formatWeekday,
  resolvePeriodRange,
  shiftPeriod,
  startOfDay,
} from './period';
import type { StatisticsDimension } from './types';
import { yearReviewPhotos } from './types';
import { AiInsightCard } from './components/AiInsightCard';
import { DistributionDonut } from './components/DistributionDonut';
import { MetricCards, type MetricCardItem } from './components/MetricCards';
import { MoodTrendChart } from './components/MoodTrendChart';
import { PeriodNavigator } from './components/PeriodNavigator';
import { RecordsActivity } from './components/RecordsActivity';
import { SectionHeading } from './components/SectionHeading';
import { YearInReview } from './components/YearInReview';

/**
 * Statistics page: Week / Month / Year.
 *
 * Records sits above Emotions in one vertically scrolling page. The screen is
 * the only stateful layer: it owns the selected period, the dimension switch,
 * the calendar sheet. All aggregation lives in
 * `aggregate.ts`, and the visuals stay presentational.
 */
export function StatisticsScreen() {
  const { t, locale } = useI18n();

  const [dimension, setDimension] = useState<StatisticsDimension>('week');
  const [anchor, setAnchor] = useState<Date>(() => new Date());
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [pendingDate, setPendingDate] = useState<Date>(() => new Date());

  const snapshot = useMemo(
    () => createStatisticsSnapshot(dimension, anchor, mockDailyActivity),
    [dimension, anchor],
  );

  const previousRange = resolvePeriodRange(
    dimension,
    shiftPeriod(dimension, anchor, -1),
  );
  const nextRange = resolvePeriodRange(
    dimension,
    shiftPeriod(dimension, anchor, 1),
  );
  const previousLabel = formatComparisonLabel(
    dimension,
    previousRange,
    locale,
    t,
  );
  const periodLabel = formatPeriodLabel(
    dimension,
    { start: snapshot.start, end: snapshot.end },
    locale,
    t,
  );
  const nextDisabled = nextRange.start <= startOfDay(new Date());

  const weekdayLabels = Array.from({ length: 7 }, (_, index) =>
    formatWeekday(index, t),
  );

  const handleDimensionChange = (value: string) => {
    setDimension(value as StatisticsDimension);
  };

  const handleShift = (delta: number) => {
    setAnchor(shiftPeriod(dimension, anchor, delta));
  };

  const openCalendar = () => {
    setPendingDate(anchor);
    setCalendarVisible(true);
  };

  const confirmCalendar = () => {
    setAnchor(pendingDate);
    setCalendarVisible(false);
  };

  const heatmapMeta = (cell: MosaicHeatmapCell) =>
    snapshot.heatmap?.meta[cell.rowIndex]?.[cell.columnIndex] ?? null;

  const heatmapAccessibilityLabel = (cell: MosaicHeatmapCell) => {
    const meta = heatmapMeta(cell);
    const date = meta
      ? formatRangeLabel(meta.start, meta.end, locale, t)
      : formatWeekday(cell.columnIndex, t);
    const count = cell.value ?? 0;

    return `${date}. ${
      count > 0
        ? t('statistics.cellRecords', { count })
        : t('statistics.cellNoRecords')
    }`;
  };

  const handleCellPress = (cell: MosaicHeatmapCell) => {
    const meta = heatmapMeta(cell);

    // TODO: replace with the cell detail sheet once that flow is designed.
    console.log('[statistics] heatmap cell press', {
      rowIndex: cell.rowIndex,
      columnIndex: cell.columnIndex,
      date: meta ? formatRangeLabel(meta.start, meta.end, locale, t) : null,
      count: cell.value ?? 0,
    });
  };

  const metricItems: MetricCardItem[] = [
    {
      key: 'records',
      icon: FileText,
      value: formatCompactNumber(snapshot.metrics.records),
      label: t('statistics.metrics.records'),
      change: dimension === 'month' ? formatChange(snapshot.recordsDeltaPct) : undefined,
      changeTone: changeTone(snapshot.recordsDeltaPct),
    },
    {
      key: 'activeDays',
      icon: Flame,
      value: formatCompactNumber(snapshot.metrics.activeDays),
      label: t('statistics.metrics.activeDays'),
    },
    {
      key: 'moodEntries',
      icon: Smile,
      value: formatCompactNumber(snapshot.metrics.moodEntries),
      label: t('statistics.metrics.moodEntries'),
    },
    {
      key: 'photos',
      icon: ImageIcon,
      value: formatCompactNumber(snapshot.metrics.photos),
      label: t('statistics.metrics.photos'),
    },
    {
      key: 'words',
      icon: Type,
      value: formatCompactNumber(snapshot.metrics.words),
      label: t('statistics.metrics.words'),
    },
  ];

  const visibleMetrics =
    dimension === 'week'
      ? metricItems
      : dimension === 'month'
        ? metricItems.slice(0, 3)
        : [];

  const moodTrendData = snapshot.moodTrend.map((point, index) => ({
    x: index,
    mood: point.value,
    label:
      point.label.kind === 'weekday'
        ? formatWeekday(point.label.index, t)
        : point.label.kind === 'day'
          ? formatDayLabel(
              new Date(
                snapshot.start.getFullYear(),
                point.label.monthIndex,
                point.label.day,
              ),
              locale,
              t,
            )
          : formatMonthName(point.label.monthIndex, locale, t),
  }));

  const moodDistribution = snapshot.moodDistribution.map((datum) => ({
    ...datum,
    label: t(`statistics.moods.${datum.key}`),
  }));

  const recordTypes = snapshot.recordTypes.map((datum) => ({
    ...datum,
    label: t(`statistics.recordTypes.${datum.key}`),
  }));

  const comparisonTrailing =
    snapshot.moodDeltaPct === null ? undefined : (
      <View className="flex-row items-center gap-1">
        <MosaicText variant="tiny" tone="text-muted">
          {t('statistics.vs', { period: previousLabel })}
        </MosaicText>
        <MosaicText
          variant="tiny"
          tone={changeTone(snapshot.moodDeltaPct)}
          weight="600"
        >
          {formatChange(snapshot.moodDeltaPct)}
        </MosaicText>
      </View>
    );

  return (
    <MosaicScreen>
      <MosaicScreenHeader
        title={t('statistics.title')}
        onBack={() => router.back()}
        actions={[
          <MosaicIconButton
            key="calendar"
            variant="glass"
            size="md"
            onPress={openCalendar}
            accessibilityLabel={t('statistics.selectDate')}
          >
            <MosaicIcon as={CalendarDays} size="sm" tone="text" />
          </MosaicIconButton>,
        ]}
      />

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-4 px-[18px] pb-10 pt-2"
        showsVerticalScrollIndicator={false}
      >
        <MosaicSegmentedControl
          options={[
            { value: 'week', label: t('statistics.dimension.week') },
            { value: 'month', label: t('statistics.dimension.month') },
            { value: 'year', label: t('statistics.dimension.year') },
          ]}
          value={dimension}
          onChange={handleDimensionChange}
          accessibilityLabel={t('statistics.dimension.accessibilityLabel')}
        />

        <PeriodNavigator
          label={periodLabel}
          onPrevious={() => handleShift(-1)}
          onNext={() => handleShift(1)}
          previousAccessibilityLabel={t('statistics.previousPeriod')}
          nextAccessibilityLabel={t('statistics.nextPeriod')}
          nextDisabled={nextDisabled}
          className="-mt-1"
        />

        {dimension === 'year' && (
          <YearInReview
            title={t('statistics.yearInReview')}
            summary={t('statistics.yearSummary')}
            records={formatCompactNumber(snapshot.metrics.records)}
            recordsLabel={t('statistics.metrics.records')}
            change={formatChange(snapshot.recordsDeltaPct)}
            changeTone={changeTone(snapshot.recordsDeltaPct)}
            compareLabel={
              snapshot.recordsDeltaPct === null
                ? undefined
                : t('statistics.vs', { period: previousLabel })
            }
            photos={yearReviewPhotos}
          />
        )}

        {/* Records block: metrics + activity + record type split (month only) */}
        <MosaicCard className="gap-5">
          {visibleMetrics.length > 0 && <MetricCards items={visibleMetrics} />}

          <View className="gap-3">
            <SectionHeading
              title={t('statistics.recordsActivity')}
              icon={BarChart3}
              actionLabel={
                dimension === 'week' ? t('statistics.seeAll') : undefined
              }
              onAction={dimension === 'week' ? () => {} : undefined}
            />

            <RecordsActivity
              snapshot={snapshot}
              weekdayLabels={weekdayLabels}
              onCellPress={handleCellPress}
              accessibilityLabel={heatmapAccessibilityLabel}
            />
          </View>

          {dimension === 'month' && (
            <View className="gap-3">
              <SectionHeading
                title={t('statistics.recordTypeDistribution')}
                icon={PieChart}
              />
              <DistributionDonut data={recordTypes} />
            </View>
          )}
        </MosaicCard>

        {dimension === 'year' && (
          <AiInsightCard
            title={t('statistics.moreInsights')}
            body={t('statistics.insights.year')}
            onPress={() => {}}
          />
        )}

        {/* Emotions block: trend + distribution + AI summary */}
        <MosaicCard className="gap-5">
          <View className="gap-3">
            <SectionHeading
              title={t('statistics.moodTrend')}
              icon={Heart}
              actionLabel={
                dimension === 'week' ? t('statistics.seeAll') : undefined
              }
              onAction={dimension === 'week' ? () => {} : undefined}
              trailing={comparisonTrailing}
            />

            <MoodTrendChart
              data={moodTrendData}
              labelStride={dimension === 'year' ? 2 : 1}
            />
          </View>

          <View className="gap-3">
            <SectionHeading
              title={t('statistics.moodDistribution')}
              icon={Heart}
            />
            <DistributionDonut data={moodDistribution} />
          </View>

          <AiInsightCard
            title={t('statistics.aiInsight')}
            body={t(`statistics.insights.${dimension}`)}
            onPress={() => {}}
          />
        </MosaicCard>
      </ScrollView>

      {/* Calendar: jump to any period */}
      <MosaicSheet
        visible={calendarVisible}
        onClose={() => setCalendarVisible(false)}
        title={t('statistics.selectDate')}
        footer={
          <MosaicButton size="lg" onPress={confirmCalendar}>
            {t('common.confirm')}
          </MosaicButton>
        }
      >
        <MosaicDateTimePicker
          mode="date"
          value={pendingDate}
          maximumDate={new Date()}
          onChange={setPendingDate}
        />
      </MosaicSheet>
    </MosaicScreen>
  );
}
