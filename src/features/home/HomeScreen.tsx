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

  return (
    <MosaicScreen>
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
              // TODO: 打开那年今日详情
            }}
          />
        )}

        <TodayFragments
          fragments={today.fragments}
          onPress={(fragment) => {
            // TODO: 打开碎片详情
            console.log('fragment:', fragment.id);
          }}
        />

        <DailyQuestion
          question={today.dailyQuestion}
          onAnswer={() => {
            // TODO: 回答每日一问
          }}
          onFavorite={() => {
            // TODO: 收藏问题
          }}
        />

        <TodayInsight
          onAccurate={() => {
            // TODO: 记录反馈
          }}
          onChat={() => {
            // TODO: 打开 AI 对话
          }}
        />
      </MosaicSection>
    </MosaicScreen>
  );
}
