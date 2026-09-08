import { Text, TextProps } from 'react-native';

type ThemedTextType =
  | 'default'
  | 'title'
  | 'subtitle'
  | 'small'
  | 'smallBold'
  | 'code'
  | 'link'
  | 'linkPrimary';

type ThemedTextProps = TextProps & {
  className?: string;
  type?: ThemedTextType;
};

const typeClassNames: Record<ThemedTextType, string> = {
  default: 'text-base text-foreground',
  title: 'text-4xl font-bold text-foreground',
  subtitle: 'text-2xl font-semibold text-foreground',
  small: 'text-sm text-foreground',
  smallBold: 'text-sm font-semibold text-foreground',
  code: 'font-mono text-sm text-muted-foreground',
  link: 'text-sm font-medium text-primary',
  linkPrimary: 'text-sm font-medium text-primary',
};

export function ThemedText({
  className,
  type = 'default',
  ...props
}: ThemedTextProps) {
  const typeClassName = typeClassNames[type];

  return (
    <Text className={`${typeClassName} ${className ?? ''}`.trim()} {...props} />
  );
}
