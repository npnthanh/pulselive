import React, { useMemo } from 'react';
import { Radio, Eye, Clock, UserPlus, Coins, MonitorPlay, Square, Film, Users } from 'lucide-react';
import type { StudioState } from './useStudioState';
import { useNow } from './useStudioState';
import { summarizePeriod } from './analytics';
import { StatTile, SectionTitle } from './studioUi';
import { AnimatedArrow } from '../AnimatedArrow';
import { cardCls, btnGhostCls } from './styles';
import { formatClock, formatCompact, formatDate, formatDuration, formatNumber, timeAgo } from './format';
import { TOTAL_FOLLOWER_COUNT } from '../../data/studioData';
import type { StudioSection } from './StreamerStudioView';

interface StudioHomeProps {
  studio: StudioState;
  onNavigate: (section: StudioSection) => void;
  onRequestGoLive: () => void;
  onRequestEndLive: () => void;
}

export const StudioHome: React.FC<StudioHomeProps> = ({ studio, onNavigate, onRequestGoLive, onRequestEndLive }) => {
  const { settings, isLive, startedAt, stats, vods, followers } = studio;
  const now = useNow(true, isLive ? 1000 : 60_000);
  const week = useMemo(() => summarizePeriod(7), []);
  const trend = useMemo(() => summarizePeriod(14).days, []);

  const newestFollowers = useMemo(
    () => [...followers].sort((a, b) => b.followedAt.getTime() - a.followedAt.getTime()).slice(0, 5),
    [followers]
  );

  return (
    <div className="space-y-6">
      {/* Channel hero + go live */}
      <div className={`${cardCls} relative overflow-hidden`}>
        <img src={settings.banner} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#15151E] via-[#15151E]/90 to-[#15151E]/40" />
        <div className="relative p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative shrink-0">
              <img
                src={settings.avatar}
                alt={settings.displayName}
                className={`w-16 h-16 rounded-2xl object-cover ring-2 ${isLive ? 'ring-red-500' : 'ring-white/15'}`}
              />
              {isLive && (
                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-1.5 rounded bg-red-600 text-[9px] font-extrabold text-white">
                  LIVE
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-lg font-extrabold text-white truncate">{settings.displayName}</p>
              <p className="text-xs text-zinc-400">
                @{settings.handle} · {formatNumber(TOTAL_FOLLOWER_COUNT + stats.newFollowers)} người theo dõi
              </p>
              <p className="mt-1.5 text-xs">
                {isLive && startedAt !== null ? (
                  <span className="inline-flex items-center gap-1.5 font-semibold text-red-300">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    Đang phát · <span className="tabular-nums">{formatClock((now - startedAt) / 1000)}</span> ·{' '}
                    {formatNumber(stats.viewers)} người xem
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-zinc-400">
                    <span className="w-2 h-2 rounded-full bg-zinc-500" />
                    Đang offline
                    {vods[0] && <> · Lần live gần nhất {timeAgo(vods[0].startedAt, now)}</>}
                  </span>
                )}
              </p>
            </div>
          </div>

          {isLive ? (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onNavigate('live')}
                className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-(--brand) hover:bg-(--brand-hover) shadow-lg transition-colors cursor-pointer"
              >
                <MonitorPlay className="w-4 h-4" /> Phòng điều khiển <AnimatedArrow />
              </button>
              <button onClick={onRequestEndLive} className={`${btnGhostCls} py-3 hover:text-rose-300`}>
                <Square className="w-3.5 h-3.5 fill-current" /> Kết thúc
              </button>
            </div>
          ) : (
            <button
              onClick={onRequestGoLive}
              className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-extrabold text-white bg-gradient-to-r from-red-600 to-rose-500 hover:brightness-110 shadow-lg shadow-red-900/40 transition-all cursor-pointer"
            >
              <Radio className="w-4 h-4" /> Bắt đầu livestream
            </button>
          )}
        </div>
      </div>

      {/* Channel analytics summary */}
      <div className="space-y-3">
        <SectionTitle
          title="Phân tích kênh"
          description="7 ngày qua, so với 7 ngày trước đó."
          action={
            <button
              onClick={() => onNavigate('analytics')}
              className="group self-start inline-flex items-center gap-1.5 text-xs font-bold text-zinc-300 hover:text-white cursor-pointer"
            >
              Xem phân tích chi tiết <AnimatedArrow />
            </button>
          }
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatTile
            label="Lượt xem"
            icon={<Eye className="w-3.5 h-3.5" />}
            value={formatCompact(week.totals.views)}
            delta={week.deltas.views}
            deltaLabel="so với 7 ngày trước"
            trend={trend.map((d) => d.views)}
          />
          <StatTile
            label="Giờ xem"
            icon={<Clock className="w-3.5 h-3.5" />}
            value={formatCompact(week.totals.watchHours)}
            delta={week.deltas.watchHours}
            deltaLabel="so với 7 ngày trước"
            trend={trend.map((d) => d.watchHours)}
          />
          <StatTile
            label="Người theo dõi mới"
            icon={<UserPlus className="w-3.5 h-3.5" />}
            value={formatCompact(week.totals.newFollowers)}
            delta={week.deltas.newFollowers}
            deltaLabel="so với 7 ngày trước"
            trend={trend.map((d) => d.newFollowers)}
          />
          <StatTile
            label="Xu nhận được"
            icon={<Coins className="w-3.5 h-3.5" />}
            value={formatCompact(week.totals.coins)}
            delta={week.deltas.coins}
            deltaLabel="so với 7 ngày trước"
            trend={trend.map((d) => d.coins)}
          />
        </div>
      </div>

      {/* Recent streams + newest followers */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-4">
        <div className={`${cardCls} p-4 sm:p-5`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="flex items-center gap-2 text-sm font-bold text-white">
              <Film className="w-4 h-4 text-zinc-400" /> Buổi live gần đây
            </h3>
            <button
              onClick={() => onNavigate('videos')}
              className="group inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white cursor-pointer"
            >
              Tất cả <AnimatedArrow />
            </button>
          </div>
          <ul className="divide-y divide-white/6">
            {vods.slice(0, 3).map((v) => (
              <li key={v.id} className="py-3 first:pt-0 last:pb-0 flex items-center gap-3">
                <div className="relative w-28 aspect-video rounded-lg overflow-hidden shrink-0 bg-black">
                  <img src={v.thumbnail} alt="" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-1 px-1 rounded bg-black/80 text-[10px] font-semibold text-white tabular-nums">
                    {formatDuration(v.durationSec)}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white line-clamp-2">{v.title}</p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    {formatDate(v.startedAt)} · {formatCompact(v.views)} lượt xem · đỉnh {formatNumber(v.peakViewers)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className={`${cardCls} p-4 sm:p-5`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="flex items-center gap-2 text-sm font-bold text-white">
              <Users className="w-4 h-4 text-zinc-400" /> Người theo dõi mới
            </h3>
            <button
              onClick={() => onNavigate('community')}
              className="group inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white cursor-pointer"
            >
              Cộng đồng <AnimatedArrow />
            </button>
          </div>
          <ul className="space-y-2.5">
            {newestFollowers.map((f) => (
              <li key={f.id} className="flex items-center gap-3">
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${f.avatarClass}`}
                >
                  {f.name.slice(0, 2).toUpperCase()}
                </span>
                <span className="text-xs font-semibold text-white truncate flex-1">{f.name}</span>
                <span className="text-[11px] text-zinc-500 shrink-0">{timeAgo(f.followedAt, now)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
