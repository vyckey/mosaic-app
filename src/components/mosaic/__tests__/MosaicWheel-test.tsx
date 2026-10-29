import { fireEvent, render, screen } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import {
  clampIndex,
  nearestIndex,
  normalizeVisibleCount,
  wheelPadding,
} from '../wheel/wheelUtils';
import { MosaicWheelPicker } from '../wheel/MosaicWheelPicker';

const years = [2023, 2024, 2025];
const months = [1, 2, 3];

const columns = [
  {
    key: 'year',
    label: 'Year',
    items: years.map((year) => ({ value: year, label: String(year) })),
  },
  {
    key: 'month',
    label: 'Month',
    items: months.map((month) => ({ value: month, label: String(month) })),
  },
];

describe('wheel geometry helpers', () => {
  it('forces an odd visible row count of at least three', () => {
    expect(normalizeVisibleCount(5)).toBe(5);
    expect(normalizeVisibleCount(4)).toBe(5);
    expect(normalizeVisibleCount(2)).toBe(3);
    expect(normalizeVisibleCount(0)).toBe(3);
    expect(normalizeVisibleCount(Number.NaN)).toBe(5);
  });

  it('clamps indexes into the list', () => {
    expect(clampIndex(2, 3)).toBe(2);
    expect(clampIndex(-1, 3)).toBe(0);
    expect(clampIndex(9, 3)).toBe(2);
    expect(clampIndex(4, 0)).toBe(0);
  });

  it('reads the nearest row, ignoring overscroll', () => {
    expect(nearestIndex(0, 40, 10)).toBe(0);
    expect(nearestIndex(19, 40, 10)).toBe(0);
    expect(nearestIndex(21, 40, 10)).toBe(1);
    expect(nearestIndex(-120, 40, 10)).toBe(0);
    expect(nearestIndex(4000, 40, 10)).toBe(9);
    expect(nearestIndex(80, 0, 10)).toBe(0);
  });

  it('pads half a viewport so the first row starts centred', () => {
    expect(wheelPadding(40, 5)).toBe(80);
    expect(wheelPadding(40, 4)).toBe(80);
  });
});

describe('MosaicWheelPicker', () => {
  // GestureHandlerRootView is required by GestureDetector; the app provides one
  // at the root, and MosaicDialog provides its own inside the modal.
  const renderWheel = (node: ReactNode) =>
    render(<GestureHandlerRootView>{node}</GestureHandlerRootView>);

  it('renders every column from the value map', async () => {
    await renderWheel(
      <MosaicWheelPicker
        columns={columns}
        value={{ year: 2024, month: 2 }}
        onChange={() => {}}
      />,
    );

    expect(screen.getByText('2024')).toBeTruthy();
    expect(screen.getByText('2')).toBeTruthy();
    expect(screen.getByLabelText('Year')).toBeTruthy();
    expect(screen.getByLabelText('Month')).toBeTruthy();
  });

  it('steps a column through the accessibility actions', async () => {
    const onChange = jest.fn();
    await renderWheel(
      <MosaicWheelPicker
        columns={columns}
        value={{ year: 2024, month: 2 }}
        onChange={onChange}
      />,
    );

    await fireEvent(screen.getByLabelText('Year'), 'accessibilityAction', {
      nativeEvent: { actionName: 'increment' },
    });

    expect(onChange).toHaveBeenCalledWith({ year: 2025, month: 2 });
  });

  it('does not report a step past the end of the column', async () => {
    const onChange = jest.fn();
    await renderWheel(
      <MosaicWheelPicker
        columns={columns}
        value={{ year: 2023, month: 2 }}
        onChange={onChange}
      />,
    );

    await fireEvent(screen.getByLabelText('Year'), 'accessibilityAction', {
      nativeEvent: { actionName: 'decrement' },
    });

    expect(onChange).not.toHaveBeenCalled();
  });
});
