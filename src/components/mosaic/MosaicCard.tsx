import React from 'react';
import { Platform, type ViewStyle } from 'react-native';

import { Card } from '@/components/ui/card';
import { useTheme } from '@/hooks/use-theme';

type BaseCardProps = React.ComponentProps<typeof Card>;

export type MosaicCardTone =
  | 'default' // --paper 白卡片
  | 'soft' // --paper2 浅底卡片
  | 'sage' // --sage2 鼠尾草底（画像 / 周回顾）
  | 'lav' // .lav 薰衣草底（每日一问 / MBTI）
  | 'clay' // .clay 陶土底（人生故事）
  | 'insight'; // 左侧 4px 鼠尾草强调条（AI 发现）

export interface MosaicCardProps extends BaseCardProps {
  tone?: MosaicCardTone;
  padded?: boolean;
}

const toneClassName: Record<MosaicCardTone, string> = {
  default: 'bg-surface border-border',
  soft: 'bg-surface-muted border-border-muted',
  sage: 'bg-primary-muted border-transparent',
  lav: 'bg-accent-lav-muted border-transparent',
  clay: 'bg-accent-clay-muted border-transparent',
  insight: 'bg-surface border-border border-l-4 border-l-primary',
};

export function MosaicCard({
  tone = 'default',
  padded = true,
  className,
  style,
  ...props
}: MosaicCardProps) {
  const theme = useTheme();
  const isWeb = Platform.OS === 'web';
  const shadowStyle: ViewStyle | undefined = isWeb
    ? undefined
    : theme.shadows.card;

  return (
    <Card
      {...props}
      style={shadowStyle ? [shadowStyle, style] : style}
      className={[
        'gap-0 rounded-card border',
        padded && 'p-[18px]',
        toneClassName[tone],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  );
}
