import { useMemo, useState } from 'react';
import { View } from 'react-native';

import { MosaicChipGroup, MosaicText } from '@/components/mosaic';
import { useI18n } from '@/i18n/useI18n';

import { currentMonth, mockCalendarRecords } from '../mock';
import type { CalendarPhotoShape } from './PhotoCalendar';
import { PhotoCalendar } from './PhotoCalendar';
import { RecordsStream } from './RecordsStream';

export function RecordsCalendar() {
  const { t } = useI18n();
  const [selectedDate, setSelectedDate] = useState<Date>(
    new Date(currentMonth.year, currentMonth.month - 1, 30),
  );
  const [photoShape, setPhotoShape] = useState<CalendarPhotoShape>('rounded');

  const selectedDay = selectedDate.getDate();
  const selectedRecords = mockCalendarRecords[selectedDay] ?? [];

  // Day of month -> first photo of that day's records. Days without a photo
  // keep their plain date number in the calendar (a photo wall, not a dot
  // marker grid). Mock data lives in one month, so the map is month-agnostic.
  const photosByDay = useMemo(() => {
    const map: Record<number, string> = {};

    Object.entries(mockCalendarRecords).forEach(([day, records]) => {
      const image = records
        .flatMap((record) =>
          record.type === 'moment' ? (record.media ?? []) : [],
        )
        .find((item) => item.kind === 'image');

      if (image) {
        map[Number(day)] = image.url;
      }
    });

    return map;
  }, []);

  // Single source of truth: a day press and a month arrow both arrive as a
  // new value, so the visible month always follows the selection
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <View className="gap-4">
      <View className="gap-3">
        {/* Photo shape switcher, above the calendar */}
        <View className="items-end">
          <MosaicChipGroup
            options={[
              { value: 'rounded', label: t('records.photoShape.rounded') },
              { value: 'stamp', label: t('records.photoShape.stamp') },
            ]}
            value={photoShape}
            onChange={(shape) => setPhotoShape(shape as CalendarPhotoShape)}
          />
        </View>

        <PhotoCalendar
          value={selectedDate}
          onValueChange={handleDateChange}
          photos={photosByDay}
          photoShape={photoShape}
        />
      </View>

      {/* Selected-day records: flat section, entries share the page gutter */}
      <View className="mt-4 gap-3">
        <MosaicText variant="body" tone="text" weight="600">
          {t('records.dateFormat', {
            month: selectedDate.getMonth() + 1,
            day: selectedDay,
            count: selectedRecords.length,
          })}
        </MosaicText>

        <View className="mt-3">
          {selectedRecords.length > 0 ? (
            <RecordsStream records={selectedRecords} inline />
          ) : (
            <MosaicText variant="caption" tone="text-muted">
              {t('records.noRecords')}
            </MosaicText>
          )}
        </View>
      </View>
    </View>
  );
}
