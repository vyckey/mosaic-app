export interface TodayWeather {
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy';
  /** 天气描述，如「晴」 */
  label: string;
  /** 地点，如「北京朝阳」 */
  location: string;
}

export interface MemoryPhoto {
  uri: string;
  /** 图片左下角说明，如「🌊 镰仓 · 江之电」 */
  label: string;
  /** 右上角角标，如「️ 9」 */
  badge?: string;
}

export interface PreviousYearMemory {
  year: string;
  content: string;
  meta: string;
}

export interface MemoryOfToday {
  id: string;
  date: string;
  content: string;
  /** 那年今日配图（原型 memory-photos 网格） */
  photos: MemoryPhoto[];
  /** 底部 meta，如「📷 3张 · 😊 9/10 · 📍 镰仓」 */
  meta: string;
  /** 再往前一年的回顾 */
  previousYear?: PreviousYearMemory;
}

export interface TodayFragment {
  id: string;
  time: string;
  content: string;
  /** 用于显示左侧 emoji 图标 */
  emoji: string;
  /** 分类标签，如「运动」「美食」 */
  type: string;
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
