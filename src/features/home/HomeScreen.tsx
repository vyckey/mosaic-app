import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MosaicScreen, MosaicSection } from '@/components/mosaic';

import {
  DailyQuestion,
  MemoryOfToday,
  TodayFragments,
  TodayHeader,
  TodayInsight,
} from './components';
import { mockToday } from './mock';

export function HomeScreen() {
  const today = mockToday;
  // Tab page: the scroller owns the top inset (content scrolls under the
  // status bar); pb-40 clears the floating tab-bar capsule.
  const insets = useSafeAreaInsets();

  return (
    <MosaicScreen>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[18px] pb-40"
        contentContainerStyle={{ paddingTop: insets.top }}
        showsVerticalScrollIndicator={false}
      >
        <MosaicSection spacing="lg">
          <TodayHeader
            date={today.date}
            weekday={today.weekday}
            weather={today.weather}
          />

          {today.memoryOfToday && (
            <MemoryOfToday
              memory={today.memoryOfToday}
              onPress={() => {
                // TODO: open the "on this day" detail
              }}
            />
          )}

          <TodayFragments
            fragments={today.fragments}
            onPress={(fragment) => {
              // TODO: open fragment detail
              console.log('fragment:', fragment.id);
            }}
          />

          <DailyQuestion
            question={today.dailyQuestion}
            onAnswer={() => {
              // TODO: answer the daily question
            }}
            onFavorite={() => {
              // TODO: favorite the question
            }}
          />

          <TodayInsight
            onAccurate={() => {
              // TODO: send feedback
            }}
            onChat={() => {
              // TODO: open AI chat
            }}
          />
        </MosaicSection>
      </ScrollView>
    </MosaicScreen>
  );
}
