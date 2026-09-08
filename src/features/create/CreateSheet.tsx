import {
    ImageIcon,
    LinkIcon,
    MicIcon,
    PencilIcon,
    X,
} from 'lucide-react-native';
import React from 'react';
import { Pressable, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

export type CreateActionType = 'text' | 'photo' | 'voice' | 'link';

export interface CreateSheetProps {
  onAction?: (action: CreateActionType) => void;
  onClose?: () => void;
}

interface CreateActionItemProps {
  icon: React.ComponentProps<typeof Icon>['as'];
  title: string;
  description: string;
  onPress: () => void;
}

function CreateActionItem({
  icon,
  title,
  description,
  onPress,
}: CreateActionItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-1 active:opacity-70"
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      {({ pressed }) => (
        <View
          className={[
            'min-h-[128px] rounded-3xl bg-surface px-4 py-5',
            'border border-border',
            pressed ? 'bg-surface-muted' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <View className="mb-4 h-11 w-11 items-center justify-center rounded-2xl bg-primary-muted">
            <Icon as={icon} size="md" className="text-primary" />
          </View>

          <Text className="text-base font-medium text-text">{title}</Text>

          <Text className="mt-1 text-sm text-text-secondary">
            {description}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

export function CreateSheet({ onAction, onClose }: CreateSheetProps) {
  const handleAction = (action: CreateActionType) => {
    onAction?.(action);
  };

  return (
    <View className="flex-1 justify-end bg-black/20">
      <View className="rounded-t-[32px] bg-background px-5 pb-8 pt-4">
        {/* Handle */}
        <View className="mb-5 items-center">
          <View className="h-1 w-10 rounded-full bg-border-strong" />
        </View>

        {/* Header */}
        <View className="mb-6 flex-row items-start justify-between">
          <View className="flex-1 pr-4">
            <Text className="text-2xl font-semibold text-text">
              记录一点什么
            </Text>

            <Text className="mt-2 text-sm leading-5 text-text-secondary">
              随手留下此刻的想法、照片或声音。
            </Text>
          </View>

          {onClose && (
            <Pressable
              onPress={onClose}
              className="h-10 w-10 items-center justify-center rounded-full bg-surface-muted active:opacity-70"
              accessibilityRole="button"
              accessibilityLabel="关闭"
            >
              <Icon as={X} size="sm" className="text-text-secondary" />
            </Pressable>
          )}
        </View>

        {/* Actions */}
        <View className="gap-3">
          <View className="flex-row gap-3">
            <CreateActionItem
              icon={PencilIcon}
              title="写下来"
              description="记录想法和文字"
              onPress={() => handleAction('text')}
            />

            <CreateActionItem
              icon={ImageIcon}
              title="拍下来"
              description="保存照片和瞬间"
              onPress={() => handleAction('photo')}
            />
          </View>

          <View className="flex-row gap-3">
            <CreateActionItem
              icon={MicIcon}
              title="说出来"
              description="用声音记录此刻"
              onPress={() => handleAction('voice')}
            />

            <CreateActionItem
              icon={LinkIcon}
              title="存链接"
              description="保存值得回看的内容"
              onPress={() => handleAction('link')}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
