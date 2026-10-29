import type { MenuAction } from '@expo/ui/community/menu';

/**
 * Declarative descriptor for a single `MosaicMenu` entry.
 *
 * `@expo/ui`'s native `MenuView` only accepts plain data (`MenuAction[]`) and
 * renders the rows itself, so there is no custom row to paint: this component
 * renders nothing and `MosaicMenu` reads its props while building the native
 * action list. Because of that contract it must stay a DIRECT child of
 * `MosaicMenu` (wrapping it in an arbitrary custom component hides it).
 */
export interface MosaicMenuItemProps {
  /**
   * Unique action identifier. Required, and stable across label changes: the
   * native menu reports this value back on press and translations must not
   * alter an action's identity. Must not start with the reserved
   * `__mosaic-menu-` prefix, which `MosaicMenu` uses for synthetic group
   * entries.
   */
  id: string;
  /** Label text shown in the native menu. */
  children: string;
  /**
   * Optional leading icon. Native menus draw their own icons, so this accepts
   * what the platform understands rather than a React component:
   *
   * - `SFSymbol` name (e.g. `'pencil'`) — rendered on iOS only.
   * - `ImageSourcePropType` — rendered on Android only.
   *
   * There is no cross-platform icon conversion by design; respecting each
   * platform's native capability beats emulating one on the other.
   */
  icon?: MenuAction['image'];
  /** Destructive action: rendered with the native destructive (red) style. */
  destructive?: boolean;
  /** Disabled item: dimmed and non-interactive. */
  disabled?: boolean;
  /** Hide the item without removing it from the tree (e.g. permissions). */
  hidden?: boolean;
  /** Called when the item is selected. */
  onPress?: () => void;
}

/**
 * Mosaic menu entry.
 *
 * Not a rendered component: see the contract note above. It exists so features
 * keep a declarative, typed menu description instead of hand-writing
 * `MenuAction` objects.
 */
export function MosaicMenuItem(_props: MosaicMenuItemProps) {
  return null;
}

MosaicMenuItem.displayName = 'MosaicMenuItem';
