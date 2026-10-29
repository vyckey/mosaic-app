import {
  MenuView,
  type MenuAction,
  type NativeActionEvent,
} from '@expo/ui/community/menu';
import { Children, Fragment, isValidElement, useCallback, useMemo } from 'react';
import type { ReactElement, ReactNode } from 'react';
import type { ColorSchemeName, StyleProp, ViewStyle } from 'react-native';
import { Platform, View } from 'react-native';

import { MosaicMenuItem } from './MosaicMenuItem';
import type { MosaicMenuItemProps } from './MosaicMenuItem';
import { MosaicMenuSeparator } from './MosaicMenuSeparator';

export interface MosaicMenuProps {
  /**
   * The element that opens the menu. The native menu owns the gesture: a tap
   * (or a long-press when `shouldOpenOnLongPress` is set) anywhere on it opens
   * the menu.
   */
  trigger: ReactNode;
  /** Menu entries: `MosaicMenuItem` / `MosaicMenuSeparator` only. */
  children: ReactNode;
  /** Open on long-press instead of tap (context-menu style). */
  shouldOpenOnLongPress?: boolean;
  /** Menu title shown above the actions (iOS only). */
  title?: string;
  /** Menu colour scheme on Android; omit to follow the device setting. */
  colorScheme?: ColorSchemeName;
  /**
   * Style applied to the native menu trigger container. It affects the trigger
   * box only — the popup menu panel is owned and styled by the platform.
   */
  style?: StyleProp<ViewStyle>;
}

type MenuModel = {
  actions: MenuAction[];
  handlers: Map<string, () => void>;
};

/**
 * Id namespace reserved for the synthetic inline-section actions. Feature ids
 * must not use it, otherwise a real action could collide with a group wrapper.
 */
const RESERVED_ID_PREFIX = '__mosaic-menu-';

/** Development-only diagnostics; silent in production builds. */
function warnDev(message: string) {
  if (__DEV__) {
    console.warn(`[MosaicMenu] ${message}`);
  }
}

/**
 * Flattens fragments so items declared inside `<>...</>` (common when items
 * are conditionally rendered) are still discovered.
 *
 * Arbitrary wrapper components are intentionally NOT traversed: `MosaicMenu` is
 * a declarative menu description, not a general-purpose render container, so
 * hiding an item behind a custom component is a mistake worth surfacing.
 */
function flattenMenuChildren(children: ReactNode): ReactNode[] {
  return Children.toArray(children).flatMap((child) => {
    if (
      isValidElement<{ children?: ReactNode }>(child) &&
      child.type === Fragment
    ) {
      return flattenMenuChildren(child.props.children);
    }

    return [child];
  });
}

