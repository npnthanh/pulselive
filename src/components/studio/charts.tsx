import React, { useEffect, useRef, useState } from 'react';
import { Table2, LineChart as LineChartIcon } from 'lucide-react';
import { cardCls, CHART_SURFACE, SERIES_COLOR } from './styles';
import { formatCompact, formatNumber } from './format';

export interface SeriesPoint {
  label: string;
  value: number;
}

interface ChartProps {
  data: SeriesPoint[];
  seriesName: string;
  formatValue?: (n: number) => string;
  height?: number;
}

const GRID = 'rgba(255,255,255,0.07)';
const AXIS = 'rgba(255,255,255,0.18)';
const TICK = '#9c9c9c';
const MARGIN = { top: 14, right: 14, bottom: 28, left: 52 };

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function niceScale(maxValue: number, tickCount = 4) {
  if (maxValue <= 0) return { max: tickCount, step: 1 };
  const rough = maxValue / tickCount;
  const pow = 10 ** Math.floor(Math.log10(rough));
  const n = rough / pow;
  const nice = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
  const step = nice * pow;
  return { max: step * Math.ceil(maxValue / step), step };
}

function useElementWidth<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

function xTickIndices(n: number, innerW: number) {
  const count = Math.min(n, Math.max(2, Math.floor(innerW / 72)));
  if (n <= 1) return [0];
  return Array.from(new Set(Array.from({ length: count }, (_, k) => Math.round((k * (n - 1)) / (count - 1)))));
}

/** Arrow-key navigation shared by both charts (same details on focus as on hover). */
function useKeyboardIndex(n: number, setActive: React.Dispatch<React.SetStateAction<number | null>>) {
  return {
    tabIndex: 0,
    onFocus: () => setActive((a) => a ?? n - 1),
    onBlur: () => setActive(null),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setActive((a) => Math.max(0, (a ?? n) - 1));
      else if (e.key === 'ArrowRight') setActive((a) => Math.min(n - 1, (a ?? -1) + 1));
      else return;
      e.preventDefault();
    },
  };
}

