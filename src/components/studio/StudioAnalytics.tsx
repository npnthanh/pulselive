import React, { useMemo, useState } from 'react';
import { Eye, Clock, UserPlus, Coins, CalendarRange, Check } from 'lucide-react';
import type { StudioState } from './useStudioState';
import { summarizePeriod } from './analytics';
import { StatTile, SectionTitle } from './studioUi';
import { ChartCard, ColumnChart, HBarList, LineChart } from './charts';
import { cardCls } from './styles';
import { formatCompact, formatDate, formatDuration, formatNumber } from './format';
import { TRAFFIC_SOURCES } from '../../data/studioData';

const RANGES = [
  { days: 7, label: '7 ngày qua' },
  { days: 28, label: '28 ngày qua' },
  { days: 90, label: '90 ngày qua' },
];

export const StudioAnalytics: React.FC<{ studio: StudioState }> = ({ studio }) => {
  const [range, setRange] = useState(28);
  const summary = useMemo(() => summarizePeriod(range), [range]);
  const compareLabel = `so với ${range} ngày trước`;

  const series = (key: 'views' | 'newFollowers' | 'coins') =>
    summary.days.map((d) => ({ label: d.label, value: d[key] }));

  const rangeStart = summary.days[0]?.date;
  const topStreams = useMemo(
    () =>
      studio.vods
        .filter((v) => !rangeStart || v.startedAt >= rangeStart)
        .sort((a, b) => b.views - a.views)
        .slice(0, 5),
    [studio.vods, rangeStart]
  );

  return (
    <div className="space-y-6">
      <SectionTitle title="Phân tích dữ liệu" description="Hiệu quả kênh theo thời gian. Bộ lọc áp dụng cho mọi số liệu bên dưới." />

      {/* Filters: one row, above everything they scope */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 mr-1">
          <CalendarRange className="w-4 h-4" /> Khoảng thời gian
        </span>
        <div className="inline-flex p-1 rounded-xl bg-white/5 border border-white/8">
          {RANGES.map((r) => (
            <button
              key={r.days}
              onClick={() => setRange(r.days)}
              aria-pressed={range === r.days}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                range === r.days ? 'bg-white text-slate-950' : 'text-zinc-400 hover:text-white hover:bg-white/6'
              }`}
            >
              {range === r.days && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
              {r.label}
            </button>
          ))}
        </div>
        {rangeStart && (
          <span className="text-[11px] text-zinc-500 tabular-nums">
            {formatDate(rangeStart)} – {formatDate(summary.days[summary.days.length - 1].date)}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatTile label="Lượt xem" icon={<Eye className="w-3.5 h-3.5" />} value={formatCompact(summary.totals.views)} delta={summary.deltas.views} deltaLabel={compareLabel} />
        <StatTile label="Giờ xem" icon={<Clock className="w-3.5 h-3.5" />} value={formatCompact(summary.totals.watchHours)} delta={summary.deltas.watchHours} deltaLabel={compareLabel} />
        <StatTile label="Người theo dõi mới" icon={<UserPlus className="w-3.5 h-3.5" />} value={formatCompact(summary.totals.newFollowers)} delta={summary.deltas.newFollowers} deltaLabel={compareLabel} />
        <StatTile label="Xu nhận được" icon={<Coins className="w-3.5 h-3.5" />} value={formatCompact(summary.totals.coins)} delta={summary.deltas.coins} deltaLabel={compareLabel} />
      </div>

      <ChartCard
        title="Lượt xem theo ngày"
        subtitle={`Người xem cao nhất trong kỳ: ${formatNumber(summary.totals.peakViewers)}`}
        data={series('views')}
        valueHeader="Lượt xem"
      >
        <LineChart data={series('views')} seriesName="Lượt xem" height={260} />
      </ChartCard>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <ChartCard title="Người theo dõi mới theo ngày" data={series('newFollowers')} valueHeader="Người theo dõi mới">
          <ColumnChart data={series('newFollowers')} seriesName="Người theo dõi mới" />
        </ChartCard>
        <ChartCard title="Xu nhận được theo ngày" data={series('coins')} valueHeader="Xu" formatValue={(n) => `${formatNumber(n)} Xu`}>
          <ColumnChart data={series('coins')} seriesName="Xu nhận được" formatValue={(n) => `${formatNumber(n)} Xu`} />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.3fr] gap-4">
        <div className={`${cardCls} p-4 sm:p-5`}>
          <h3 className="text-sm font-bold text-white">Nguồn người xem</h3>
          <p className="text-[11px] text-zinc-500 mt-0.5 mb-4">Tỉ lệ lượt xem theo nơi người xem tìm thấy buổi live</p>
          <HBarList items={TRAFFIC_SOURCES.map((s) => ({ label: s.label, value: s.share }))} formatValue={(n) => `${n}%`} />
        </div>

        <div className={`${cardCls} p-4 sm:p-5 min-w-0`}>
          <h3 className="text-sm font-bold text-white">Buổi live nổi bật</h3>
          <p className="text-[11px] text-zinc-500 mt-0.5 mb-3">Xếp theo lượt xem trong kỳ</p>
          {topStreams.length === 0 ? (
            <p className="py-6 text-center text-xs text-zinc-500">Không có buổi live nào trong khoảng thời gian này.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="text-zinc-500">
                  <tr className="border-b border-white/8">
                    <th className="text-left font-semibold py-2 pr-3">Buổi live</th>
                    <th className="text-right font-semibold py-2 px-2">Thời lượng</th>
                    <th className="text-right font-semibold py-2 px-2">Đỉnh</th>
                    <th className="text-right font-semibold py-2 pl-2">Lượt xem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {topStreams.map((v) => (
                    <tr key={v.id}>
                      <td className="py-2.5 pr-3">
                        <p className="font-semibold text-white line-clamp-1">{v.title}</p>
                        <p className="text-[11px] text-zinc-500">
                          {formatDate(v.startedAt)} · {v.category}
                        </p>
                      </td>
                      <td className="py-2.5 px-2 text-right text-zinc-300 tabular-nums">{formatDuration(v.durationSec)}</td>
                      <td className="py-2.5 px-2 text-right text-zinc-300 tabular-nums">{formatNumber(v.peakViewers)}</td>
                      <td className="py-2.5 pl-2 text-right font-bold text-white tabular-nums">{formatNumber(v.views)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
