import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { View } from 'react-native';

import { MosaicText } from '@/components/mosaic';
import {
  Calendar,
  CalendarBody,
  CalendarGrid,
  CalendarHeader,
  CalendarHeaderNextButton,
  CalendarHeaderPrevButton,
  CalendarHeaderTitle,
  CalendarWeekDaysHeader,
} from '@/components/ui/calendar';
import { Icon } from '@/components/ui/icon';
import { useI18n } from '@/i18n/useI18n';

import { currentMonth, mockCalendarRecords } from '../mock';
import { RecordsStream } from './RecordsStream';

export function RecordsCalendar() {
  const { t } = useI18n();
  const [selectedDate, setSelectedDate] = useState<Date>(
    new Date(currentMonth.year, currentMonth.month - 1, 30),
  );
  const [currentDate, setCurrentDate] = useState<Date>(
    new Date(currentMonth.year, currentMonth.month - 1, 1),
  );

  const selectedDay = selectedDate.getDate();
  const selectedRecords = mockCalendarRecords[selectedDay] ?? [];

  const handlePrevMonth = () => {
    const prev = new Date(currentDate);
    prev.setMonth(prev.getMonth() - 1);
    setCurrentDate(prev);
  };

  const handleNextMonth = () => {
    const next = new Date(currentDate);
    next.setMonth(next.getMonth() + 1);
    setCurrentDate(next);
  };

  const handleDateChange = (date: Date) => {
    const isCurrentMonth =
      date.getFullYear() === currentDate.getFullYear() &&
      date.getMonth() === currentDate.getMonth();

    if (!isCurrentMonth) {
      return;
    }

    setSelectedDate(date);
  };

  const markers = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const monthStr = month < 10 ? `0${month}` : `${month}`;

    return Object.keys(mockCalendarRecords).reduce(
      (acc, day) => {
        const dayStr = day.length < 10 ? `0${day}` : `${day}`;
        acc[`${year}-${monthStr}-${dayStr}`] = {
          type: 'dot',
          color: 'var(--color-primary)',
        };
        return acc;
      },
      {} as Record<string, { type: string; color: string }>,
    );
  }, [currentDate]);

  return (
    <View className="gap-4">
      {/* Flat calendar on the page canvas (no card chrome) */}
      <View>
        <Calendar
          mode="single"
          value={selectedDate}
          onValueChange={handleDateChange}
          initialMonth={currentDate}
          fixedWeeks
          // showOutsideDays={false}
          firstDayOfWeek={1}
          markers={markers}
        >
          <CalendarHeader>
            <CalendarHeaderPrevButton onPress={handlePrevMonth}>
              <Icon as={ChevronLeft} size="sm" className="text-text" />
            </CalendarHeaderPrevButton>
            <CalendarHeaderTitle />
            <CalendarHeaderNextButton onPress={handleNextMonth}>
              <Icon as={ChevronRight} size="sm" className="text-text" />
            </CalendarHeaderNextButton>
          </CalendarHeader>

          <CalendarWeekDaysHeader />

          <CalendarBody>
            <CalendarGrid />
          </CalendarBody>
        </Calendar>
      </View>

      {/* Selected-day records: flat section, entries share the page gutter */}
      <View>
        <MosaicText variant="body" tone="text" weight="600">
          {t('records.dateFormat', {
            month: currentMonth.month,
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
