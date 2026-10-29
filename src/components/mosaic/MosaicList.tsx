import { Children, Fragment, isValidElement, type ReactNode } from 'react';
import { View } from 'react-native';

import { getMosaicListRowLeadingInset } from './MosaicListRow';

export interface MosaicListProps {
  /** Usually a set of MosaicListRow, but any row-level ReactNode is accepted */
  children: ReactNode;
  /** Insert a 1px divider between rows */
  divided?: boolean;
  className?: string;
}

/**
 * Leading inset of the divider that closes `row`: a divider belongs to the row
 * above it, so it stops before that row's time / emoji / icon / leading block
 * instead of running underneath it. Plain text rows keep a full-width rule.
 */
function dividerInset(row: ReactNode): number {
  if (!isValidElement(row)) {
    return 0;
  }

  return getMosaicListRowLeadingInset(
    row.props as Parameters<typeof getMosaicListRowLeadingInset>[0],
  );
}

/** Vertical list container inside a card; owns the dividers between rows. */
export function MosaicList({ children, divided = true, className }: MosaicListProps) {
  // Keep every renderable child (strings, numbers, fragments, ...) instead of
  // dropping non-element nodes. `Children.toArray` already removes null /
  // undefined / booleans and assigns stable keys.
  const items = Children.toArray(children);

  return (
    <View className={['w-full', className].filter(Boolean).join(' ')}>
      {items.map((child, index) => {
        const inset = index > 0 ? dividerInset(items[index - 1]) : 0;

        return (
          // Non-element children have no key of their own, so fall back to the index.
          <Fragment key={isValidElement(child) ? (child.key ?? index) : index}>
            {divided && index > 0 && (
              <View
                className="h-px bg-border"
                style={inset > 0 ? { marginLeft: inset } : undefined}
              />
            )}
            {child}
          </Fragment>
        );
      })}
    </View>
  );
}