const Tooltip: React.FC<{ x: number; y: number; width: number; value: string; label: string; seriesName: string }> = ({
  x,
  y,
  width,
  value,
  label,
  seriesName,
}) => {
  const left = Math.min(Math.max(x, 70), Math.max(70, width - 70));
  return (
    <div
      className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-xl bg-[#0B0B10]/95 border border-white/12 px-3 py-2 shadow-xl whitespace-nowrap"
      style={{ left, top: y - 10 }}
    >
      <p className="text-sm font-extrabold text-white tabular-nums">{value}</p>
      <p className="flex items-center gap-1.5 text-[11px] text-zinc-400">
        <span className="inline-block w-3 h-0.5 rounded-full" style={{ background: SERIES_COLOR }} />
        {seriesName} · {label}
      </p>
    </div>
  );
};

const YAxis: React.FC<{ ticks: number[]; y: (v: number) => number; width: number; format: (n: number) => string }> = ({
  ticks,
  y,
  width,
  format,
}) => (
  <g>
    {ticks.map((t) => (
      <g key={t}>
        <line x1={MARGIN.left} x2={width - MARGIN.right} y1={y(t)} y2={y(t)} stroke={t === 0 ? AXIS : GRID} />
        <text x={MARGIN.left - 8} y={y(t)} dy="0.32em" textAnchor="end" fontSize={11} fill={TICK} className="tabular-nums">
          {format(t)}
        </text>
      </g>
    ))}
  </g>
);

/* ------------------------------------------------------------------ */
/* Line chart (single series)                                          */
/* ------------------------------------------------------------------ */

export const LineChart: React.FC<ChartProps> = ({ data, seriesName, formatValue = formatNumber, height = 240 }) => {
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);
  const keyboard = useKeyboardIndex(data.length, setActive);

  const n = data.length;
  const innerW = Math.max(0, width - MARGIN.left - MARGIN.right);
  const innerH = height - MARGIN.top - MARGIN.bottom;
  const { max, step } = niceScale(Math.max(0, ...data.map((d) => d.value)));
  const ticks = Array.from({ length: Math.round(max / step) + 1 }, (_, i) => i * step);
  const axisFormat = max >= 10_000 ? formatCompact : formatNumber;

  const x = (i: number) => MARGIN.left + (n <= 1 ? innerW / 2 : (i / (n - 1)) * innerW);
  const y = (v: number) => MARGIN.top + innerH - (v / max) * innerH;

  const line = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(d.value)}`).join(' ');
  const area = n > 0 ? `${line} L${x(n - 1)},${y(0)} L${x(0)},${y(0)} Z` : '';

  const handleMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (n === 0 || innerW <= 0) return;
    const px = e.clientX - e.currentTarget.getBoundingClientRect().left;
    const idx = n <= 1 ? 0 : Math.round(((px - MARGIN.left) / innerW) * (n - 1));
    setActive(Math.min(n - 1, Math.max(0, idx)));
  };

  return (
    <div ref={ref} className="relative w-full" style={{ height }}>
      {width > 0 && (
        <svg
          width={width}
          height={height}
          role="img"
          aria-label={`Biểu đồ đường: ${seriesName}. Dùng phím mũi tên để xem từng ngày.`}
          className="block outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded-lg"
          onPointerMove={handleMove}
          onPointerLeave={() => setActive(null)}
          {...keyboard}
        >
          <YAxis ticks={ticks} y={y} width={width} format={axisFormat} />
          {xTickIndices(n, innerW).map((i) => (
            <text key={i} x={x(i)} y={height - 8} textAnchor="middle" fontSize={11} fill={TICK} className="tabular-nums">
              {data[i].label}
            </text>
          ))}
          <path d={area} fill={SERIES_COLOR} fillOpacity={0.1} />
          <path d={line} fill="none" stroke={SERIES_COLOR} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          {active !== null && (
            <g>
              <line x1={x(active)} x2={x(active)} y1={MARGIN.top} y2={y(0)} stroke="rgba(255,255,255,0.35)" />
              <circle cx={x(active)} cy={y(data[active].value)} r={4} fill={SERIES_COLOR} stroke={CHART_SURFACE} strokeWidth={2} />
            </g>
          )}
        </svg>
      )}
      {active !== null && width > 0 && (
        <Tooltip
          x={x(active)}
          y={y(data[active].value)}
          width={width}
          value={formatValue(data[active].value)}
          label={data[active].label}
          seriesName={seriesName}
        />
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Column chart (single series)                                        */
/* ------------------------------------------------------------------ */

export const ColumnChart: React.FC<ChartProps> = ({ data, seriesName, formatValue = formatNumber, height = 240 }) => {
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);
  const keyboard = useKeyboardIndex(data.length, setActive);

  const n = data.length;
  const innerW = Math.max(0, width - MARGIN.left - MARGIN.right);
  const innerH = height - MARGIN.top - MARGIN.bottom;
  const { max, step } = niceScale(Math.max(0, ...data.map((d) => d.value)));
  const ticks = Array.from({ length: Math.round(max / step) + 1 }, (_, i) => i * step);
  const axisFormat = max >= 10_000 ? formatCompact : formatNumber;

  const band = n > 0 ? innerW / n : 0;
  const barW = Math.min(24, Math.max(2, band - 2));
  const cx = (i: number) => MARGIN.left + band * (i + 0.5);
  const y = (v: number) => MARGIN.top + innerH - (v / max) * innerH;
  const base = y(0);

  const barPath = (i: number, v: number) => {
    const top = y(v);
    const h = base - top;
    if (h <= 0) return '';
    const x0 = cx(i) - barW / 2;
    const x1 = x0 + barW;
    const r = Math.min(4, barW / 2, h);
    return `M${x0},${base} L${x0},${top + r} Q${x0},${top} ${x0 + r},${top} L${x1 - r},${top} Q${x1},${top} ${x1},${top + r} L${x1},${base} Z`;
  };

  return (
    <div ref={ref} className="relative w-full" style={{ height }}>
      {width > 0 && (
        <svg
          width={width}
          height={height}
          role="img"
          aria-label={`Biểu đồ cột: ${seriesName}. Dùng phím mũi tên để xem từng ngày.`}
          className="block outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded-lg"
          onPointerLeave={() => setActive(null)}
          {...keyboard}
        >
          <YAxis ticks={ticks} y={y} width={width} format={axisFormat} />
          {xTickIndices(n, innerW).map((i) => (
            <text key={i} x={cx(i)} y={height - 8} textAnchor="middle" fontSize={11} fill={TICK} className="tabular-nums">
              {data[i].label}
            </text>
          ))}
          {data.map((d, i) => (
            <path key={i} d={barPath(i, d.value)} fill={active === i ? '#6aabf1' : SERIES_COLOR} />
          ))}
          {/* Hit targets: the whole band, larger than the painted bar */}
          {data.map((_, i) => (
            <rect
              key={i}
              x={MARGIN.left + band * i}
              y={MARGIN.top}
              width={band}
              height={innerH}
              fill="transparent"
              onPointerEnter={() => setActive(i)}
            />
          ))}
        </svg>
      )}
      {active !== null && width > 0 && (
        <Tooltip
          x={cx(active)}
          y={y(data[active].value)}
          width={width}
          value={formatValue(data[active].value)}
          label={data[active].label}
          seriesName={seriesName}
        />
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Chart card with table view                                          */
/* ------------------------------------------------------------------ */

export const ChartCard: React.FC<{
  title: string;
  subtitle?: string;
  data: SeriesPoint[];
  formatValue?: (n: number) => string;
  valueHeader: string;
  children: React.ReactNode;
}> = ({ title, subtitle, data, formatValue = formatNumber, valueHeader, children }) => {
  const [showTable, setShowTable] = useState(false);
  return (
    <div className={`${cardCls} p-4 sm:p-5 min-w-0`}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-white">{title}</h3>
          {subtitle && <p className="text-[11px] text-zinc-500 mt-0.5">{subtitle}</p>}
        </div>
        <button
          onClick={() => setShowTable((s) => !s)}
          className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-zinc-400 hover:text-white hover:bg-white/8 border border-white/8 transition-colors cursor-pointer"
          aria-pressed={showTable}
        >
          {showTable ? <LineChartIcon className="w-3.5 h-3.5" /> : <Table2 className="w-3.5 h-3.5" />}
          {showTable ? 'Biểu đồ' : 'Dạng bảng'}
        </button>
      </div>
      {showTable ? (
        <div className="max-h-60 overflow-y-auto rounded-xl border border-white/8">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-[#1A1A24] text-zinc-400">
              <tr>
                <th className="text-left font-semibold px-3 py-2">Ngày</th>
                <th className="text-right font-semibold px-3 py-2">{valueHeader}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.map((d) => (
                <tr key={d.label}>
                  <td className="px-3 py-1.5 text-zinc-300 tabular-nums">{d.label}</td>
                  <td className="px-3 py-1.5 text-right text-white font-semibold tabular-nums">{formatValue(d.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        children
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Horizontal bars (share of total), value at the tip                  */
/* ------------------------------------------------------------------ */

export const HBarList: React.FC<{ items: { label: string; value: number }[]; formatValue: (n: number) => string }> = ({
  items,
  formatValue,
}) => {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.label} className="grid grid-cols-[minmax(0,9rem)_1fr] sm:grid-cols-[minmax(0,11rem)_1fr] items-center gap-3">
          <span className="text-xs text-zinc-300 truncate" title={item.label}>
            {item.label}
          </span>
          <span className="flex items-center gap-2 min-w-0">
            <span
              className="h-3 rounded-r-[4px]"
              style={{ width: `${(item.value / max) * 85}%`, background: SERIES_COLOR }}
            />
            <span className="text-xs font-bold text-white tabular-nums shrink-0">{formatValue(item.value)}</span>
          </span>
        </li>
      ))}
    </ul>
  );
};
