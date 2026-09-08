import { ScrollView, View } from 'react-native';

import {
  DailyQuestion,
  MemoryOfToday,
  TodayComposer,
  TodayFragments,
  TodayHeader,
} from './components';
import { mockToday } from './mock';

export function TodayScreen() {
  const today = mockToday;

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-32 pt-6"
        showsVerticalScrollIndicator={false}
      >
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
            onMore={() => {
              // TODO: 更多操作
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
          onMore={() => {
            // TODO: 更多操作
          }}
        />
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0">
        <TodayComposer
          onPress={() => {
            // TODO: 打开文字记录
          }}
          onEmojiPress={() => {
            // TODO
          }}
          onCameraPress={() => {
            // TODO
          }}
          onVoicePress={() => {
            // TODO
          }}
        />
      </View>
    </View>
  );
}
