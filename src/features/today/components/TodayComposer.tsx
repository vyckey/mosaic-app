import { Camera, Mic, Smile } from 'lucide-react-native';

import { MosaicInputBar } from '@/components/mosaic';

interface TodayComposerProps {
  onPress?: () => void;
  onEmojiPress?: () => void;
  onCameraPress?: () => void;
  onVoicePress?: () => void;
}

export function TodayComposer({
  onPress,
  onEmojiPress,
  onCameraPress,
  onVoicePress,
}: TodayComposerProps) {
  return (
    <MosaicInputBar
      placeholder="记下点什么..."
      onPress={onPress}
      actions={[
        { icon: Smile, onPress: onEmojiPress, accessibilityLabel: '表情' },
        { icon: Camera, onPress: onCameraPress, accessibilityLabel: '拍照' },
        { icon: Mic, onPress: onVoicePress, accessibilityLabel: '语音' },
      ]}
    />
  );
}
