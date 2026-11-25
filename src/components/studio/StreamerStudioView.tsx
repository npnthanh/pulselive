import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  MonitorPlay,
  BarChart3,
  Users,
  Clapperboard,
  SlidersHorizontal,
  ArrowLeft,
  Square,
  Check,
} from 'lucide-react';
import type { ActiveTab } from '../Navbar';
import type { StudioState } from './useStudioState';
import { useNow } from './useStudioState';
import { StudioHome } from './StudioHome';
import { LiveManager } from './LiveManager';
import { StudioAnalytics } from './StudioAnalytics';
import { StudioCommunity } from './StudioCommunity';
import { StudioVideos } from './StudioVideos';
import { StudioCustomize } from './StudioCustomize';
import { StreamInfoModal } from './StreamInfoModal';
import { Modal } from './studioUi';
import { btnDangerCls, btnGhostCls } from './styles';
import { formatClock, formatNumber } from './format';

export type StudioSection = 'home' | 'live' | 'analytics' | 'community' | 'videos' | 'customize';

const NAV: { id: StudioSection; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'home', label: 'Trang chủ', icon: LayoutDashboard },
  { id: 'live', label: 'Quản lý livestream', icon: MonitorPlay },
  { id: 'analytics', label: 'Phân tích dữ liệu', icon: BarChart3 },
  { id: 'community', label: 'Cộng đồng', icon: Users },
  { id: 'videos', label: 'Video & clip', icon: Clapperboard },
  { id: 'customize', label: 'Tùy chỉnh', icon: SlidersHorizontal },
];

export const StreamerStudioView: React.FC<{ studio: StudioState; setActiveTab: (tab: ActiveTab) => void }> = ({
  studio,
  setActiveTab,
}) => {
  const [section, setSection] = useState<StudioSection>('home');
  const [goLiveOpen, setGoLiveOpen] = useState(false);
  const [endLiveOpen, setEndLiveOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const { settings, isLive, startedAt, stats } = studio;
  const now = useNow(isLive);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const elapsed = isLive && startedAt !== null ? (now - startedAt) / 1000 : 0;
  const openGoLive = () => setGoLiveOpen(true);
  const openEndLive = () => setEndLiveOpen(true);

  return (
    <div className="flex-1 flex flex-col lg:flex-row min-w-0 bg-[#0E0E12]">
      {/* LEFT: studio sidebar */}
      <aside className="w-full lg:w-60 shrink-0 bg-[#13131A] border-b lg:border-b-0 lg:border-r border-white/8 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] flex flex-col">
        <div className="p-4 border-b border-white/6">
          <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-3">Khu vực Streamer</p>
          <div className="flex items-center gap-3">
            <img
              src={settings.avatar}
              alt={settings.displayName}
              className={`w-10 h-10 rounded-xl object-cover ring-2 shrink-0 ${isLive ? 'ring-red-500' : 'ring-white/15'}`}
            />
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">{settings.displayName}</p>
              {isLive ? (
                <p className="text-[11px] font-semibold text-red-300 tabular-nums flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  LIVE · {formatClock(elapsed)}
                </p>
              ) : (
                <p className="text-[11px] text-zinc-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" /> Offline
                </p>
              )}
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <div className="flex lg:flex-col gap-1 overflow-x-auto no-scrollbar">
            {NAV.map((item) => {
              const active = section === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSection(item.id)}
                  aria-current={active ? 'page' : undefined}
                  className={`relative shrink-0 lg:w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    active ? 'bg-white/8 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {active && <span className="hidden lg:block absolute left-0 top-2 bottom-2 w-1 rounded-full bg-(--brand)" />}
                  <item.icon className={`w-4 h-4 shrink-0 ${active ? 'text-(--brand-light)' : ''}`} />
                  <span className="whitespace-nowrap">{item.label}</span>
                  {item.id === 'live' && isLive && (
                    <span className="ml-auto pl-2 text-[9px] font-black text-white">
                      <span className="px-1.5 py-0.5 rounded bg-red-600">LIVE</span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="hidden lg:block p-3 border-t border-white/6 space-y-1">
          {isLive && (
            <div className="px-3 py-2 mb-1 rounded-xl bg-red-500/10 border border-red-500/20 text-[11px] text-red-200">
              <span className="font-bold tabular-nums">{formatNumber(stats.viewers)}</span> người đang xem
            </div>
          )}
          <button
            onClick={() => setActiveTab('home')}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Về trang xem live
          </button>
        </div>
      </aside>

      {/* RIGHT: section content */}
      <main className="flex-1 min-w-0">
        {section === 'live' ? (
          <LiveManager studio={studio} onRequestGoLive={openGoLive} onRequestEndLive={openEndLive} />
        ) : (
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl">
            {section === 'home' && (
              <StudioHome studio={studio} onNavigate={setSection} onRequestGoLive={openGoLive} onRequestEndLive={openEndLive} />
            )}
            {section === 'analytics' && <StudioAnalytics studio={studio} />}
            {section === 'community' && <StudioCommunity studio={studio} />}
            {section === 'videos' && <StudioVideos studio={studio} />}
            {section === 'customize' && <StudioCustomize studio={studio} />}
          </div>
        )}
      </main>

      {goLiveOpen && (
        <StreamInfoModal
          mode="golive"
          initial={{ ...studio.streamInfo, category: settings.defaultCategory }}
          notifyDefault={settings.notifyOnLive}
          onClose={() => setGoLiveOpen(false)}
          onSubmit={(info) => {
            studio.goLive(info);
            setGoLiveOpen(false);
            setSection('live');
          }}
        />
      )}

      <Modal
        open={endLiveOpen}
        title="Kết thúc buổi live?"
        onClose={() => setEndLiveOpen(false)}
        footer={
          <>
            <button onClick={() => setEndLiveOpen(false)} className={btnGhostCls}>
              Tiếp tục phát
            </button>
            <button
              onClick={() => {
                const vod = studio.endLive();
                setEndLiveOpen(false);
                if (vod) setToast('Đã kết thúc live và lưu bản ghi vào Video & clip');
              }}
              className={btnDangerCls}
            >
              <Square className="w-3.5 h-3.5 fill-current" /> Kết thúc
            </button>
          </>
        }
      >
        <p className="text-sm text-zinc-300">Khán giả sẽ thấy kênh offline. Buổi live được tự động lưu thành bản ghi.</p>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            ['Thời lượng', formatClock(elapsed)],
            ['Người xem cao nhất', formatNumber(stats.peakViewers)],
            ['Xu nhận được', formatNumber(stats.coins)],
          ].map(([label, value]) => (
            <div key={label} className="p-3 rounded-xl bg-white/5">
              <p className="text-base font-extrabold text-white tabular-nums">{value}</p>
              <p className="text-[11px] text-zinc-500">{label}</p>
            </div>
          ))}
        </div>
      </Modal>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] px-4 py-2.5 rounded-xl bg-[#1C1C28] border border-white/15 shadow-2xl text-xs font-semibold text-white flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" /> {toast}
        </div>
      )}
    </div>
  );
};
