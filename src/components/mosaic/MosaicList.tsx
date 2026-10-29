import { Children, Fragment, isValidElement, type ReactNode } from 'react';
import { View } from 'react-native';

export interface MosaicListProps {
  /** Usually a set of MosaicListRow, but any row-level ReactNode is accepted */
  children: ReactNode;
  /** Insert a 1px divider between rows */
  divided?: boolean;
  className?: string;
}

/** Vertical list container inside a card; owns the dividers between rows. */
export function MosaicList({ children, divided = true, className }: MosaicListProps) {
  // Keep every renderable child (strings, numbers, fragments, ...) instead of
  // dropping non-element nodes. `Children.toArray` already removes null /
  // undefined / booleans and assigns stable keys.
  const items = Children.toArray(children);

  return (
    <View className={['w-full', className].filter(Boolean).join(' ')}>
      {items.map((child, index) => (
        // Non-element children have no key of their own, so fall back to the index.
        <Fragment key={isValidElement(child) ? (child.key ?? index) : index}>
          {divided && index > 0 && <View className="h-px bg-border" />}
          {child}
        </Fragment>
      ))}
    </View>
  );
}
