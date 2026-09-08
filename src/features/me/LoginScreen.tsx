import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';

import { AuthFlow } from './components/AuthFlow';

export function LoginScreen() {
  const handleComplete = () => {
    router.replace('/(tabs)/today');
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-1"
        keyboardShouldPersistTaps="handled"
      >
        <AuthFlow onComplete={handleComplete} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
