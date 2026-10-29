import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import type { TextStyle } from 'react-native';
import { View } from 'react-native';

import { MosaicImage, MosaicStamp, MosaicText } from '@/components/mosaic';
import {
  Calendar,
  CalendarBody,
  CalendarGrid,
  CalendarHeader,
  CalendarHeaderNextButton,
  CalendarHeaderPrevButton,
  CalendarHeaderTitle,
  CalendarWeekDaysHeader,
  type DayState,
} from '@/components/ui/calendar';
import { Icon } from '@/components/ui/icon';

/** Photo shape of the calendar photo wall */
export type CalendarPhotoShape = 'rounded' | 'stamp';

/**
 * Day number overlaid on a photo tile. Only the color and the halo differ from
 * a plain date cell — size, line height and weight stay on the shared
 * `caption` variant so both kinds of day read the same.
 */
const dayTextStyle: TextStyle = {
  color: '#ffffff',
  textShadowColor: 'rgba(0, 0, 0, 0.75)',
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: 4,
};

interface CalendarPhotoTileProps {
  /** Thumbnail url of the day's first photo */
  uri: string;
  /** Day of month, centered over the photo like a plain calendar date */
  day: number;
  shape: CalendarPhotoShape;
}

/**
 * One photo cell of the photo wall. Fills the calendar day cell (absolute
 * inset) with a 3px gutter, leaving the cell's own background visible as a
 * ring — the calendar paints that ring for selected / today states. Two
 * shapes: rounded-square (Mosaic tile radius) and a perforated stamp cut.
 */
function CalendarPhotoTile({ uri, day, shape }: CalendarPhotoTileProps) {
  return (
    <View className="absolute inset-0 p-[3px]">
      {shape === 'stamp' ? (
        <MosaicStamp className="flex-1">
          <MosaicImage source={{ uri }} radius={0} />
        </MosaicStamp>
      ) : (
        <MosaicImage source={{ uri }} radius="tile" />
      )}

      {/* Day number centered on the tile, matching plain date cells */}
      <View
        className="absolute inset-0 items-center justify-center"
        pointerEvents="none"
      >
        <MosaicText variant="caption" style={dayTextStyle}>
          {day}
        </MosaicText>
      </View>
    </View>
  );
}

export interface PhotoCalendarProps {
  /** Selected day (controlled); its month is also the visible month */
  value: Date;
  /** Fired on day press and on month navigation */
  onValueChange: (date: Date) => void;
  /**
   * Day of month -> photo thumbnail uri. Days with a photo render a photo
   * tile; the rest keep their plain date number.
   */
  photos: Record<number, string>;
  /** Photo shape of the wall (controlled) */
  photoShape: CalendarPhotoShape;
  className?: string;
}

/**
 * Shift a date by whole months, keeping the day of month when the target month
 * is long enough (Jan 31 -> Feb 28, not Mar 3).
 */
const shiftMonth = (date: Date, delta: number) => {
  const target = new Date(date.getFullYear(), date.getMonth() + delta, 1);
  const lastDay = new Date(
    target.getFullYear(),
    target.getMonth() + 1,
    0,
  ).getDate();

  target.setDate(Math.min(date.getDate(), lastDay));

  return target;
};

/**
 * PhotoCalendar — the records calendar as a photo wall.
 *
 * UI only: one controlled `value` drives both the selected day and the
 * visible month, so the parent learns about day presses and month navigation
 * through the same `onValueChange` (a month arrow is just a value shift).
 * The photo shape is controlled too; the switcher itself lives in the parent.
 *
 * Day cells with a photo render a thumbnail (rounded / stamp shape); days
 * without a photo keep the plain date number.
 */
export function PhotoCalendar({
  value,
  onValueChange,
  photos,
  photoShape,
  className,
}: PhotoCalendarProps) {
  // The underlying calendar seeds its visible month from `initialMonth` only,
  // so remount it whenever the controlled month changes
  const monthKey = `${value.getFullYear()}-${value.getMonth()}`;

  const handlePrevMonth = () => {
    onValueChange(shiftMonth(value, -1));
  };

  const handleNextMonth = () => {
    onValueChange(shiftMonth(value, 1));
  };

  // Photo wall: thumbnails on days with a photo, plain date numbers elsewhere
  const renderDay = (date: Date, state: DayState) => {
    const day = date.getDate();
    const uri = state.isOutsideMonth ? undefined : photos[day];

    if (uri) {
      return <CalendarPhotoTile uri={uri} day={day} shape={photoShape} />;
    }

    if (state.isOutsideMonth) {
      return (
        <MosaicText variant="caption" tone="text-subtle">
          {day}
        </MosaicText>
      );
    }

    return (
      <MosaicText
        variant="caption"
        tone={state.isSelected ? 'primary-foreground' : 'text'}
      >
        {day}
      </MosaicText>
    );
  };

  return (
    <View className={['gap-4', className].filter(Boolean).join(' ')}>
      {/* Flat calendar on the page canvas (no card chrome) */}
      <Calendar
        key={monthKey}
        mode="single"
        value={value}
        onValueChange={onValueChange}
        initialMonth={value}
        fixedWeeks
        firstDayOfWeek={1}
        renderDay={renderDay}
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
  );
}
