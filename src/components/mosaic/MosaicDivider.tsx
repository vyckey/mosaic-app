import { View } from 'react-native';

export type MosaicDividerTone = 'border' | 'border-muted' | 'primary' | 'border-strong';

export interface MosaicDividerProps {
  tone?: MosaicDividerTone;
  vertical?: boolean;
  className?: string;
}

const toneClassName: Record<MosaicDividerTone, string> = {
  border: 'bg-border',
  'border-muted': 'bg-border-muted',
  primary: 'bg-primary',
  'border-strong': 'bg-border-strong',
};

export function MosaicDivider({
  tone = 'border',
  vertical = false,
  className,
}: MosaicDividerProps) {
  return (
    <View
      className={[
        toneClassName[tone],
        vertical ? 'h-full w-px' : 'h-px w-full',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  );
}
