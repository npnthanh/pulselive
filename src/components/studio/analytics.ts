import { DAILY_STATS, type DailyStat } from '../../data/studioData';

export type MetricKey = 'views' | 'watchHours' | 'newFollowers' | 'coins' | 'peakViewers';

export interface PeriodSummary {
  days: DailyStat[];
  totals: Record<MetricKey, number>;
  /** Fractional change vs the previous period of equal length (null when no data) */
  deltas: Record<MetricKey, number | null>;
}

const METRICS: MetricKey[] = ['views', 'watchHours', 'newFollowers', 'coins', 'peakViewers'];

const aggregate = (rows: DailyStat[], key: MetricKey) =>
  key === 'peakViewers' ? Math.max(0, ...rows.map((r) => r[key])) : rows.reduce((s, r) => s + r[key], 0);

/** Totals for the last `length` days and the change vs the `length` days before. */
export function summarizePeriod(length: number, stats: DailyStat[] = DAILY_STATS): PeriodSummary {
  const days = stats.slice(-length);
  const previous = stats.slice(-length * 2, -length);
  const totals = {} as Record<MetricKey, number>;
  const deltas = {} as Record<MetricKey, number | null>;
  for (const key of METRICS) {
    totals[key] = aggregate(days, key);
    const prev = aggregate(previous, key);
    deltas[key] = previous.length === length && prev > 0 ? (totals[key] - prev) / prev : null;
  }
  return { days, totals, deltas };
}
