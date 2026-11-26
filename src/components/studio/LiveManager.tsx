import React, { useEffect, useRef, useState } from 'react';
import {
  Pencil,
  Dices,
  BarChart3,
  Scissors,
  Timer,
  UserCheck,
  Video,
  Radio,
  Square,
  Copy,
  Check,
  Eye,
  EyeOff,
  Heart,
  Gift,
  Star,
  MessageSquareText,
  PackageOpen,
  Send,
  Plus,
  Trash2,
  Lock,
  Trophy,
  Wifi,
  Users,
  Coins,
  UserPlus,
  Sparkles,
  Wrench,
} from 'lucide-react';
import type { FeedKind, StudioState } from './useStudioState';
import { useNow } from './useStudioState';
import { Modal, Field } from './studioUi';
import { StreamInfoModal } from './StreamInfoModal';
import { inputCls, btnGhostCls, btnPrimaryCls, btnDangerCls } from './styles';
import { formatClock, formatCompact, formatNumber, formatTime } from './format';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { STREAM_KEY, STREAM_SERVER_URL } from '../../data/studioData';

interface LiveManagerProps {
  studio: StudioState;
  onRequestGoLive: () => void;
  onRequestEndLive: () => void;
}

/** Two outcome colors = categorical slots 1 & 2 (dark steps), validated as an adjacent pair. */
const OUTCOME_COLORS = ['#338ced', '#e76624'];

const DURATIONS = [
  { label: '1 phút', sec: 60 },
  { label: '2 phút', sec: 120 },
  { label: '5 phút', sec: 300 },
  { label: '10 phút', sec: 600 },
];

const panelHeader = 'px-4 h-11 flex items-center justify-between gap-2 border-b border-white/8 bg-[#16161F] shrink-0';
const panelTitle = 'text-[13px] font-bold text-white';

