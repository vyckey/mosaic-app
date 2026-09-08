import { View, ViewProps } from 'react-native';

type ThemedViewProps = ViewProps & {
  className?: string;
};

export function ThemedView({ className, ...props }: ThemedViewProps) {
  return <View className={`bg-background ${className ?? ''}`} {...props} />;
}
