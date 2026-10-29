/** Compact counter for metric cards: `892`, `12.5k`, `24k`. */
export function formatCompactNumber(value: number): string {
  if (!Number.isFinite(value) || value === 0) {
    return '0';
  }

  const absolute = Math.abs(value);

  if (absolute >= 10_000) {
    return `${Math.round(value / 1000)}k`;
  }

  if (absolute >= 1000) {
    const compact = value / 1000;
    return `${Number.isInteger(compact) ? compact : compact.toFixed(1)}k`;
  }

  return String(Math.round(value));
}

/** `↑ 12%` / `↓ 8%` / `0%`; `null` hides the caption. */
export function formatChange(percent: number | null): string | undefined {
  if (percent === null) {
    return undefined;
  }

  if (percent === 0) {
    return '0%';
  }

  return `${percent > 0 ? '↑' : '↓'} ${Math.abs(percent)}%`;
}

/** Semantic tone for a comparison caption. */
export function changeTone(
  percent: number | null,
): 'success' | 'danger' | 'text-muted' {
  if (percent === null || percent === 0) {
    return 'text-muted';
  }
  return percent > 0 ? 'success' : 'danger';
}
