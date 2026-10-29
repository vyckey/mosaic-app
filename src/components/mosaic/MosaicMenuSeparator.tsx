/**
 * Divider between `MosaicMenu` groups.
 *
 * Native menus can't paint arbitrary rows, so this is not a rendered component:
 * `MosaicMenu` turns it into a group boundary (a SwiftUI `Section` on iOS).
 * It must stay a DIRECT child of `MosaicMenu`.
 *
 * Note: Android Material menus draw no group dividers, so separators are
 * ignored there.
 */
export function MosaicMenuSeparator() {
  return null;
}

MosaicMenuSeparator.displayName = 'MosaicMenuSeparator';
