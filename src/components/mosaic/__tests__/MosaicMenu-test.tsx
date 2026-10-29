import { fireEvent, render, screen } from '@testing-library/react-native';
import { Pressable, Text, View } from 'react-native';

import { MosaicMenu } from '../MosaicMenu';
import { MosaicMenuItem } from '../MosaicMenuItem';
import { MosaicMenuSeparator } from '../MosaicMenuSeparator';

/**
 * `@expo/ui`'s MenuView renders native menus, so the JS side never paints the
 * actions. Replace it with a thin spy that renders the action tree it receives
 * and forwards presses back through `onPressAction` — exactly the contract
 * MosaicMenu relies on.
 */
jest.mock('@expo/ui/community/menu', () => {
  // Jest hoists this factory above the imports, so dependencies must be
  // resolved with `require()` here.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Text: RNText, View: RNView } = require('react-native');

  type MockAction = {
    id: string;
    title: string;
    subactions?: MockAction[];
    attributes?: { disabled?: boolean; hidden?: boolean };
  };

  // Keys are path-based because duplicate action ids are a case under test.
  function renderAction(
    action: MockAction,
    onPressAction: ((event: { nativeEvent: { event: string } }) => void) | undefined,
    keyPrefix: string,
  ): React.ReactNode {
    if (action.subactions) {
      return (
        <RNView key={`${keyPrefix}${action.id}`} testID={`section-${action.id}`}>
          {action.subactions.map((sub, index) =>
            renderAction(sub, onPressAction, `${keyPrefix}${index}-`),
          )}
        </RNView>
      );
    }

    return (
      <RNText
        key={`${keyPrefix}${action.id}`}
        testID={`action-${action.id}`}
        accessibilityState={{ disabled: action.attributes?.disabled === true }}
        onPress={() => onPressAction?.({ nativeEvent: { event: action.id } })}
      >
        {action.title}
      </RNText>
    );
  }

  return {
    MenuView: ({
      actions,
      onPressAction,
      children,
    }: {
      actions: MockAction[];
      onPressAction?: (event: { nativeEvent: { event: string } }) => void;
      children?: React.ReactNode;
    }) => (
      <RNView>
        {children}
        {actions.map((action, index) =>
          renderAction(action, onPressAction, `${index}-`),
        )}
      </RNView>
    ),
  };
});

interface MenuHarnessProps {
  onEdit?: () => void;
  onCopy?: () => void;
  onDelete?: () => void;
  editDisabled?: boolean;
  deleteHidden?: boolean;
}

function MenuHarness({
  onEdit,
  onCopy,
  onDelete,
  editDisabled,
  deleteHidden,
}: MenuHarnessProps) {
  return (
    <MosaicMenu
      trigger={
        <Pressable testID="menu-trigger">
          <Text>Open menu</Text>
        </Pressable>
      }
    >
      <MosaicMenuItem
        id="edit"
        icon="pencil"
        disabled={editDisabled}
        onPress={onEdit}
      >
        Edit
      </MosaicMenuItem>
      <MosaicMenuItem id="copy" icon="doc.on.doc" onPress={onCopy}>
        Copy
      </MosaicMenuItem>
      <MosaicMenuSeparator />
      <MosaicMenuItem
        id="delete"
        icon="trash"
        hidden={deleteHidden}
        destructive
        onPress={onDelete}
      >
        Delete
      </MosaicMenuItem>
    </MosaicMenu>
  );
}

/** Collects `[MosaicMenu]` dev warnings emitted during a test. */
function mosaicWarnings(spy: jest.SpyInstance): string[] {
  return spy.mock.calls
    .map((call) => String(call[0]))
    .filter((message) => message.startsWith('[MosaicMenu]'));
}

