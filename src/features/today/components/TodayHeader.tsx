import { Cloud, CloudRain, Sun } from 'lucide-react-native';
import { View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

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

const weatherColors = {
  sunny: 'text-warning',
  cloudy: 'text-text-muted',
  rainy: 'text-info',
};

export function TodayHeader({ date, weekday, weather }: TodayHeaderProps) {
  const WeatherIcon = weatherIcons[weather.condition];
  const iconColor = weatherColors[weather.condition];

  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-2xl font-semibold text-foreground">
        {date} {weekday}
      </Text>

      <View className="flex-row items-center">
        <Icon as={WeatherIcon} size="sm" className={iconColor} />

        <Text className="ml-1 text-sm text-text-muted">
          {weather.temperature}°
        </Text>
      </View>
    </View>
  );
}
