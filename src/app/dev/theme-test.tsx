import { Text, View } from 'react-native';

export default function ThemeTest() {
  return (
    <View className="flex-1 bg-background p-8">
      <Text className="text-text text-3xl font-bold">Theme Test</Text>

      <View className="mt-8 rounded-2xl bg-primary p-8">
        <Text className="text-primary-foreground text-2xl font-bold">
          PRIMARY
        </Text>
      </View>

      <View className="mt-4 rounded-2xl bg-success p-8">
        <Text className="text-success-foreground text-2xl font-bold">
          SUCCESS
        </Text>
      </View>

      <View className="mt-4 rounded-2xl bg-danger p-8">
        <Text className="text-danger-foreground text-2xl font-bold">
          DANGER
        </Text>
      </View>
    </View>
  );
}