describe('MosaicMenu', () => {
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('renders the trigger and maps every item to a native action', async () => {
    await render(<MenuHarness />);

    expect(screen.getByTestId('menu-trigger')).toBeTruthy();
    expect(screen.getByText('Edit')).toBeTruthy();
    expect(screen.getByText('Copy')).toBeTruthy();
    expect(screen.getByText('Delete')).toBeTruthy();
    expect(mosaicWarnings(warnSpy)).toHaveLength(0);
  });

  it('calls the matching item handler when the native menu fires', async () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    await render(<MenuHarness onEdit={onEdit} onDelete={onDelete} />);

    await fireEvent.press(screen.getByTestId('action-edit'));
    await fireEvent.press(screen.getByTestId('action-delete'));

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('forwards the disabled flag to the native action attributes', async () => {
    await render(<MenuHarness editDisabled />);

    expect(screen.getByTestId('action-edit')).toBeDisabled();
    expect(screen.getByTestId('action-copy')).toBeEnabled();
  });

  it('turns separators into an inline group section (iOS)', async () => {
    await render(<MenuHarness />);

    // `jest-expo` runs the iOS platform, where a group after a separator
    // becomes an inline SwiftUI section.
    expect(screen.getByTestId('section-__mosaic-menu-group-0')).toBeTruthy();
  });

  it('discovers items declared inside a fragment', async () => {
    await render(
      <MosaicMenu trigger={<Text>Open</Text>}>
        <>
          <MosaicMenuItem id="first">First</MosaicMenuItem>
          <MosaicMenuItem id="second">Second</MosaicMenuItem>
        </>
      </MosaicMenu>,
    );

    expect(screen.getByTestId('action-first')).toBeTruthy();
    expect(screen.getByTestId('action-second')).toBeTruthy();
  });

  it('warns about duplicate ids and keeps the first handler', async () => {
    const first = jest.fn();
    const second = jest.fn();
    await render(
      <MosaicMenu trigger={<Text>Open</Text>}>
        <MosaicMenuItem id="same" onPress={first}>
          Rename
        </MosaicMenuItem>
        <MosaicMenuItem id="same" onPress={second}>
          Rename again
        </MosaicMenuItem>
      </MosaicMenu>,
    );

    expect(mosaicWarnings(warnSpy).join('\n')).toContain('Duplicate MosaicMenuItem id "same"');

    await fireEvent.press(screen.getAllByTestId('action-same')[0]);
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).not.toHaveBeenCalled();
  });

  it('warns about unsupported children instead of ignoring them silently', async () => {
    await render(
      <MosaicMenu trigger={<Text>Open</Text>}>
        <View testID="stray-child" />
        <MosaicMenuItem id="only">Only</MosaicMenuItem>
      </MosaicMenu>,
    );

    // Stray children are neither painted nor turned into native actions, but
    // the misuse is surfaced in development.
    expect(screen.queryByTestId('stray-child')).toBeNull();
    expect(screen.getByTestId('action-only')).toBeTruthy();
    expect(mosaicWarnings(warnSpy).join('\n')).toContain('Unsupported child');
  });

  it('warns when an id uses the reserved prefix', async () => {
    await render(
      <MosaicMenu trigger={<Text>Open</Text>}>
        <MosaicMenuItem id="__mosaic-menu-group-0">Collision</MosaicMenuItem>
      </MosaicMenu>,
    );

    expect(mosaicWarnings(warnSpy).join('\n')).toContain('reserved');
  });

  it('makes the trigger transparent to touches so MenuView owns the gesture', async () => {
    await render(<MenuHarness />);

    // On Android `MenuView` wraps the trigger in its own Pressable; a nested
    // Pressable would claim the responder and the menu would never open.
    let node = screen.getByTestId('menu-trigger').parent;
    while (node && node.props.pointerEvents !== 'none') {
      node = node.parent;
    }
    expect(node).not.toBeNull();
  });

  it('warns when the menu has no items', async () => {
    await render(<MosaicMenu trigger={<Text>Open</Text>}>{null}</MosaicMenu>);

    expect(mosaicWarnings(warnSpy).join('\n')).toContain('menu will be empty');
  });
});