/** Converts the declarative children into the native action tree. */
function buildMenuModel(children: ReactNode): MenuModel {
  const groups: MenuAction[][] = [[]];
  const handlers = new Map<string, () => void>();
  const seenIds = new Set<string>();
  let itemCount = 0;

  for (const child of flattenMenuChildren(children)) {
    if (!isValidElement(child)) {
      continue;
    }

    if (child.type === MosaicMenuSeparator) {
      // Consecutive separators collapse into one group boundary.
      if (groups[groups.length - 1].length > 0) {
        groups.push([]);
      }
      continue;
    }

    if (child.type !== MosaicMenuItem) {
      warnDev(
        'Unsupported child ignored. Only MosaicMenuItem and ' +
          'MosaicMenuSeparator are supported (wrap conditional items in a ' +
          'fragment, not a custom component).',
      );
      continue;
    }

    const props = (child as ReactElement<MosaicMenuItemProps>).props;
    const { id } = props;

    // Ids are the action identity on the native side: a duplicate makes two
    // rows report the same event, so the first handler would win silently.
    if (seenIds.has(id)) {
      warnDev(`Duplicate MosaicMenuItem id "${id}". Ids must be unique.`);
    } else {
      seenIds.add(id);
    }

    if (id.startsWith(RESERVED_ID_PREFIX)) {
      warnDev(
        `MosaicMenuItem id "${id}" uses the reserved "${RESERVED_ID_PREFIX}" ` +
          'prefix.',
      );
    }

    const attributes = {
      ...(props.destructive ? { destructive: true } : null),
      ...(props.disabled ? { disabled: true } : null),
      ...(props.hidden ? { hidden: true } : null),
    };

    itemCount += 1;
    groups[groups.length - 1].push({
      id,
      title: props.children,
      ...(props.icon ? { image: props.icon } : null),
      ...(Object.keys(attributes).length > 0 ? { attributes } : null),
    });

    if (props.onPress && !handlers.has(id)) {
      handlers.set(id, props.onPress);
    }
  }

  if (itemCount === 0) {
    warnDev('No MosaicMenuItem children: the menu will be empty.');
  }

  const filledGroups = groups.filter((group) => group.length > 0);

  // A single group (or Android, whose Material menus have no group dividers)
  // renders as one flat list.
  if (filledGroups.length <= 1 || Platform.OS !== 'ios') {
    return { actions: filledGroups.flat(), handlers };
  }

  // iOS: every group after the first becomes an inline section, which SwiftUI
  // separates from the previous group with a divider. An empty title is the
  // documented way to render a header-less section — `SectionView` checks
  // `!title.isEmpty` before drawing a header.
  const [firstGroup, ...otherGroups] = filledGroups;
  return {
    actions: [
      ...firstGroup,
      ...otherGroups.map(
        (group, index): MenuAction => ({
          id: `${RESERVED_ID_PREFIX}group-${index}`,
          title: '',
          subactions: group,
          displayInline: true,
        }),
      ),
    ],
    handlers,
  };
}

/**
 * Themed wrapper around `@expo/ui`'s native `MenuView` (SwiftUI `Menu` on iOS,
 * Compose `DropdownMenu` on Android).
 *
 * The menu chrome is owned by the platform, so there is no panel styling or
 * custom row content: labels, icons, destructive tinting and separators all
 * come from the native menu. Prefer this over gluestack's menu for action
 * lists — it renders natively and keeps the TypeScript graph light.
 *
 * The trigger only needs to render the button chrome: `MenuView` owns the tap
 * gesture, so the trigger content is wrapped in a touch-transparent view and
 * any `Pressable` inside it will not fire its own `onPress`. Put the action in
 * a `MosaicMenuItem` instead.
 *
 * ```tsx
 * <MosaicMenu
 *   trigger={
 *     <MosaicPressable accessibilityLabel={t('common.more')}>
 *       <MosaicIcon as={MoreHorizontal} />
 *     </MosaicPressable>
 *   }
 * >
 *   <MosaicMenuItem id="edit" icon="pencil" onPress={edit}>Edit</MosaicMenuItem>
 *   <MosaicMenuSeparator />
 *   <MosaicMenuItem id="delete" icon="trash" destructive onPress={remove}>
 *     Delete
 *   </MosaicMenuItem>
 * </MosaicMenu>
 * ```
 *
 * Web is not supported by `MenuView`: the trigger renders, but the native
 * actions never open (the platform emits a one-time dev warning for this).
 */
export function MosaicMenu({
  trigger,
  children,
  shouldOpenOnLongPress,
  title,
  colorScheme,
  style,
}: MosaicMenuProps) {
  const { actions, handlers } = useMemo(
    () => buildMenuModel(children),
    [children],
  );

  const handlePressAction = useCallback(
    ({ nativeEvent }: NativeActionEvent) => {
      handlers.get(nativeEvent.event)?.();
    },
    [handlers],
  );

  return (
    <MenuView
      actions={actions}
      onPressAction={handlePressAction}
      shouldOpenOnLongPress={shouldOpenOnLongPress}
      title={title}
      colorScheme={colorScheme}
      style={style}
    >
      {/*
       * `MenuView` owns the trigger gesture by wrapping its children in its own
       * `Pressable`. Any interactive view passed as the trigger (a Pressable, a
       * button, ...) would become the touch responder first and swallow the
       * tap, so Android never opens the menu. Making the hosted content
       * transparent to touches hands the gesture to `MenuView`, which is the
       * only component allowed to react here.
       */}
      <View pointerEvents="none">{trigger}</View>
    </MenuView>
  );
}
