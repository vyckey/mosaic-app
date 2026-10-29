import { fireEvent, render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { lightTheme } from '@/theme';

import { MosaicHeatmap } from '../MosaicHeatmap';

jest.mock('@/i18n/useI18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
}));

const rowLabels = ['W1', 'W2'];
const columnLabels = ['Mon', 'Tue'];
const data = [
  [0, 3],
  [null, 6],
];

describe('MosaicHeatmap', () => {
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('makes in-range cells pressable and reports the tapped cell', async () => {
    const onCellPress = jest.fn();

    await render(
      <MosaicHeatmap
        data={data}
        rowLabels={rowLabels}
        columnLabels={columnLabels}
        onCellPress={onCellPress}
      />,
    );

    const cells = screen.getAllByRole('button');
    expect(cells).toHaveLength(3); // the null slot is not pressable

    await fireEvent.press(cells[1]);
    expect(onCellPress).toHaveBeenCalledWith(
      expect.objectContaining({
        rowIndex: 0,
        columnIndex: 1,
        rowLabel: 'W1',
        columnLabel: 'Tue',
        value: 3,
      }),
    );
  });

  it('builds a fallback accessibility label from row, column and value', async () => {
    await render(
      <MosaicHeatmap
        data={data}
        rowLabels={rowLabels}
        columnLabels={columnLabels}
        onCellPress={() => {}}
      />,
    );

    expect(screen.getByLabelText('W1, Mon, 0')).toBeTruthy();
    expect(screen.getByLabelText('W2, Tue, 6')).toBeTruthy();
  });

  it('prefers a custom accessibility label and forwards the hint', async () => {
    await render(
      <MosaicHeatmap
        data={data}
        rowLabels={rowLabels}
        columnLabels={columnLabels}
        accessibilityLabel={(cell) =>
          `${cell.rowLabel} ${cell.columnLabel}: ${cell.value}`
        }
        accessibilityHint="Open the day"
        onCellPress={() => {}}
      />,
    );

    const cell = screen.getByLabelText('W1 Tue: 3');
    expect(cell.props.accessibilityHint).toBe('Open the day');
  });

  it('marks only the selected cell and highlights it with a primaryStrong border', async () => {
    await render(
      <MosaicHeatmap
        data={data}
        rowLabels={rowLabels}
        columnLabels={columnLabels}
        selectedCell={{ rowIndex: 0, columnIndex: 1 }}
        onCellPress={() => {}}
      />,
    );

    const selected = screen.getByLabelText('W1, Tue, 3');
    const unselected = screen.getByLabelText('W1, Mon, 0');

    expect(selected.props.accessibilityState).toEqual({ selected: true });
    expect(unselected.props.accessibilityState).toEqual({ selected: false });

    const selectedStyle = StyleSheet.flatten(selected.props.style);
    expect(selectedStyle.borderWidth).toBe(2);
    expect(selectedStyle.borderColor).toBe(lightTheme.colors.primaryStrong);
  });

  it('updates the highlight when selectedCell changes', async () => {
    const { rerender } = await render(
      <MosaicHeatmap
        data={data}
        rowLabels={rowLabels}
        columnLabels={columnLabels}
        selectedCell={{ rowIndex: 0, columnIndex: 0 }}
        onCellPress={() => {}}
      />,
    );

    expect(
      screen.getByLabelText('W1, Mon, 0').props.accessibilityState,
    ).toEqual({ selected: true });

    await rerender(
      <MosaicHeatmap
        data={data}
        rowLabels={rowLabels}
        columnLabels={columnLabels}
        selectedCell={{ rowIndex: 0, columnIndex: 1 }}
        onCellPress={() => {}}
      />,
    );

    expect(
      screen.getByLabelText('W1, Mon, 0').props.accessibilityState,
    ).toEqual({ selected: false });
    expect(
      screen.getByLabelText('W1, Tue, 3').props.accessibilityState,
    ).toEqual({ selected: true });
  });

  it('uses a fixed cell size when provided', async () => {
    await render(
      <MosaicHeatmap
        data={data}
        rowLabels={rowLabels}
        columnLabels={columnLabels}
        cellSize={20}
        onCellPress={() => {}}
      />,
    );

    const cell = screen.getByLabelText('W1, Mon, 0');
    const cellStyle = StyleSheet.flatten(cell.props.style);

    expect(cellStyle.width).toBe(20);
    expect(cellStyle.height).toBe(20);
  });

  it('keeps the touch target inside the cell gap', async () => {
    await render(
      <MosaicHeatmap
        data={data}
        columnLabels={columnLabels}
        cellGap={4}
        onCellPress={() => {}}
      />,
    );

    expect(screen.getAllByRole('button')[0].props.hitSlop).toBe(2);
  });

  it('hides labels without dropping their data', async () => {
    await render(
      <MosaicHeatmap
        data={data}
        rowLabels={rowLabels}
        columnLabels={columnLabels}
        showColumnLabels={false}
        showRowLabels={false}
      />,
    );

    expect(screen.queryByText('Mon')).toBeNull();
    expect(screen.queryByText('W1')).toBeNull();
  });

  it('renders the legend captions', async () => {
    await render(
      <MosaicHeatmap
        data={data}
        columnLabels={columnLabels}
        showLegend
        lessLabel="Low"
        moreLabel="High"
      />,
    );

    expect(screen.getByText('Low')).toBeTruthy();
    expect(screen.getByText('High')).toBeTruthy();
  });

  it('warns when the color ramp is invalid and falls back to the theme', async () => {
    await render(
      <MosaicHeatmap
        data={data}
        columnLabels={columnLabels}
        colors={['#000000']}
      />,
    );

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('at least 2 entries'),
    );
  });

  it('warns when max is passed to a non-linear scale', async () => {
    await render(
      <MosaicHeatmap
        data={data}
        columnLabels={columnLabels}
        scale="quantile"
        max={10}
      />,
    );

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('only applies to scale="linear"'),
    );
  });

  it('rejects thresholds that do not match the number of activity levels', async () => {
    await expect(
      render(
        <MosaicHeatmap
          data={data}
          columnLabels={columnLabels}
          scale="thresholds"
          thresholds={[2, 5]}
        />,
      ),
    ).rejects.toThrow(/exactly 3 entries/);
  });
});
