import React, { useEffect, useMemo, useState } from 'react';
import {
  User,
  Heart,
  Coins,
  Video,
  IdCard,
  Copy,
  Check,
  Pencil,
  X,
  Gift,
  ArrowDownLeft,
  Hourglass,
  CalendarDays,
  Phone,
  CheckCircle2,
  Play,
  UserMinus,
  Compass,
  ChevronDown,
  Cake,
  Undo2,
} from 'lucide-react';
import { STREAM_CHANNELS, type StreamChannel } from '../data/mockData';
import {
  GENDER_LABELS,
  getCoinTransactions,
  getRecentMonths,
  type CoinTxnType,
  type Gender,
  type MonthOption,
  type UserProfile,
} from '../data/accountData';
import type { ActiveTab } from './Navbar';
import { AnimatedArrow } from './AnimatedArrow';

type AccountSection = 'info' | 'following' | 'coins';

interface AccountViewProps {
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  coins: number;
  followedIds: string[];
  toggleFollow: (id: string) => void;
  onSelectChannel: (channel: StreamChannel) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const toLocalISODate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const formatBirthday = (iso: string) => {
  const [y, m, d] = iso.split('-');
  return y && m && d ? `${d}/${m}/${y}` : '—';
};

const formatPhone = (phone: string) =>
  /^\d{10}$/.test(phone) ? `${phone.slice(0, 4)} ${phone.slice(4, 7)} ${phone.slice(7)}` : phone;

const formatTxnTime = (d: Date) =>
  `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')} · ${String(
    d.getHours()
  ).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

const cardClass = 'rounded-2xl bg-[#15151E] border border-white/8';
const inputClass =
  'w-full max-w-sm bg-[#1C1C28] border rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/10 transition-colors';

const SectionHeader: React.FC<{ title: string; description: string; action?: React.ReactNode }> = ({
  title,
  description,
  action,
}) => (
  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
    <div>
      <h1 className="text-xl font-extrabold text-white">{title}</h1>
      <p className="text-xs text-zinc-400 mt-1">{description}</p>
    </div>
    {action}
  </div>
);

/* ------------------------------------------------------------------ */
/* Main view                                                           */
/* ------------------------------------------------------------------ */

export const AccountView: React.FC<AccountViewProps> = ({
  profile,
  onSaveProfile,
  coins,
  followedIds,
  toggleFollow,
  onSelectChannel,
  setActiveTab,
}) => {
  const [section, setSection] = useState<AccountSection>('info');

  const navItems: { id: AccountSection; label: string; icon: typeof User; badge?: string }[] = [
    { id: 'info', label: 'Thông tin của tôi', icon: User },
    { id: 'following', label: 'Theo dõi của tôi', icon: Heart, badge: String(followedIds.length) },
    { id: 'coins', label: 'Xu của tôi', icon: Coins, badge: coins.toLocaleString('vi-VN') },
  ];

  return (
    <div className="flex-1 flex flex-col lg:flex-row min-w-0 bg-[#0E0E12]">
      {/* LEFT: Account sidebar */}
      <aside className="w-full lg:w-64 shrink-0 bg-[#13131A] border-b lg:border-b-0 lg:border-r border-white/8 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] flex flex-col">
        <div className="p-4 flex items-center gap-3 border-b border-white/6">
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-11 h-11 rounded-xl object-cover ring-2 ring-white/15 shrink-0"
          />
          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate">{profile.name}</p>
            <p className="text-[11px] text-zinc-500 tabular-nums">ID: {profile.id}</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-5">
          <div>
            <p className="px-2 mb-2 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              Trung tâm cá nhân
            </p>
            <div className="flex lg:flex-col gap-1 overflow-x-auto no-scrollbar">
              {navItems.map((item) => {
                const active = section === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSection(item.id)}
                    aria-current={active ? 'page' : undefined}
                    className={`relative shrink-0 lg:w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      active ? 'bg-white/8 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {active && (
                      <span className="hidden lg:block absolute left-0 top-2 bottom-2 w-1 rounded-full bg-(--brand)" />
                    )}
                    <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-(--brand-light)' : ''}`} />
                    <span className="whitespace-nowrap">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`ml-auto pl-2 text-[10px] font-bold tabular-nums ${
                          item.id === 'coins' ? 'text-amber-400' : 'text-zinc-500'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="px-2 mb-2 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              Khu vực Streamer
            </p>
            <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-600/20 via-fuchsia-600/10 to-transparent border border-white/10">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Video className="w-4 h-4 text-violet-300" />
                Creator Studio
              </div>
              <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                Thiết lập buổi phát và quản lý kênh của bạn.
              </p>
              <button
                onClick={() => setActiveTab('studio')}
                className="group mt-2.5 w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
              >
                Vào khu vực
                <AnimatedArrow />
              </button>
            </div>
          </div>
        </nav>
      </aside>

      {/* RIGHT: Section content */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl space-y-6">
          {section === 'info' && <ProfileSection profile={profile} onSave={onSaveProfile} />}
          {section === 'following' && (
            <FollowingSection
              followedIds={followedIds}
              toggleFollow={toggleFollow}
              onSelectChannel={onSelectChannel}
              setActiveTab={setActiveTab}
            />
          )}
          {section === 'coins' && <CoinsSection coins={coins} setActiveTab={setActiveTab} />}
        </div>
      </main>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Thông tin của tôi                                                   */
/* ------------------------------------------------------------------ */

type ProfileErrors = Partial<Record<'name' | 'birthday' | 'phone', string>>;

const validateProfile = (p: UserProfile, today: string): ProfileErrors => {
  const errors: ProfileErrors = {};
  if (p.name.trim().length < 2) errors.name = 'Tên cần ít nhất 2 ký tự.';
  if (!p.birthday) errors.birthday = 'Vui lòng chọn ngày sinh.';
  else if (p.birthday > today) errors.birthday = 'Ngày sinh không được ở tương lai.';
  if (!/^0\d{9}$/.test(p.phone)) errors.phone = 'Số điện thoại gồm 10 chữ số, bắt đầu bằng 0.';
  return errors;
};

const ProfileSection: React.FC<{ profile: UserProfile; onSave: (p: UserProfile) => void }> = ({
  profile,
  onSave,
}) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<UserProfile>(profile);
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [copied, setCopied] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [today] = useState(() => toLocalISODate(new Date()));

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  useEffect(() => {
    if (!justSaved) return;
    const t = setTimeout(() => setJustSaved(false), 2200);
    return () => clearTimeout(t);
  }, [justSaved]);

  const startEdit = () => {
    setDraft(profile);
    setErrors({});
    setEditing(true);
  };

  const handleSave = () => {
    const cleaned = { ...draft, name: draft.name.trim().replace(/\s+/g, ' '), phone: draft.phone.replace(/\s/g, '') };
    const found = validateProfile(cleaned, today);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    onSave(cleaned);
    setEditing(false);
    setJustSaved(true);
  };

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(profile.id);
      setCopied(true);
    } catch {
      /* Clipboard unavailable (e.g. insecure context) — ignore */
    }
  };

  const errorText = (key: keyof ProfileErrors) =>
    errors[key] ? <p className="text-[11px] text-rose-400 mt-1.5">{errors[key]}</p> : null;
  const borderFor = (key: keyof ProfileErrors) =>
    errors[key] ? 'border-rose-500/60' : 'border-white/10 focus:border-white/30';

  const rows: { label: string; icon: typeof User; view: React.ReactNode; edit: React.ReactNode }[] = [
    {
      label: 'ID',
      icon: IdCard,
      view: (
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white tabular-nums">{profile.id}</span>
          <button
            onClick={copyId}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/8 transition-colors cursor-pointer"
            title="Sao chép ID"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          {copied && <span className="text-[11px] text-emerald-400 font-semibold">Đã sao chép</span>}
        </div>
      ),
      edit: (
        <div>
          <span className="text-sm font-semibold text-zinc-400 tabular-nums">{profile.id}</span>
          <p className="text-[11px] text-zinc-500 mt-0.5">ID tài khoản không thể thay đổi.</p>
        </div>
      ),
    },
    {
      label: 'Tên',
      icon: User,
      view: <span className="text-sm font-semibold text-white">{profile.name}</span>,
      edit: (
        <div>
          <input
            type="text"
            value={draft.name}
            maxLength={40}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            className={`${inputClass} ${borderFor('name')}`}
            placeholder="Nhập tên hiển thị"
          />
          {errorText('name')}
        </div>
      ),
    },
    {
      label: 'Giới tính',
      icon: User,
      view: <span className="text-sm font-semibold text-white">{GENDER_LABELS[profile.gender]}</span>,
      edit: (
        <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#1C1C28] border border-white/10">
          {(Object.keys(GENDER_LABELS) as Gender[]).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setDraft({ ...draft, gender: g })}
              aria-pressed={draft.gender === g}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                draft.gender === g ? 'bg-white text-slate-950' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {GENDER_LABELS[g]}
            </button>
          ))}
        </div>
      ),
    },
    {
      label: 'Ngày sinh',
      icon: Cake,
      view: <span className="text-sm font-semibold text-white tabular-nums">{formatBirthday(profile.birthday)}</span>,
      edit: (
        <div>
          <input
            type="date"
            value={draft.birthday}
            max={today}
            onChange={(e) => setDraft({ ...draft, birthday: e.target.value })}
            className={`${inputClass} ${borderFor('birthday')} [color-scheme:dark]`}
          />
          {errorText('birthday')}
        </div>
      ),
    },
    {
      label: 'Số điện thoại',
      icon: Phone,
      view: <span className="text-sm font-semibold text-white tabular-nums">{formatPhone(profile.phone)}</span>,
      edit: (
        <div>
          <input
            type="tel"
            inputMode="numeric"
            value={draft.phone}
            maxLength={13}
            onChange={(e) => setDraft({ ...draft, phone: e.target.value.replace(/[^\d\s]/g, '') })}
            className={`${inputClass} ${borderFor('phone')} tabular-nums`}
            placeholder="0912 345 678"
          />
          {errorText('phone')}
        </div>
      ),
    },
  ];

  return (
    <>
      <SectionHeader
        title="Thông tin của tôi"
        description="Thông tin cơ bản của tài khoản PulseLive."
        action={
          editing ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" /> Hủy
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-(--brand) hover:bg-(--brand-hover) shadow-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" /> Lưu thay đổi
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {justSaved && (
                <span className="text-xs font-semibold text-emerald-400 inline-flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Đã lưu thay đổi
                </span>
              )}
              <button
                onClick={startEdit}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-white/8 hover:bg-white/12 border border-white/10 transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <Pencil className="w-3.5 h-3.5" /> Chỉnh sửa
              </button>
            </div>
          )
        }
      />

      <div className={`${cardClass} divide-y divide-white/6`}>
        {rows.map((row) => {
          const Icon = row.icon;
          return (
            <div
              key={row.label}
              className="px-5 py-4 grid grid-cols-1 sm:grid-cols-[180px_1fr] sm:items-center gap-2"
            >
              <span className="flex items-center gap-2.5 text-xs font-semibold text-zinc-400">
                <span className="p-1.5 rounded-lg bg-white/5 text-zinc-400">
                  <Icon className="w-3.5 h-3.5" />
                </span>
                {row.label}
              </span>
              {editing ? row.edit : row.view}
            </div>
          );
        })}
      </div>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* Theo dõi của tôi                                                    */
/* ------------------------------------------------------------------ */

const FollowingSection: React.FC<{
  followedIds: string[];
  toggleFollow: (id: string) => void;
  onSelectChannel: (channel: StreamChannel) => void;
  setActiveTab: (tab: ActiveTab) => void;
}> = ({ followedIds, toggleFollow, onSelectChannel, setActiveTab }) => {
  const [lastUnfollowed, setLastUnfollowed] = useState<StreamChannel | null>(null);
  const channels = STREAM_CHANNELS.filter((c) => followedIds.includes(c.id));

  useEffect(() => {
    if (!lastUnfollowed) return;
    const t = setTimeout(() => setLastUnfollowed(null), 5000);
    return () => clearTimeout(t);
  }, [lastUnfollowed]);

  const unfollow = (channel: StreamChannel) => {
    toggleFollow(channel.id);
    setLastUnfollowed(channel);
  };

  const undo = () => {
    if (lastUnfollowed && !followedIds.includes(lastUnfollowed.id)) toggleFollow(lastUnfollowed.id);
    setLastUnfollowed(null);
  };

  return (
    <>
      <SectionHeader
        title="Theo dõi của tôi"
        description={`Bạn đang theo dõi ${channels.length} kênh.`}
      />

      {lastUnfollowed && (
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-300">
          <span>
            Đã bỏ theo dõi <strong className="text-white">{lastUnfollowed.name}</strong>.
          </span>
          <button
            onClick={undo}
            className="inline-flex items-center gap-1.5 font-bold text-(--brand-light) hover:text-white transition-colors cursor-pointer"
          >
            <Undo2 className="w-3.5 h-3.5" /> Hoàn tác
          </button>
        </div>
      )}

      {channels.length === 0 ? (
        <div className={`${cardClass} py-14 px-6 flex flex-col items-center text-center`}>
          <span className="p-3 rounded-2xl bg-rose-500/10 text-rose-400">
            <Heart className="w-6 h-6" />
          </span>
          <p className="mt-4 text-sm font-bold text-white">Bạn chưa theo dõi kênh nào</p>
          <p className="mt-1 text-xs text-zinc-400">Theo dõi streamer yêu thích để nhận thông báo khi họ lên sóng.</p>
          <button
            onClick={() => setActiveTab('home')}
            className="group mt-5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5" /> Khám phá kênh
            <AnimatedArrow />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {channels.map((c) => (
            <div
              key={c.id}
              className={`${cardClass} p-4 flex flex-col gap-3 hover:border-white/15 transition-colors`}
            >
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <img
                    src={c.avatar}
                    alt={c.name}
                    className={`w-12 h-12 rounded-full object-cover ${
                      c.isLive ? 'ring-2 ring-red-500' : 'ring-1 ring-white/15'
                    }`}
                  />
                  {c.isLive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1 rounded bg-red-600 text-[8px] font-extrabold text-white">
                      LIVE
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1 text-sm font-bold text-white">
                    <span className="truncate">{c.name}</span>
                    {c.verified && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                  </p>
                  <p className="text-[11px] text-zinc-400 truncate">{c.category}</p>
                  <p className="text-[11px] text-zinc-500">{c.followers} người theo dõi</p>
                </div>
              </div>

              {c.isLive && (
                <p className="text-[11px] text-zinc-300 line-clamp-1" title={c.title}>
                  <span className="text-red-400 font-bold tabular-nums">
                    ● {(c.viewers / 1000).toFixed(1)}K
                  </span>{' '}
                  · {c.title}
                </p>
              )}

              <div className="flex gap-2 mt-auto">
                <button
                  onClick={() => {
                    onSelectChannel(c);
                    setActiveTab(c.isLive ? 'watch' : 'channel');
                  }}
                  className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  {c.isLive ? 'Xem live' : 'Xem kênh'}
                </button>
                <button
                  onClick={() => unfollow(c)}
                  className="px-3 py-2 rounded-xl border border-white/10 text-xs font-semibold text-zinc-400 hover:text-rose-300 hover:border-rose-500/40 hover:bg-rose-500/10 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <UserMinus className="w-3.5 h-3.5" />
                  Bỏ theo dõi
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

/* ------------------------------------------------------------------ */
/* Xu của tôi                                                          */
/* ------------------------------------------------------------------ */

const COIN_CARDS: {
  type: CoinTxnType;
  title: string;
  icon: typeof Gift;
  iconClass: string;
  amountClass: string;
  sign: string;
  emptyText: string;
}[] = [
  {
    type: 'gifted',
    title: 'Xu đã tặng trong tháng',
    icon: Gift,
    iconClass: 'bg-rose-500/10 text-rose-400',
    amountClass: 'text-rose-300',
    sign: '-',
    emptyText: 'Bạn chưa tặng quà nào trong tháng này.',
  },
  {
    type: 'received',
    title: 'Xu đã nhận trong tháng',
    icon: ArrowDownLeft,
    iconClass: 'bg-emerald-500/10 text-emerald-400',
    amountClass: 'text-emerald-300',
    sign: '+',
    emptyText: 'Chưa nhận được Xu nào trong tháng này.',
  },
  {
    type: 'expired',
    title: 'Xu đã hết hạn trong tháng',
    icon: Hourglass,
    iconClass: 'bg-zinc-500/15 text-zinc-300',
    amountClass: 'text-zinc-300',
    sign: '-',
    emptyText: 'Không có Xu nào hết hạn trong tháng này.',
  },
];

const MonthSelect: React.FC<{
  months: MonthOption[];
  value: string;
  onChange: (key: string) => void;
}> = ({ months, value, onChange }) => (
  <label className="relative block">
    <span className="sr-only">Chọn tháng</span>
    <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full appearance-none bg-[#1C1C28] border border-white/10 hover:border-white/20 rounded-xl pl-8 pr-8 py-2 text-xs font-semibold text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/10 transition-colors [color-scheme:dark]"
    >
      {months.map((m) => (
        <option key={m.key} value={m.key} className="bg-[#1C1C28]">
          {m.label}
        </option>
      ))}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
  </label>
);

const CoinHistoryCard: React.FC<{ config: (typeof COIN_CARDS)[number]; months: MonthOption[] }> = ({
  config,
  months,
}) => {
  const [monthKey, setMonthKey] = useState(months[0].key);
  const month = months.find((m) => m.key === monthKey) ?? months[0];
  const txns = useMemo(
    () => getCoinTransactions(config.type, month.year, month.month),
    [config.type, month.year, month.month]
  );
  const total = txns.reduce((sum, t) => sum + t.amount, 0);
  const Icon = config.icon;

  return (
    <div className={`${cardClass} flex flex-col min-w-0`}>
      <div className="p-4 space-y-3">
        <h3 className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-zinc-400">
          <span className={`p-1.5 rounded-lg ${config.iconClass}`}>
            <Icon className="w-3.5 h-3.5" />
          </span>
          {config.title}
        </h3>
        <MonthSelect months={months} value={monthKey} onChange={setMonthKey} />
        <div>
          <p className={`text-2xl font-black tabular-nums ${config.amountClass}`}>
            {total > 0 ? config.sign : ''}
            {total.toLocaleString('vi-VN')} <span className="text-sm font-bold">Xu</span>
          </p>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            {txns.length} giao dịch · {month.label}
          </p>
        </div>
      </div>

      <div className="border-t border-white/6 flex-1 max-h-72 overflow-y-auto">
        {txns.length === 0 ? (
          <p className="px-4 py-8 text-center text-xs text-zinc-500">{config.emptyText}</p>
        ) : (
          <ul className="divide-y divide-white/5">
            {txns.map((t) => (
              <li key={t.id} className="px-4 py-2.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate" title={t.title}>
                    {t.title}
                  </p>
                  <p className="text-[11px] text-zinc-500 truncate">
                    {t.detail} · <span className="tabular-nums">{formatTxnTime(t.date)}</span>
                  </p>
                </div>
                <span className={`text-xs font-bold tabular-nums shrink-0 ${config.amountClass}`}>
                  {config.sign}
                  {t.amount.toLocaleString('vi-VN')}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const CoinsSection: React.FC<{ coins: number; setActiveTab: (tab: ActiveTab) => void }> = ({
  coins,
  setActiveTab,
}) => {
  const months = useMemo(() => getRecentMonths(12), []);

  return (
    <>
      <SectionHeader title="Xu của tôi" description="Số dư hiện tại và lịch sử Xu theo từng tháng." />

      <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-transparent border border-amber-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-300/80 flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5" /> Xu hiện tại
          </p>
          <p className="mt-2 text-4xl font-black text-white tabular-nums">
            {coins.toLocaleString('vi-VN')} <span className="text-lg font-bold text-amber-300">Xu</span>
          </p>
          <p className="text-xs text-zinc-400 mt-1">
            Dùng để tặng quà, gửi Super Chat và mua hàng trong phiên Live.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('wallet')}
          className="group self-start sm:self-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 text-sm font-black shadow-lg shadow-orange-900/30 hover:brightness-110 transition-all cursor-pointer inline-flex items-center gap-1.5"
        >
          Nạp thêm Xu
          <AnimatedArrow />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
        {COIN_CARDS.map((config) => (
          <CoinHistoryCard key={config.type} config={config} months={months} />
        ))}
      </div>
    </>
  );
};
