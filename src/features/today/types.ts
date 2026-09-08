export interface TodayWeather {
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy';
}

export interface MemoryOfToday {
  id: string;
  date: string;
  content: string;
  image?: {
    uri: string;
  };
  author: {
    name: string;
    avatar?: string;
  };
  likes?: number;
  comments?: number;
}

export interface TodayFragment {
  id: string;
  time: string;
  content: string;
  type: 'text' | 'photo' | 'voice' | 'link';
}

export interface DailyQuestion {
  id: string;
  question: string;
  answer?: string;
}

export interface TodayData {
  date: string;
  weekday: string;
  weather: TodayWeather;

  memoryOfToday?: MemoryOfToday;

  fragments: TodayFragment[];

  dailyQuestion: DailyQuestion;
}