export const LiveManager: React.FC<LiveManagerProps> = ({ studio, onRequestGoLive, onRequestEndLive }) => {
  const { isLive, startedAt, stats, streamInfo, prediction, poll, slowMode, followersOnly } = studio;
  const now = useNow(isLive);
  const [modal, setModal] = useState<'info' | 'prediction' | 'poll' | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  // Phones/tablets get a single-screen console (preview on top, chat/feed/tools tabs below)
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [mobileTab, setMobileTab] = useState<'chat' | 'feed' | 'tools'>('chat');
  const [lastSeenChatId, setLastSeenChatId] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const actions: {
    id: string;
    label: string;
    icon: typeof Pencil;
    onClick: () => void;
    needsLive?: boolean;
    active?: boolean;
    disabledReason?: string;
  }[] = [
    { id: 'info', label: 'Chỉnh thông tin stream', icon: Pencil, onClick: () => setModal('info') },
    {
      id: 'prediction',
      label: 'Bắt đầu dự đoán',
      icon: Dices,
      needsLive: true,
      onClick: () => setModal('prediction'),
      disabledReason: prediction ? 'Đang có dự đoán' : undefined,
    },
    {
      id: 'poll',
      label: 'Mở bình chọn',
      icon: BarChart3,
      needsLive: true,
      onClick: () => setModal('poll'),
      disabledReason: poll ? 'Đang có bình chọn' : undefined,
    },
    {
      id: 'clip',
      label: 'Tạo clip 30 giây',
      icon: Scissors,
      needsLive: true,
      onClick: () => {
        if (studio.clipLive()) setToast('Đã tạo clip 30 giây gần nhất — xem trong Video & clip');
      },
    },
    {
      id: 'slow',
      label: 'Chế độ chậm',
      icon: Timer,
      active: slowMode,
      onClick: () => studio.setSlowMode(!slowMode),
    },
    {
      id: 'followers',
      label: 'Chỉ người theo dõi',
      icon: UserCheck,
      active: followersOnly,
      onClick: () => studio.setFollowersOnly(!followersOnly),
    },
  ];

  const elapsed = isLive && startedAt !== null ? (now - startedAt) / 1000 : 0;

  const renderActions = (gridClass: string) => (
    <div className={gridClass}>
      {actions.map((a) => {
        const blocked = (a.needsLive && !isLive) || !!a.disabledReason;
        const reason = a.disabledReason ?? (a.needsLive && !isLive ? 'Cần bắt đầu live' : undefined);
        return (
          <button
            key={a.id}
            onClick={a.onClick}
            disabled={blocked}
            aria-pressed={a.active !== undefined ? a.active : undefined}
            title={reason ?? a.label}
            className={`relative min-h-24 p-3 rounded-xl border text-left flex flex-col justify-between gap-3 transition-colors cursor-pointer disabled:cursor-not-allowed ${
              a.active
                ? 'bg-(--brand-soft) border-(--brand)/50 text-white'
                : 'bg-white/[0.04] border-white/8 text-zinc-300 hover:bg-white/8 hover:text-white disabled:opacity-40 disabled:hover:bg-white/[0.04]'
            }`}
          >
            <a.icon className={`w-5 h-5 ${a.active ? 'text-(--brand-light)' : ''}`} />
            <span className="text-[11px] font-semibold leading-snug">{a.label}</span>
            {a.active && (
              <span className="absolute top-2 right-2 text-[9px] font-extrabold uppercase text-(--brand-light)">Bật</span>
            )}
          </button>
        );
      })}
    </div>
  );

  const liveStats = [
    { label: 'Người xem hiện tại', short: 'Đang xem', value: stats.viewers, icon: Users },
    { label: 'Xu nhận được', short: 'Xu', value: stats.coins, icon: Coins },
    { label: 'Đăng ký mới', short: 'Đăng ký', value: stats.newSubs, icon: Star },
    { label: 'Người theo dõi mới', short: 'Theo dõi', value: stats.newFollowers, icon: UserPlus },
  ];

  // Unread chat badge while the streamer looks at another tab
  const lastSeenIndex = lastSeenChatId ? studio.chat.findIndex((m) => m.id === lastSeenChatId) : -1;
  const unreadChat =
    mobileTab === 'chat' || lastSeenChatId === null
      ? 0
      : lastSeenIndex === -1
      ? studio.chat.length
      : studio.chat.length - 1 - lastSeenIndex;
  const switchMobileTab = (tab: 'chat' | 'feed' | 'tools') => {
    if (mobileTab === 'chat' && tab !== 'chat') setLastSeenChatId(studio.chat.at(-1)?.id ?? '');
    setMobileTab(tab);
  };

  const mobileConsole = (
    <div className="flex-1 min-h-0 flex flex-col">
      {/* Own stream preview with live stats on top of it */}
      <div className="relative w-full aspect-video max-h-[34dvh] shrink-0 bg-[#0B0B0F] overflow-hidden">
        {isLive ? (
          <>
            <img src={studio.settings.banner} alt="Màn hình đang phát" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/40" />
            <div className="absolute bottom-2 left-2 right-2 grid grid-cols-4 gap-1.5">
              {liveStats.map((s) => (
                <div key={s.label} title={s.label} className="px-1 py-1 rounded-lg bg-black/65 backdrop-blur-sm text-center">
                  <p className="text-sm font-extrabold text-white tabular-nums leading-tight">{formatCompact(s.value)}</p>
                  <p className="text-[9px] text-zinc-300 inline-flex items-center gap-0.5 max-w-full">
                    <s.icon className="w-2.5 h-2.5 shrink-0" />
                    <span className="truncate">{s.short}</span>
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <span className="p-2.5 rounded-2xl bg-white/5 text-zinc-500">
              <Video className="w-6 h-6" />
            </span>
            <p className="mt-2 text-sm font-bold text-zinc-200">Bạn đang offline</p>
            <p className="mt-0.5 text-[11px] text-zinc-500 max-w-xs">
              Kết nối OBS bằng mã stream ở tab Công cụ, rồi bấm Bắt đầu live.
            </p>
          </div>
        )}
        <div className="absolute top-2 left-2 flex items-center gap-1.5">
          <span
            className={`px-2 py-0.5 rounded-md text-[11px] font-black ${
              isLive ? 'bg-red-600 text-white' : 'bg-black/60 text-zinc-300'
            }`}
          >
            {isLive ? 'LIVE' : 'OFFLINE'}
          </span>
          {isLive && (
            <span className="px-2 py-0.5 rounded-md bg-black/60 text-[11px] font-bold text-white tabular-nums">
              {formatClock(elapsed)}
            </span>
          )}
        </div>
        {isLive && (
          <span className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 text-[11px] font-semibold text-emerald-400">
            <Wifi className="w-3 h-3" /> 6.000 kbps
          </span>
        )}
      </div>

      {/* Stream title (tap to edit) + go live / end */}
      <div className="shrink-0 flex items-center gap-2 px-3 py-2 border-b border-white/8 bg-[#13131A]">
        <button onClick={() => setModal('info')} className="min-w-0 flex-1 text-left cursor-pointer">
          <p className="text-xs font-bold text-white truncate">{streamInfo.title}</p>
          <p className="text-[10px] text-zinc-500 flex items-center gap-1 min-w-0">
            <span className="truncate">{streamInfo.category}</span>
            <span className="shrink-0 inline-flex items-center gap-0.5 text-(--brand-light)">
              · <Pencil className="w-2.5 h-2.5" /> Sửa
            </span>
          </p>
        </button>
        {isLive ? (
          <button onClick={onRequestEndLive} className={`${btnDangerCls} shrink-0`}>
            <Square className="w-3.5 h-3.5 fill-current" /> Kết thúc
          </button>
        ) : (
          <button
            onClick={onRequestGoLive}
            className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-red-600 to-rose-500 hover:brightness-110 shadow-lg transition-all cursor-pointer"
          >
            <Radio className="w-3.5 h-3.5" /> Bắt đầu live
          </button>
        )}
      </div>

      {/* Panel tabs */}
      <div className="shrink-0 grid grid-cols-3 border-b border-white/8 bg-[#13131A]">
        {(
          [
            { id: 'chat', label: 'Chat', icon: MessageSquareText },
            { id: 'feed', label: 'Hoạt động', icon: Heart },
            { id: 'tools', label: 'Công cụ', icon: Wrench },
          ] as const
        ).map((t) => {
          const active = mobileTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => switchMobileTab(t.id)}
              aria-pressed={active}
              className={`relative py-2.5 text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer ${
                active ? 'text-white' : 'text-zinc-500'
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
              {t.id === 'chat' && unreadChat > 0 && (
                <span className="min-w-4 h-4 px-1 rounded-full bg-red-600 text-white text-[9px] font-black flex items-center justify-center tabular-nums">
                  {unreadChat > 99 ? '99+' : unreadChat}
                </span>
              )}
              {t.id === 'tools' && (prediction || poll) && (
                <span className="w-1.5 h-1.5 rounded-full bg-(--brand-light)" title="Đang có dự đoán / bình chọn" />
              )}
              {active && <span className="absolute bottom-0 inset-x-6 h-0.5 rounded-full bg-(--brand)" />}
            </button>
          );
        })}
      </div>

      <div className="flex-1 min-h-0">
        {mobileTab === 'chat' && <StreamerChat studio={studio} fill />}
        {mobileTab === 'feed' && <MiniFeed studio={studio} now={now} fill />}
        {mobileTab === 'tools' && (
          <div className="h-full overflow-y-auto p-3 space-y-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
            {prediction && <PredictionPanel studio={studio} now={now} />}
            {poll && <PollPanel studio={studio} now={now} />}
            <div>
              <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-zinc-500">Thao tác nhanh</h3>
              {renderActions('grid grid-cols-3 sm:grid-cols-6 gap-2')}
            </div>
            <StreamKeyCard />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:h-[calc(100vh-4rem)] min-h-0 max-lg:flex-1">
      {isDesktop ? (
      <>
      {/* Top live stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/8 border-b border-white/8 shrink-0">
        {liveStats.map((s) => (
          <div key={s.label} className="py-3 px-4 text-center bg-[#13131A]">
            <p className="text-2xl font-extrabold text-white">{formatNumber(s.value)}</p>
            <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-zinc-400">
              <s.icon className="w-3 h-3" /> {s.label}
            </p>
          </div>
        ))}
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[230px_minmax(0,1fr)_320px]">
        {/* LEFT: quick actions */}
        <section className="flex flex-col min-h-0 border-b lg:border-b-0 lg:border-r border-white/8">
          <div className={panelHeader}>
            <h2 className={panelTitle}>Thao tác nhanh</h2>
          </div>
          {renderActions('p-3 grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-2 gap-2 overflow-y-auto')}
        </section>

        {/* CENTER: preview + stream key + interactions */}
        <section className="flex flex-col min-h-0 xl:border-r border-white/8">
          <div className={panelHeader}>
            <h2 className={panelTitle}>Xem live stream</h2>
            {isLive && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
                <Wifi className="w-3.5 h-3.5" /> Kết nối ổn định · 6.000 kbps
              </span>
            )}
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto">
            {/* Preview */}
            <div className="relative aspect-video bg-[#0B0B0F]">
              {isLive ? (
                <>
                  <img src={studio.settings.banner} alt="Màn hình đang phát" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-red-600 text-[11px] font-black text-white">LIVE</span>
                    <span className="px-2 py-0.5 rounded-md bg-black/60 text-[11px] font-bold text-white tabular-nums">
                      {formatNumber(stats.viewers)} người xem
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-sm font-bold text-white drop-shadow line-clamp-1">{streamInfo.title}</p>
                    <p className="text-[11px] text-zinc-300">{streamInfo.category}</p>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                  <span className="p-3 rounded-2xl bg-white/5 text-zinc-500">
                    <Video className="w-7 h-7" />
                  </span>
                  <p className="mt-3 text-sm font-bold text-zinc-200">Bạn đang offline</p>
                  <p className="mt-1 text-xs text-zinc-500 max-w-sm">
                    Mở OBS, dán Server URL và mã stream bên dưới, rồi bấm Bắt đầu livestream.
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 space-y-4">
              {/* Current stream info */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                    {isLive ? 'Đang phát' : 'Buổi live tiếp theo'}
                  </p>
                  <p className="text-sm font-bold text-white mt-0.5 line-clamp-2">{streamInfo.title}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-(--brand-soft) text-[11px] font-semibold text-(--brand-light)">
                      {streamInfo.category}
                    </span>
                    {streamInfo.tags.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded-md bg-white/6 text-[11px] text-zinc-300">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
                <button onClick={() => setModal('info')} className={`${btnGhostCls} px-3 shrink-0`}>
                  <Pencil className="w-3.5 h-3.5" /> Sửa
                </button>
              </div>

              {prediction && <PredictionPanel studio={studio} now={now} />}
              {poll && <PollPanel studio={studio} now={now} />}

              <StreamKeyCard />
            </div>
          </div>

          {/* Bottom control bar */}
          <div className="shrink-0 px-4 py-3 border-t border-white/8 bg-[#13131A] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Video className="w-6 h-6 text-zinc-400 shrink-0" />
              <span className="text-sm font-semibold text-white tabular-nums">{formatClock(elapsed)}</span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                  isLive ? 'bg-red-600 text-white' : 'bg-white/8 text-zinc-400'
                }`}
              >
                {isLive ? 'LIVE' : 'OFFLINE'}
              </span>
            </div>
            {isLive ? (
              <button onClick={onRequestEndLive} className={btnDangerCls}>
                <Square className="w-3.5 h-3.5 fill-current" /> Kết thúc
              </button>
            ) : (
              <button
                onClick={onRequestGoLive}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-red-600 to-rose-500 hover:brightness-110 shadow-lg transition-all cursor-pointer"
              >
                <Radio className="w-3.5 h-3.5" /> Bắt đầu livestream
              </button>
            )}
          </div>
        </section>

        {/* RIGHT: mini feed + chat */}
        <section className="lg:col-span-2 xl:col-span-1 flex flex-col min-h-0 border-t xl:border-t-0 border-white/8">
          <MiniFeed studio={studio} now={now} />
          <StreamerChat studio={studio} />
        </section>
      </div>
      </>
      ) : (
        mobileConsole
      )}

      {toast && (
        <div className="fixed bottom-6 max-lg:bottom-auto max-lg:top-20 left-1/2 -translate-x-1/2 z-[70] px-4 py-2.5 rounded-xl bg-[#1C1C28] border border-white/15 shadow-2xl text-xs font-semibold text-white flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" /> {toast}
        </div>
      )}

      {modal === 'info' && (
        <StreamInfoModal
          mode="edit"
          initial={streamInfo}
          onClose={() => setModal(null)}
          onSubmit={(info) => {
            studio.updateStreamInfo(info);
            setModal(null);
            setToast('Đã cập nhật thông tin buổi live');
          }}
        />
      )}
      {modal === 'prediction' && (
        <PredictionModal
          onClose={() => setModal(null)}
          onSubmit={(q, outcomes, sec) => {
            studio.startPrediction(q, outcomes, sec);
            setModal(null);
          }}
        />
      )}
      {modal === 'poll' && (
        <PollModal
          onClose={() => setModal(null)}
          onSubmit={(q, options, sec) => {
            studio.startPoll(q, options, sec);
            setModal(null);
          }}
        />
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Stream key                                                          */
/* ------------------------------------------------------------------ */

const CopyButton: React.FC<{ value: string; label: string }> = ({ value, label }) => {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(t);
  }, [copied]);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
        } catch {
          /* clipboard unavailable */
        }
      }}
      className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/8 transition-colors cursor-pointer shrink-0"
      title={label}
      aria-label={label}
    >
      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
    </button>
  );
};

const StreamKeyCard: React.FC = () => {
  const [showKey, setShowKey] = useState(false);
  return (
    <div className="rounded-xl bg-[#1A1A24] border border-white/8 p-4 space-y-3">
      <div>
        <p className="text-sm font-bold text-white">Vui lòng giữ mã của bạn.</p>
        <p className="text-[11px] text-(--brand-light)">Dán vào OBS / phần mềm phát để đẩy luồng từ chỗ này.</p>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-20 shrink-0 text-[11px] font-semibold text-zinc-500">Server URL</span>
          <code className="flex-1 min-w-0 truncate px-2.5 py-1.5 rounded-lg bg-black/40 text-xs text-zinc-200">
            {STREAM_SERVER_URL}
          </code>
          <CopyButton value={STREAM_SERVER_URL} label="Sao chép Server URL" />
        </div>
        <div className="flex items-center gap-2">
          <span className="w-20 shrink-0 text-[11px] font-semibold text-zinc-500">Mã stream</span>
          <code className="flex-1 min-w-0 truncate px-2.5 py-1.5 rounded-lg bg-black/40 text-xs text-zinc-200">
            {showKey ? STREAM_KEY : '•'.repeat(24)}
          </code>
          <button
            onClick={() => setShowKey(!showKey)}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/8 transition-colors cursor-pointer shrink-0"
            title={showKey ? 'Ẩn mã' : 'Hiện mã'}
            aria-label={showKey ? 'Ẩn mã' : 'Hiện mã'}
          >
            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <CopyButton value={STREAM_KEY} label="Sao chép mã stream" />
        </div>
      </div>
      <p className="text-[11px] text-zinc-500">Không chia sẻ mã stream — ai có mã đều có thể phát lên kênh của bạn.</p>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Prediction & poll panels                                            */
/* ------------------------------------------------------------------ */

const countdown = (endsAt: number, now: number) => formatClock(Math.max(0, (endsAt - now) / 1000)).slice(3);

const PredictionPanel: React.FC<{ studio: StudioState; now: number }> = ({ studio, now }) => {
  const p = studio.prediction;
  if (!p) return null;
  const totalPoints = p.outcomes.reduce((s, o) => s + o.points, 0);

  return (
    <div className="rounded-xl bg-[#1A1A24] border border-white/8 p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white">
          <Dices className="w-4 h-4 text-zinc-400" /> Dự đoán
        </span>
        <span className="text-[11px] font-semibold text-zinc-400 tabular-nums">
          {p.status === 'open' && <>Đang mở · còn {countdown(p.endsAt, now)}</>}
          {p.status === 'locked' && (
            <span className="inline-flex items-center gap-1">
              <Lock className="w-3 h-3" /> Đã khóa — chọn kết quả
            </span>
          )}
          {p.status === 'resolved' && (
            <span className="inline-flex items-center gap-1 text-emerald-400">
              <Trophy className="w-3 h-3" /> Đã có kết quả
            </span>
          )}
        </span>
      </div>
      <p className="text-sm font-bold text-white">{p.question}</p>

      <div className="space-y-2">
        {p.outcomes.map((o, i) => {
          const share = totalPoints ? o.points / totalPoints : 0;
          const won = p.status === 'resolved' && p.winner === i;
          return (
            <div key={o.label}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="inline-flex items-center gap-1.5 font-semibold text-zinc-200">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: OUTCOME_COLORS[i] }} />
                  {o.label}
                  {won && <Trophy className="w-3.5 h-3.5 text-amber-400" />}
                </span>
                <span className="text-zinc-400 tabular-nums">
                  <strong className="text-white">{Math.round(share * 100)}%</strong> · {formatNumber(o.points)} điểm ·{' '}
                  {o.voters} người
                </span>
              </div>
              <div className="h-2 rounded-full bg-white/6 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${share * 100}%`, background: OUTCOME_COLORS[i] }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        {p.status === 'open' && (
          <button onClick={studio.lockPrediction} className={btnGhostCls}>
            <Lock className="w-3.5 h-3.5" /> Khóa dự đoán
          </button>
        )}
        {p.status === 'locked' &&
          p.outcomes.map((o, i) => (
            <button key={o.label} onClick={() => studio.resolvePrediction(i)} className={btnPrimaryCls}>
              <Trophy className="w-3.5 h-3.5" /> {o.label} thắng
            </button>
          ))}
        {p.status !== 'resolved' ? (
          <button onClick={studio.clearPrediction} className={`${btnGhostCls} hover:text-rose-300`}>
            Hủy & hoàn điểm
          </button>
        ) : (
          <button onClick={studio.clearPrediction} className={btnGhostCls}>
            Đóng
          </button>
        )}
      </div>
    </div>
  );
};

const PollPanel: React.FC<{ studio: StudioState; now: number }> = ({ studio, now }) => {
  const p = studio.poll;
  if (!p) return null;
  const total = p.options.reduce((s, o) => s + o.votes, 0);
  const leader = Math.max(...p.options.map((o) => o.votes));

  return (
    <div className="rounded-xl bg-[#1A1A24] border border-white/8 p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white">
          <BarChart3 className="w-4 h-4 text-zinc-400" /> Bình chọn
        </span>
        <span className="text-[11px] font-semibold text-zinc-400 tabular-nums">
          {p.status === 'open' ? <>Đang mở · còn {countdown(p.endsAt, now)}</> : 'Đã kết thúc'} · {formatNumber(total)} phiếu
        </span>
      </div>
      <p className="text-sm font-bold text-white">{p.question}</p>
      <div className="space-y-2">
        {p.options.map((o) => {
          const share = total ? o.votes / total : 0;
          return (
            <div key={o.label}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-zinc-200 inline-flex items-center gap-1">
                  {o.label}
                  {p.status === 'ended' && total > 0 && o.votes === leader && (
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  )}
                </span>
                <span className="text-zinc-400 tabular-nums">
                  <strong className="text-white">{Math.round(share * 100)}%</strong> · {formatNumber(o.votes)}
                </span>
              </div>
              <div className="h-2 rounded-full bg-white/6 overflow-hidden">
                <div className="h-full rounded-full bg-[#338ced] transition-all duration-500" style={{ width: `${share * 100}%` }} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-2 pt-1">
        {p.status === 'open' ? (
          <button onClick={studio.endPoll} className={btnGhostCls}>
            Kết thúc bình chọn
          </button>
        ) : (
          <button onClick={studio.clearPoll} className={btnGhostCls}>
            Đóng
          </button>
        )}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Mini feed & chat                                                    */
/* ------------------------------------------------------------------ */

const FEED_ICON: Record<FeedKind, { icon: typeof Heart; cls: string; label: string }> = {
  follow: { icon: Heart, cls: 'text-rose-400 bg-rose-500/10', label: 'Theo dõi' },
  gift: { icon: Gift, cls: 'text-amber-400 bg-amber-500/10', label: 'Quà' },
  sub: { icon: Star, cls: 'text-violet-300 bg-violet-500/10', label: 'Hội viên' },
};

const MiniFeed: React.FC<{ studio: StudioState; now: number; fill?: boolean }> = ({ studio, fill = false }) => {
  const [filter, setFilter] = useState<FeedKind | 'all'>('all');
  const items = filter === 'all' ? studio.feed : studio.feed.filter((e) => e.kind === filter);

  return (
    <div className={`flex flex-col min-h-0 ${fill ? 'h-full' : 'h-72 xl:h-auto xl:flex-[0_0_42%]'}`}>
      <div className={`${panelHeader} ${fill ? 'h-10' : ''}`}>
        {/* Phone console: the tab already names this panel — the filters get the whole row */}
        {!fill && <h2 className={panelTitle}>Mini-Feed</h2>}
        <div className={`flex items-center gap-0.5 ${fill ? 'w-full justify-between' : ''}`}>
          {(['all', 'follow', 'gift', 'sub'] as const).map((k) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              aria-pressed={filter === k}
              className={`px-2 py-1 rounded-md font-bold whitespace-nowrap transition-colors cursor-pointer ${
                fill ? 'flex-1 text-xs py-1.5' : 'text-[10px]'
              } ${filter === k ? 'bg-white/12 text-white' : 'text-zinc-500 hover:text-white'}`}
            >
              {k === 'all' ? 'Tất cả' : FEED_ICON[k].label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <MessageSquareText className="w-10 h-10 text-zinc-600" />
            <p className="mt-2 text-xs text-zinc-500">Hiện tại chưa có thông tin</p>
          </div>
        ) : (
          <ul className="p-2 space-y-1">
            {items.map((e) => {
              const meta = FEED_ICON[e.kind];
              return (
                <li key={e.id} className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-white/4">
                  <span className={`p-1.5 rounded-lg shrink-0 ${meta.cls}`}>
                    <meta.icon className="w-3.5 h-3.5" />
                  </span>
                  <p className="flex-1 min-w-0 text-xs text-zinc-300 truncate">
                    <strong className="text-white">{e.user}</strong> {e.text}
                  </p>
                  <span className="text-[10px] text-zinc-500 tabular-nums shrink-0">{formatTime(e.at)}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

const StreamerChat: React.FC<{ studio: StudioState; fill?: boolean }> = ({ studio, fill = false }) => {
  const { chat, isLive, slowMode, followersOnly } = studio;
  const [text, setText] = useState('');
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [chat]);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const t = text.trim();
    if (!t || !isLive) return;
    studio.sendChat(t);
    setText('');
  };

  return (
    <div className={`flex flex-col min-h-0 ${fill ? 'h-full' : 'h-96 xl:h-auto xl:flex-1 border-t border-white/8'}`}>
      {/* Phone console: the tab already says "Chat" — only show the header when a chat mode is on */}
      {(!fill || slowMode || followersOnly) && (
      <div className={`${panelHeader} ${fill ? 'h-8' : ''}`}>
        <h2 className={panelTitle}>{fill ? 'Chế độ chat' : 'Chat của tôi'}</h2>
        <div className="flex items-center gap-1">
          {slowMode && <span className="px-1.5 py-0.5 rounded bg-white/8 text-[10px] font-bold text-zinc-300">Chậm</span>}
          {followersOnly && (
            <span className="px-1.5 py-0.5 rounded bg-white/8 text-[10px] font-bold text-zinc-300">Người theo dõi</span>
          )}
        </div>
      </div>
      )}
      <div ref={listRef} className="flex-1 min-h-0 overflow-y-auto">
        {chat.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <PackageOpen className="w-12 h-12 text-zinc-600" />
            <p className="mt-2 text-xs text-zinc-500">
              {isLive ? 'Chưa có tin nhắn nào — chào khán giả một câu nhé!' : 'Không có số liệu, xin mở live'}
            </p>
          </div>
        ) : (
          <ul className="p-3 space-y-1.5">
            {chat.map((m) => (
              <li key={m.id} className={`${fill ? 'text-[13px]' : 'text-xs'} leading-relaxed`}>
                <span className="text-[10px] text-zinc-600 tabular-nums mr-1.5">{formatTime(m.at)}</span>
                {m.isStreamer && (
                  <span className="inline-flex items-center gap-0.5 mr-1 px-1 rounded bg-(--brand) text-[9px] font-extrabold text-white align-middle">
                    <Sparkles className="w-2.5 h-2.5" /> STREAMER
                  </span>
                )}
                <strong style={{ color: m.color }}>{m.user}</strong>
                <span className="text-zinc-300">: {m.text}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <form
        onSubmit={send}
        className={`p-3 flex gap-2 shrink-0 ${
          fill ? 'p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] border-t border-white/8 bg-[#161620]' : ''
        }`}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={!isLive}
          maxLength={200}
          placeholder={isLive ? 'Nói chuyện chút nào!' : 'Bắt đầu live để chat với khán giả'}
          className={`${inputCls} disabled:opacity-50 ${fill ? 'text-base' : ''}`}
        />
        <button type="submit" disabled={!isLive || !text.trim()} className={`${btnPrimaryCls} px-3`} aria-label="Gửi">
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Create prediction / poll                                            */
/* ------------------------------------------------------------------ */

const DurationPicker: React.FC<{ value: number; onChange: (sec: number) => void }> = ({ value, onChange }) => (
  <div className="flex flex-wrap gap-1.5">
    {DURATIONS.map((d) => (
      <button
        key={d.sec}
        type="button"
        onClick={() => onChange(d.sec)}
        aria-pressed={value === d.sec}
        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
          value === d.sec ? 'bg-white text-slate-950 border-white' : 'border-white/10 text-zinc-300 hover:bg-white/8'
        }`}
      >
        {d.label}
      </button>
    ))}
  </div>
);

const PredictionModal: React.FC<{
  onClose: () => void;
  onSubmit: (question: string, outcomes: string[], durationSec: number) => void;
}> = ({ onClose, onSubmit }) => {
  const [question, setQuestion] = useState('');
  const [a, setA] = useState('Thắng');
  const [b, setB] = useState('Thua');
  const [duration, setDuration] = useState(120);
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    if (question.trim().length < 5) return setError('Câu hỏi cần ít nhất 5 ký tự.');
    if (!a.trim() || !b.trim()) return setError('Nhập đủ 2 kết quả.');
    if (a.trim().toLowerCase() === b.trim().toLowerCase()) return setError('Hai kết quả phải khác nhau.');
    onSubmit(question.trim(), [a.trim(), b.trim()], duration);
  };

  return (
    <Modal
      open
      title="Bắt đầu dự đoán"
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className={btnGhostCls}>
            Hủy
          </button>
          <button onClick={submit} className={btnPrimaryCls}>
            <Dices className="w-3.5 h-3.5" /> Bắt đầu
          </button>
        </>
      }
    >
      <Field label="Câu hỏi" error={error ?? undefined} hint={`${question.length}/60`}>
        <input
          autoFocus
          value={question}
          maxLength={60}
          onChange={(e) => {
            setQuestion(e.target.value);
            setError(null);
          }}
          className={inputCls}
          placeholder="VD: Hiệp này mình có thắng không?"
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Kết quả 1">
          <input value={a} maxLength={25} onChange={(e) => setA(e.target.value)} className={inputCls} />
        </Field>
        <Field label="Kết quả 2">
          <input value={b} maxLength={25} onChange={(e) => setB(e.target.value)} className={inputCls} />
        </Field>
      </div>
      <Field label="Thời gian nhận dự đoán">
        <DurationPicker value={duration} onChange={setDuration} />
      </Field>
    </Modal>
  );
};

const PollModal: React.FC<{
  onClose: () => void;
  onSubmit: (question: string, options: string[], durationSec: number) => void;
}> = ({ onClose, onSubmit }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [duration, setDuration] = useState(120);
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    const cleaned = options.map((o) => o.trim()).filter(Boolean);
    if (question.trim().length < 5) return setError('Câu hỏi cần ít nhất 5 ký tự.');
    if (cleaned.length < 2) return setError('Cần ít nhất 2 lựa chọn.');
    if (new Set(cleaned.map((o) => o.toLowerCase())).size !== cleaned.length)
      return setError('Các lựa chọn không được trùng nhau.');
    onSubmit(question.trim(), cleaned, duration);
  };

  return (
    <Modal
      open
      title="Mở bình chọn"
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className={btnGhostCls}>
            Hủy
          </button>
          <button onClick={submit} className={btnPrimaryCls}>
            <BarChart3 className="w-3.5 h-3.5" /> Mở bình chọn
          </button>
        </>
      }
    >
      <Field label="Câu hỏi" error={error ?? undefined} hint={`${question.length}/60`}>
        <input
          autoFocus
          value={question}
          maxLength={60}
          onChange={(e) => {
            setQuestion(e.target.value);
            setError(null);
          }}
          className={inputCls}
          placeholder="VD: Tối nay chơi game gì tiếp?"
        />
      </Field>
      <div className="space-y-2">
        <span className="block text-xs font-semibold text-zinc-300">Lựa chọn (2–4)</span>
        {options.map((o, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={o}
              maxLength={25}
              onChange={(e) => setOptions(options.map((x, j) => (j === i ? e.target.value : x)))}
              className={inputCls}
              placeholder={`Lựa chọn ${i + 1}`}
            />
            {options.length > 2 && (
              <button
                type="button"
                onClick={() => setOptions(options.filter((_, j) => j !== i))}
                className="p-2 rounded-lg text-zinc-500 hover:text-rose-300 hover:bg-white/8 cursor-pointer"
                aria-label={`Xóa lựa chọn ${i + 1}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        {options.length < 4 && (
          <button
            type="button"
            onClick={() => setOptions([...options, ''])}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Thêm lựa chọn
          </button>
        )}
      </div>
      <Field label="Thời gian bình chọn">
        <DurationPicker value={duration} onChange={setDuration} />
      </Field>
    </Modal>
  );
};
