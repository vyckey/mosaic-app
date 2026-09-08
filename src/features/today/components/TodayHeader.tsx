import { Cloud, CloudRain, Sun } from 'lucide-react-native';
import { View } from 'react-native';

import { MosaicText } from '@/components/mosaic';
import { Icon } from '@/components/ui/icon';

import type { TodayWeather } from '../types';

interface TodayHeaderProps {
  date: string;
  weekday: string;
  weather: TodayWeather;
}

const weatherIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
};

export function TodayHeader({ date, weekday, weather }: TodayHeaderProps) {
  const WeatherIcon = weatherIcons[weather.condition];

  return (
    <View className="flex-row items-baseline justify-between">
      <View className="flex-row items-baseline">
        <MosaicText variant="display" tone="text">
          {date}
        </MosaicText>
        <MosaicText variant="display" tone="text" weight="400" className="ml-2">
          {weekday}
        </MosaicText>
      </View>

      <View className="flex-row-reverse items-baseline gap-1">
        <MosaicText variant="caption" tone="text-muted">
          {weather.label} · {weather.temperature}° · {weather.location}
        </MosaicText>
        <Icon as={WeatherIcon} size="sm" className="text-warning" />
      </View>
    </View>
  );
}
