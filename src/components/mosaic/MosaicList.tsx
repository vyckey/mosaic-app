import { Children, Fragment, isValidElement, type ReactNode } from 'react';
import { View } from 'react-native';

export interface MosaicListProps {
  /** 通常放一组 MosaicListRow，也可以是任意行级内容 */
  children: ReactNode;
  /** 行间插入 1px 分隔线（原型 .frag border-bottom） */
  divided?: boolean;
  className?: string;
}

/** 卡片内的垂直列表容器，负责行与行之间的分隔线 */
export function MosaicList({ children, divided = true, className }: MosaicListProps) {
  const items = Children.toArray(children).filter(isValidElement);

  return (
    <View className={['w-full', className].filter(Boolean).join(' ')}>
      {items.map((child, index) => (
        <Fragment key={child.key ?? index}>
          {divided && index > 0 && <View className="h-px bg-border" />}
          {child}
        </Fragment>
      ))}
    </View>
  );
}
