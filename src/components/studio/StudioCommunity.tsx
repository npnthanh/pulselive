import React, { useEffect, useMemo, useState } from 'react';
import { Search, Users, UserPlus, Shield, ShieldOff, Ban, Undo2, Star, ChevronDown } from 'lucide-react';
import type { StudioState } from './useStudioState';
import { useNow } from './useStudioState';
import { StatTile, SectionTitle, EmptyState } from './studioUi';
import { cardCls, inputCls } from './styles';
import { formatCompact, formatDate, formatNumber, timeAgo } from './format';
import { summarizePeriod } from './analytics';
import { TOTAL_FOLLOWER_COUNT, type Follower } from '../../data/studioData';

type Filter = 'all' | 'sub' | 'mod';
type Sort = 'newest' | 'oldest' | 'coins' | 'hours';

const SORTS: { id: Sort; label: string }[] = [
  { id: 'newest', label: 'Theo dõi mới nhất' },
  { id: 'oldest', label: 'Theo dõi lâu nhất' },
  { id: 'coins', label: 'Tặng nhiều Xu nhất' },
  { id: 'hours', label: 'Xem nhiều giờ nhất' },
];

const PAGE = 15;

export const StudioCommunity: React.FC<{ studio: StudioState }> = ({ studio }) => {
  const { followers } = studio;
  const now = useNow(true, 60_000);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<Sort>('newest');
  const [visible, setVisible] = useState(PAGE);
  const [blocked, setBlocked] = useState<Follower | null>(null);
  const newThisWeek = useMemo(() => summarizePeriod(7).totals.newFollowers, []);

  useEffect(() => {
    if (!blocked) return;
    const t = setTimeout(() => setBlocked(null), 5000);
    return () => clearTimeout(t);
  }, [blocked]);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = followers.filter(
      (f) =>
        (!q || f.name.toLowerCase().includes(q)) &&
        (filter === 'all' || (filter === 'sub' ? f.isSub : f.isMod))
    );
    const sorters: Record<Sort, (a: Follower, b: Follower) => number> = {
      newest: (a, b) => b.followedAt.getTime() - a.followedAt.getTime(),
      oldest: (a, b) => a.followedAt.getTime() - b.followedAt.getTime(),
      coins: (a, b) => b.giftedCoins - a.giftedCoins,
      hours: (a, b) => b.watchHours - a.watchHours,
    };
    return [...filtered].sort(sorters[sort]);
  }, [followers, query, filter, sort]);

  const counts = {
    all: followers.length,
    sub: followers.filter((f) => f.isSub).length,
    mod: followers.filter((f) => f.isMod).length,
  };

  return (
    <div className="space-y-6">
      <SectionTitle title="Cộng đồng" description="Những người đang theo dõi kênh của bạn." />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatTile
          label="Tổng người theo dõi"
          icon={<Users className="w-3.5 h-3.5" />}
          value={formatNumber(TOTAL_FOLLOWER_COUNT + studio.stats.newFollowers)}
        />
        <StatTile label="Mới trong 7 ngày" icon={<UserPlus className="w-3.5 h-3.5" />} value={formatCompact(newThisWeek)} />
        <StatTile label="Moderator" icon={<Shield className="w-3.5 h-3.5" />} value={String(counts.mod)} />
      </div>

      <div className={`${cardCls} overflow-hidden`}>
        {/* Toolbar */}
        <div className="p-4 flex flex-col lg:flex-row lg:items-center gap-3 border-b border-white/8">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisible(PAGE);
              }}
              placeholder="Tìm theo tên người theo dõi…"
              className={`${inputCls} pl-9`}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex p-1 rounded-xl bg-white/5 border border-white/8">
              {(
                [
                  ['all', 'Tất cả'],
                  ['sub', 'Hội viên'],
                  ['mod', 'Moderator'],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => {
                    setFilter(id);
                    setVisible(PAGE);
                  }}
                  aria-pressed={filter === id}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    filter === id ? 'bg-white text-slate-950' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {label} <span className="opacity-60 tabular-nums">{counts[id]}</span>
                </button>
              ))}
            </div>
            <label className="relative">
              <span className="sr-only">Sắp xếp</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="appearance-none bg-[#1C1C28] border border-white/10 hover:border-white/20 rounded-xl pl-3 pr-8 py-2 text-xs font-semibold text-white cursor-pointer focus:outline-none [color-scheme:dark]"
              >
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
            </label>
          </div>
        </div>

        {blocked && (
          <div className="mx-4 mt-4 flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-300">
            <span>
              Đã chặn <strong className="text-white">{blocked.name}</strong> khỏi kênh.
            </span>
            <button
              onClick={() => {
                studio.restoreFollower(blocked);
                setBlocked(null);
              }}
              className="inline-flex items-center gap-1.5 font-bold text-(--brand-light) hover:text-white cursor-pointer"
            >
              <Undo2 className="w-3.5 h-3.5" /> Hoàn tác
            </button>
          </div>
        )}

        {list.length === 0 ? (
          <EmptyState icon={<Users className="w-6 h-6" />} title="Không tìm thấy người theo dõi" text="Thử từ khóa hoặc bộ lọc khác." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[640px]">
              <thead className="text-zinc-500">
                <tr className="border-b border-white/8">
                  <th className="text-left font-semibold px-4 py-2.5">Người theo dõi</th>
                  <th className="text-left font-semibold px-3 py-2.5">Theo dõi từ</th>
                  <th className="text-right font-semibold px-3 py-2.5">Giờ xem</th>
                  <th className="text-right font-semibold px-3 py-2.5">Xu đã tặng</th>
                  <th className="text-right font-semibold px-4 py-2.5">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {list.slice(0, visible).map((f) => (
                  <tr key={f.id} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${f.avatarClass}`}
                        >
                          {f.name.slice(0, 2).toUpperCase()}
                        </span>
                        <span className="font-semibold text-white">{f.name}</span>
                        {f.isMod && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-500/15 text-[10px] font-bold text-emerald-300">
                            <Shield className="w-2.5 h-2.5" /> MOD
                          </span>
                        )}
                        {f.isSub && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-violet-500/15 text-[10px] font-bold text-violet-300">
                            <Star className="w-2.5 h-2.5" /> SUB
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-zinc-400" title={formatDate(f.followedAt)}>
                      {timeAgo(f.followedAt, now)}
                    </td>
                    <td className="px-3 py-2.5 text-right text-zinc-300 tabular-nums">{formatNumber(f.watchHours)}</td>
                    <td className="px-3 py-2.5 text-right font-semibold text-white tabular-nums">{formatNumber(f.giftedCoins)}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => studio.toggleMod(f.id)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold text-zinc-400 hover:text-white hover:bg-white/8 cursor-pointer"
                          title={f.isMod ? 'Gỡ quyền Moderator' : 'Đặt làm Moderator'}
                        >
                          {f.isMod ? <ShieldOff className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                          {f.isMod ? 'Gỡ Mod' : 'Đặt Mod'}
                        </button>
                        <button
                          onClick={() => {
                            studio.removeFollower(f.id);
                            setBlocked(f);
                          }}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold text-zinc-400 hover:text-rose-300 hover:bg-rose-500/10 cursor-pointer"
                          title="Chặn người này khỏi kênh"
                        >
                          <Ban className="w-3.5 h-3.5" /> Chặn
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {list.length > visible && (
          <div className="p-3 border-t border-white/8 text-center">
            <button
              onClick={() => setVisible((v) => v + PAGE)}
              className="px-4 py-1.5 rounded-lg text-xs font-bold text-zinc-300 hover:text-white hover:bg-white/8 cursor-pointer"
            >
              Xem thêm ({list.length - visible})
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
