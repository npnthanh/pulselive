import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  PictureInPicture2,
  Settings,
  Users,
  Heart,
  Share2,
  Star,
  Gift,
  Send,
  Sparkles,
  Swords,
  ShoppingBag,
  Trophy,
  Pin,
  CheckCircle2,
  ArrowDown,
  Flame,
  Clock,
  ShieldCheck,
  Smile,
  Plus,
  Check,
  X,
} from 'lucide-react';
import {
  type StreamChannel,
  type StreamMode,
  VIRTUAL_GIFTS,
  type VirtualGift,
  LIVE_PRODUCTS,
  type LiveProduct,
  INITIAL_CHAT_MESSAGES,
  type ChatMessage,
  TOP_SUPPORTERS,
} from '../data/mockData';
import type { ActiveTab, BrandTheme } from './Navbar';

interface WatchRoomViewProps {
  channel: StreamChannel;
  theaterMode: boolean;
  setTheaterMode: (val: boolean) => void;
  coins: number;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
  followedIds: string[];
  toggleFollow: (id: string) => void;
  onEnablePiP: () => void;
  setActiveTab: (tab: ActiveTab) => void;
  brandTheme: BrandTheme;
  onAddToCart: (product: LiveProduct) => void;
  cartItems: { product: LiveProduct; qty: number }[];
}

interface FloatingHeart {
  id: number;
  color: string;
  leftOffset: number;
  emoji: string;
}

interface ActiveGiftBanner {
  id: number;
  sender: string;
  gift: VirtualGift;
  count: number;
}

const SIMULATED_CHAT_POOL = [
  { user: 'MinhDuc_FPS', color: '#38BDF8', badges: ['sub'] as const, text: 'Pha xử lý vừa rồi đỉnh thực sự anh em ơi 🔥🔥' },
  { user: 'ThaoVy_Cute', color: '#F472B6', badges: ['vip'] as const, text: 'Thả tim liên tục cho kênh lên Top 1 Trending nào cả nhà ❤️❤️' },
  { user: 'QuocBao_99', color: '#34D399', badges: [] as const, text: 'Chất lượng 1080p60 mượt không độ trễ luôn!' },
  { user: 'HuyHoang_Pro', color: '#A78BFA', badges: ['sub'] as const, text: 'Ai đang xem ở chế độ Rạp chiếu phim (Theater Mode) điểm danh 👋' },
  { user: 'LinhChi_98', color: '#FBBF24', badges: ['vip', 'sub'] as const, text: 'Lên tiếp máu PK anh em ơi đừng để thua hiệp này!! ⚔️🔥' },
  { user: 'TuanAnh_Gear', color: '#60A5FA', badges: [] as const, text: 'Vừa chốt đơn con bàn phím trong giỏ hàng Live được giảm hẳn 700k ngon quá' },
];

export const WatchRoomView: React.FC<WatchRoomViewProps> = ({
  channel,
  theaterMode,
  setTheaterMode,
  coins,
  setCoins,
  followedIds,
  toggleFollow,
  onEnablePiP,
  setActiveTab,
  brandTheme,
  onAddToCart,
  cartItems,
}) => {
  // Stream mode state (defaults to channel's mode, but user can switch anytime to preview all 3 UI paradigms)
  const [streamMode, setStreamMode] = useState<StreamMode>(channel.mode);
  useEffect(() => {
    setStreamMode(channel.mode);
  }, [channel]);

  // Video Player Controls
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [quality, setQuality] = useState<'1080p60 Source' | '720p60' | '480p'>('1080p60 Source');
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [dvrPosition, setDvrPosition] = useState(100); // 100 = Real-time LIVE
  const [liveViewerCount, setLiveViewerCount] = useState(channel.viewers);

  // PK Battle Score State
  const [myPkScore, setMyPkScore] = useState(channel.pkOpponent?.myScore || 64200);
  const oppPkScore = channel.pkOpponent?.score || 48900;

  // Live Commerce State
  const [pinnedProduct, setPinnedProduct] = useState<LiveProduct>(LIVE_PRODUCTS[0]);
  const [showShopDrawer, setShowShopDrawer] = useState(false);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  // Gift & Reactions State
  const [selectedGift, setSelectedGift] = useState<VirtualGift>(VIRTUAL_GIFTS[0]);
  const [giftQty, setGiftQty] = useState<number>(1);
  const [activeGiftBanner, setActiveGiftBanner] = useState<ActiveGiftBanner | null>(null);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const [supporters, setSupporters] = useState(TOP_SUPPORTERS);

  // Poll / Prediction State
  const [pollVisible, setPollVisible] = useState(true);
  const [votedOption, setVotedOption] = useState<'A' | 'B' | null>(null);
  const [pollVotes, setPollVotes] = useState({ A: 68, B: 32, total: 1420 });

  // Live Chat State
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [chatInput, setChatInput] = useState('');
  const [isSuperChatMode, setIsSuperChatMode] = useState(false);
  const [autoScrollPaused, setAutoScrollPaused] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setLiveViewerCount(channel.viewers);
  }, [channel]);

  // Simulate real-time viewer count fluctuation & incoming chat messages
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveViewerCount((prev) => prev + Math.floor(Math.random() * 25) - 10);

      const randomMsg =
        SIMULATED_CHAT_POOL[Math.floor(Math.random() * SIMULATED_CHAT_POOL.length)];
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes()
      ).padStart(2, '0')}`;

      const newMsg: ChatMessage = {
        id: `sim-${Date.now()}`,
        user: randomMsg.user,
        color: randomMsg.color,
        badges: [...randomMsg.badges],
        text: randomMsg.text,
        timestamp: timeStr,
      };

      setMessages((prev) => [...prev.slice(-45), newMsg]);
      if (autoScrollPaused) {
        setUnreadCount((c) => c + 1);
      }
    }, 3800);

    return () => clearInterval(interval);
  }, [autoScrollPaused]);

  // Auto-scroll chat to bottom when not paused
  useEffect(() => {
    if (!autoScrollPaused && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, autoScrollPaused]);

  const handleChatScroll = () => {
    const el = chatContainerRef.current;
    if (!el) return;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 65;
    if (isNearBottom) {
      setAutoScrollPaused(false);
      setUnreadCount(0);
    } else {
      setAutoScrollPaused(true);
    }
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      setAutoScrollPaused(false);
      setUnreadCount(0);
    }
  };

  const triggerHeart = () => {
    const emojis = ['❤️', '💖', '🔥', '💜', '✨', '💎'];
    const newHeart: FloatingHeart = {
      id: Date.now() + Math.random(),
      color: '#F43F5E',
      leftOffset: Math.floor(Math.random() * 55) + 15,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    };
    setFloatingHearts((prev) => [...prev.slice(-14), newHeart]);
  };

  const handleSendGift = () => {
    const totalCost = selectedGift.price * giftQty;
    if (coins < totalCost) {
      setActiveTab('wallet');
      return;
    }

    setCoins((prev) => prev - totalCost);

    // Trigger Gift Combo Overlay on Video
    setActiveGiftBanner({
      id: Date.now(),
      sender: 'Bạn (VIP)',
      gift: selectedGift,
      count: giftQty,
    });

    // Boost PK score if in PK mode
    setMyPkScore((prev) => prev + totalCost * 12);

    // Update Leaderboard
    setSupporters((prev) => {
      const updated = prev.map((s) =>
        s.rank === 1 ? { ...s, points: s.points + totalCost } : s
      );
      return updated;
    });

    // Add Gift SuperChat Message
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const giftChatMsg: ChatMessage = {
      id: `gift-${Date.now()}`,
      user: 'Bạn (VIP)',
      color: '#F59E0B',
      badges: ['vip', 'sub'],
      text: `Đã gửi tặng ${selectedGift.emoji} ${selectedGift.name} x${giftQty}!`,
      timestamp: timeStr,
      isSuperChat: totalCost >= 100,
      superChatAmount: totalCost,
      giftInfo: {
        emoji: selectedGift.emoji,
        name: selectedGift.name,
        count: giftQty,
      },
    };

    setMessages((prev) => [...prev, giftChatMsg]);
    triggerHeart();
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const superChatCost = isSuperChatMode ? 100 : 0;
    if (superChatCost > 0 && coins < superChatCost) {
      setActiveTab('wallet');
      return;
    }
    if (superChatCost > 0) {
      setCoins((c) => c - superChatCost);
    }

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      user: 'Bạn (Thành viên)',
      color: '#A78BFA',
      badges: ['vip', 'sub'],
      text: chatInput,
      timestamp: timeStr,
      isSuperChat: isSuperChatMode,
      superChatAmount: isSuperChatMode ? 100 : undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsSuperChatMode(false);
    setTimeout(scrollToBottom, 50);
  };

  const handleVotePoll = (choice: 'A' | 'B') => {
    if (votedOption) return;
    setVotedOption(choice);
    setPollVotes((prev) => {
      const newTotal = prev.total + 1;
      const newA = choice === 'A' ? Math.min(95, prev.A + 2) : Math.max(5, prev.A - 2);
      return { A: newA, B: 100 - newA, total: newTotal };
    });
  };

  const isFollowed = followedIds.includes(channel.id);
  const totalPk = myPkScore + oppPkScore;
  const myPkPercent = Math.round((myPkScore / totalPk) * 100);

  const brandButtonClass =
    brandTheme === 'violet'
      ? 'bg-violet-600 hover:bg-violet-500'
      : brandTheme === 'kick'
      ? 'bg-emerald-600 hover:bg-emerald-500'
      : 'bg-rose-600 hover:bg-rose-500';

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-4rem)] overflow-hidden bg-[#0E0E12]">
      {/* CENTER COLUMN: VIDEO STAGE + STREAMER INFO + GIFT DOCK */}
      <div className="flex-1 flex flex-col overflow-y-auto min-w-0">
        {/* Top Mode Switcher Bar (Allows testing Standard, PK Battle, and Live Commerce layouts) */}
        <div className="bg-[#14141D] border-b border-white/8 px-4 py-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mr-1">
              Giao diện Phòng Live:
            </span>
            <button
              onClick={() => setStreamMode('standard')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                streamMode === 'standard'
                  ? 'bg-white text-slate-950 shadow'
                  : 'bg-white/5 text-zinc-300 hover:bg-white/10'
              }`}
            >
              <span>🎮 Chuẩn 16:9 (Twitch/Kick)</span>
            </button>
            <button
              onClick={() => setStreamMode('pk')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                streamMode === 'pk'
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow'
                  : 'bg-white/5 text-zinc-300 hover:bg-white/10'
              }`}
            >
              <Swords className="w-3.5 h-3.5" />
              <span>Đấu PK Đôi (TikTok/Bigo)</span>
            </button>
            <button
              onClick={() => setStreamMode('commerce')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                streamMode === 'commerce'
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : 'bg-white/5 text-zinc-300 hover:bg-white/10'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Live Bán Hàng (Shopee/TikTok Shop)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheaterMode(!theaterMode)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                theaterMode
                  ? 'bg-violet-500/20 text-violet-300 border-violet-500/40'
                  : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10'
              }`}
              title="Ẩn thanh bên trái để mở rộng không gian xem"
            >
              {theaterMode ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" /> Thoát Rạp Chiếu Phim
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" /> Chế Độ Rạp Chiếu Phim
                </>
              )}
            </button>

            <button
              onClick={onEnablePiP}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 transition-colors cursor-pointer flex items-center gap-1.5"
              title="Thu nhỏ video góc phải và quay về Trang chủ"
            >
              <PictureInPicture2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Thu Nhỏ (PiP)</span>
            </button>
          </div>
        </div>

        {/* MAIN VIDEO PLAYER STAGE */}
        <div
          className={`relative w-full bg-black overflow-hidden select-none group ${
            theaterMode ? 'h-[68vh]' : 'aspect-video max-h-[64vh]'
          }`}
        >
          {/* MODE 1 & 3: SINGLE STREAM STAGE */}
          {streamMode !== 'pk' ? (
            <div className="relative w-full h-full">
              <img
                src={channel.thumbnail}
                alt={channel.title}
                className={`w-full h-full object-cover transition-all duration-700 ${
                  isPlaying ? 'scale-100 opacity-85' : 'scale-105 opacity-40 blur-[2px]'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40" />
            </div>
          ) : (
            /* MODE 2: PK BATTLE SPLIT-SCREEN STAGE (TikTok/Bigo PK UI) */
            <div className="relative w-full h-full flex flex-col bg-[#101018]">
              {/* PK Top Health / Score Bar */}
              <div className="relative z-20 px-4 pt-3 pb-2 bg-gradient-to-b from-black/90 to-transparent">
                <div className="flex items-center justify-between text-xs font-extrabold mb-1.5">
                  <div className="flex items-center gap-2 text-cyan-300">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-400/40">
                      ĐỘI CHỦ NHÀ • {myPkPercent}%
                    </span>
                    <span className="tabular-nums text-white">
                      {myPkScore.toLocaleString('vi-VN')} điểm
                    </span>
                  </div>

                  {/* PK Countdown Timer Center */}
                  <div className="px-3 py-1 rounded-full bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white text-xs font-black tracking-wider flex items-center gap-1.5 shadow-lg">
                    <Swords className="w-3.5 h-3.5" />
                    <span>PK TIME • 02:34</span>
                  </div>

                  <div className="flex items-center gap-2 text-pink-300">
                    <span className="tabular-nums text-white">
                      {oppPkScore.toLocaleString('vi-VN')} điểm
                    </span>
                    <span className="px-2 py-0.5 rounded bg-pink-500/20 border border-pink-400/40">
                      {100 - myPkPercent}% • ĐỐI THỦ
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-3.5 rounded-full overflow-hidden bg-pink-600 flex p-0.5 shadow-inner">
                  <div
                    style={{ width: `${myPkPercent}%` }}
                    className="h-full rounded-l-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-400 transition-all duration-500 relative flex items-center justify-end pr-1"
                  >
                    <Flame className="w-3 h-3 text-white animate-bounce" />
                  </div>
                </div>
              </div>

              {/* Split 2 Cameras */}
              <div className="flex-1 grid grid-cols-2 gap-1 px-2 pb-12">
                {/* Left Streamer (Host) */}
                <div className="relative rounded-2xl overflow-hidden border border-cyan-500/40 bg-black">
                  <img
                    src={channel.thumbnail}
                    alt={channel.name}
                    className="w-full h-full object-cover opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <img
                      src={channel.avatar}
                      alt={channel.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-cyan-400"
                    />
                    <div>
                      <span className="text-xs font-extrabold text-white block">
                        {channel.name}
                      </span>
                      <span className="text-[10px] text-cyan-300 font-bold">
                        👑 MVP: HoangTuan_VIP
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Streamer (PK Opponent) */}
                <div className="relative rounded-2xl overflow-hidden border border-pink-500/40 bg-black">
                  <img
                    src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=900&auto=format&fit=crop&q=80"
                    alt="Opponent"
                    className="w-full h-full object-cover opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=160&auto=format&fit=crop&q=80"
                      alt="Minh Trang Vocal"
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-pink-400"
                    />
                    <div>
                      <span className="text-xs font-extrabold text-white block">
                        Minh Trang Vocal
                      </span>
                      <span className="text-[10px] text-pink-300 font-bold">
                        Đang hát: Nàng Thơ (Acoustic)
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleSendGift}
                    className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-pink-600/90 hover:bg-pink-500 text-[11px] font-bold text-white shadow cursor-pointer"
                  >
                    ⚡ Tiếp máu PK ngay
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TOP OVERLAY STATUS BAR ON VIDEO */}
          <div className="absolute top-3 left-4 right-4 flex items-center justify-between pointer-events-none z-20">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-red-600 text-white text-xs font-black tracking-wider flex items-center gap-1.5 shadow-lg live-pulse">
                <span className="w-2 h-2 rounded-full bg-white" />
                LIVE
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-black/65 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 border border-white/10 tabular-nums">
                <Users className="w-3.5 h-3.5 text-red-400" />
                {liveViewerCount.toLocaleString('vi-VN')}
              </span>
              <span className="hidden sm:inline-flex px-2.5 py-1 rounded-lg bg-black/65 backdrop-blur-md text-zinc-200 text-xs font-semibold border border-white/10 tabular-nums items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                {channel.duration}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-black/65 backdrop-blur-md text-emerald-400 text-[11px] font-bold border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Độ trễ siêu thấp (0.8s)
              </span>
            </div>
          </div>

          {/* GIFT COMBO ANIMATION OVERLAY BANNER */}
          {activeGiftBanner && (
            <div
              key={activeGiftBanner.id}
              className="absolute top-16 left-4 z-30 animate-gift-banner pointer-events-none"
            >
              <div
                className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-gradient-to-r ${activeGiftBanner.gift.color} text-white shadow-2xl border border-white/30`}
              >
                <span className="text-3xl drop-shadow">{activeGiftBanner.gift.emoji}</span>
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wider text-white/90">
                    {activeGiftBanner.sender}
                  </p>
                  <p className="text-sm font-black">
                    Tặng {activeGiftBanner.gift.name}!
                  </p>
                </div>
                <div className="ml-2 px-3 py-1 rounded-xl bg-black/30 backdrop-blur-sm font-black text-xl italic tracking-tight text-yellow-300 tabular-nums">
                  x{activeGiftBanner.count}
                </div>
              </div>
            </div>
          )}

          {/* LIVE COMMERCE PINNED PRODUCT OVERLAY (When in Commerce mode) */}
          {streamMode === 'commerce' && (
            <div className="absolute bottom-14 left-4 z-30 w-80 sm:w-96 bg-[#161621]/95 backdrop-blur-xl border border-amber-400/40 rounded-2xl p-3 shadow-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px] font-extrabold uppercase">
                  🔥 {pinnedProduct.badge} • Flash Sale 09:42
                </span>
                <button
                  onClick={() => setShowShopDrawer(true)}
                  className="text-[11px] font-bold text-amber-300 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <ShoppingBag className="w-3 h-3" />
                  Xem tất cả ({LIVE_PRODUCTS.length})
                </button>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={pinnedProduct.image}
                  alt={pinnedProduct.name}
                  className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                    {pinnedProduct.name}
                  </h4>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-sm font-black text-amber-400 tabular-nums">
                      {pinnedProduct.price.toLocaleString('vi-VN')}đ
                    </span>
                    <span className="text-[11px] text-zinc-500 line-through tabular-nums">
                      {pinnedProduct.originalPrice.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onAddToCart(pinnedProduct);
                    setAddedToast(pinnedProduct.name);
                    setTimeout(() => setAddedToast(null), 2200);
                  }}
                  className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-extrabold text-xs shadow hover:scale-105 transition-transform shrink-0 cursor-pointer"
                >
                  Mua ngay
                </button>
              </div>

              {addedToast && (
                <div className="mt-2 px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" /> Đã thêm vào giỏ hàng Live!
                </div>
              )}
            </div>
          )}

          {/* FLOATING HEARTS REACTION STREAM (Right Edge of Video) */}
          <div className="absolute bottom-14 right-5 w-20 h-56 pointer-events-none overflow-hidden z-20">
            {floatingHearts.map((h) => (
              <span
                key={h.id}
                style={{ left: `${h.leftOffset}%` }}
                className="absolute bottom-0 text-2xl animate-float-heart select-none"
              >
                {h.emoji}
              </span>
            ))}
          </div>

          {/* Floating Heart Trigger Button & Shopping Bag Trigger on Video Right */}
          <div className="absolute bottom-14 right-4 z-30 flex flex-col items-center gap-2">
            {streamMode === 'commerce' && (
              <button
                onClick={() => setShowShopDrawer(!showShopDrawer)}
                className="relative p-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-xl transition-transform active:scale-90 cursor-pointer"
                title="Mở Giỏ Hàng Livestream"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center">
                  {cartItems.reduce((acc, i) => acc + i.qty, 0)}
                </span>
              </button>
            )}

            <button
              onClick={triggerHeart}
              className="p-3 rounded-2xl bg-rose-600/90 hover:bg-rose-500 text-white shadow-xl border border-white/20 transition-transform active:scale-90 cursor-pointer"
              title="Thả tim cổ vũ Streamer"
            >
              <Heart className="w-5 h-5 fill-white" />
            </button>
          </div>

          {/* VIDEO PLAYER BOTTOM CONTROLS & DVR BAR */}
          <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/95 via-black/70 to-transparent px-4 pt-6 pb-2.5">
            {/* DVR Seekbar (YouTube Live style scrubbable progress) */}
            <div className="flex items-center gap-2.5 mb-2">
              <input
                type="range"
                min={0}
                max={100}
                value={dvrPosition}
                onChange={(e) => setDvrPosition(Number(e.target.value))}
                className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
              {dvrPosition < 100 ? (
                <button
                  onClick={() => setDvrPosition(100)}
                  className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-extrabold whitespace-nowrap cursor-pointer"
                >
                  ⏪ Đang tua (-{100 - dvrPosition}p) • Bấm về LIVE
                </button>
              ) : (
                <span className="text-[10px] font-extrabold text-red-400 whitespace-nowrap">
                  ● ĐỒNG BỘ TRỰC TIẾP
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="text-white hover:text-violet-300 transition-colors cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-white hover:text-violet-300 transition-colors cursor-pointer"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-red-400" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>
                <span className="text-xs text-zinc-300 font-medium hidden sm:inline tabular-nums">
                  {channel.bitrate} • {channel.fps} FPS
                </span>
              </div>

              {/* Right Player Controls: Quality Selector, Theater, PiP */}
              <div className="flex items-center gap-2 relative">
                <div className="relative">
                  <button
                    onClick={() => setShowQualityMenu(!showQualityMenu)}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>{quality}</span>
                  </button>
                  {showQualityMenu && (
                    <div className="absolute bottom-9 right-0 w-44 bg-[#181822] border border-white/15 rounded-xl p-1.5 shadow-2xl z-40">
                      {(['1080p60 Source', '720p60', '480p'] as const).map((q) => (
                        <button
                          key={q}
                          onClick={() => {
                            setQuality(q);
                            setShowQualityMenu(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between cursor-pointer ${
                            quality === q
                              ? 'bg-violet-600 text-white'
                              : 'text-zinc-300 hover:bg-white/10'
                          }`}
                        >
                          <span>{q}</span>
                          {quality === q && <Check className="w-3.5 h-3.5" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* LIVE SHOPPING SLIDE-OVER DRAWER (Inside Video Stage when opened) */}
          {showShopDrawer && (
            <div className="absolute top-0 right-0 bottom-0 w-80 sm:w-96 bg-[#14141D]/98 backdrop-blur-2xl border-l border-white/15 z-40 flex flex-col p-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-extrabold text-white">
                    Giỏ Hàng Phiên Live ({LIVE_PRODUCTS.length})
                  </h3>
                </div>
                <button
                  onClick={() => setShowShopDrawer(false)}
                  className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
                {LIVE_PRODUCTS.map((prod, idx) => (
                  <div
                    key={prod.id}
                    className="p-2.5 rounded-2xl bg-white/5 border border-white/8 hover:border-amber-400/40 transition-all flex gap-3"
                  >
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-1 left-1 px-1.5 py-0.2 rounded bg-black/80 text-[9px] font-bold text-amber-300">
                        #{idx + 1}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-xs font-bold text-white line-clamp-1">{prod.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-black text-amber-400 tabular-nums">
                            {prod.price.toLocaleString('vi-VN')}đ
                          </span>
                          <span className="text-[10px] text-zinc-500 line-through tabular-nums">
                            {prod.originalPrice.toLocaleString('vi-VN')}đ
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-1.5">
                        <button
                          onClick={() => setPinnedProduct(prod)}
                          className="text-[10px] font-semibold text-zinc-400 hover:text-white cursor-pointer"
                        >
                          📌 Xem trên màn hình
                        </button>
                        <button
                          onClick={() => onAddToCart(prod)}
                          className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-[11px] flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" /> Thêm giỏ
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 2. INTERACTIVE GIFT DOCK (Virtual Gifting Bar right under Video) */}
        <div className="bg-[#15151F] border-b border-white/8 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-extrabold text-zinc-300 flex items-center gap-1.5 mr-1 shrink-0">
              <Gift className="w-4 h-4 text-rose-400" />
              <span>Quà Tặng:</span>
            </span>
            {VIRTUAL_GIFTS.map((gift) => {
              const selected = selectedGift.id === gift.id;
              return (
                <button
                  key={gift.id}
                  onClick={() => setSelectedGift(gift)}
                  className={`px-3 py-1.5 rounded-xl border text-left transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                    selected
                      ? 'bg-white/12 border-amber-400 shadow-md scale-[1.02]'
                      : 'bg-[#1C1C28] border-white/8 hover:bg-white/8'
                  }`}
                >
                  <span className="text-lg">{gift.emoji}</span>
                  <div>
                    <p className="text-[11px] font-bold text-white leading-tight">{gift.name}</p>
                    <p className="text-[10px] font-bold text-amber-400 tabular-nums">
                      💎 {gift.price} Xu
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Multiplier & Send Gift CTA */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center bg-[#1C1C28] border border-white/10 rounded-xl p-1">
              {[1, 10, 66, 99].map((mult) => (
                <button
                  key={mult}
                  onClick={() => setGiftQty(mult)}
                  className={`px-2 py-1 rounded-lg text-xs font-extrabold tabular-nums transition-colors cursor-pointer ${
                    giftQty === mult
                      ? 'bg-amber-400 text-slate-950'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  x{mult}
                </button>
              ))}
            </div>

            <button
              onClick={handleSendGift}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 text-slate-950 font-black text-xs shadow-lg hover:scale-105 transition-transform flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                Tặng ({(selectedGift.price * giftQty).toLocaleString('vi-VN')} Xu)
              </span>
            </button>
          </div>
        </div>

        {/* 3. STREAMER METADATA & CHANNEL ABOUT PANELS */}
        <div className="p-4 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/8">
            <div className="flex items-start gap-3.5">
              <div className="relative shrink-0">
                <img
                  src={channel.avatar}
                  alt={channel.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-red-500"
                />
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded bg-red-600 text-[9px] font-extrabold text-white">
                  LIVE
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-base sm:text-lg font-extrabold text-white">
                    {channel.title}
                  </h1>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                  <button
                    onClick={() => setActiveTab('channel')}
                    className="font-bold text-white hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{channel.name}</span>
                    {channel.verified && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                  </button>
                  <span>•</span>
                  <span className="text-violet-300 font-semibold">{channel.category}</span>
                  <span>•</span>
                  <span>{channel.followers} người theo dõi</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {channel.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-white/6 text-zinc-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Follow, Subscribe & Share Actions */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => toggleFollow(channel.id)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isFollowed
                    ? 'bg-white/10 text-white border border-white/15 hover:bg-white/15'
                    : `${brandButtonClass} text-white shadow-lg`
                }`}
              >
                <Heart className={`w-4 h-4 ${isFollowed ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{isFollowed ? 'Đang Theo Dõi' : 'Theo Dõi'}</span>
              </button>

              <button
                onClick={() => setActiveTab('wallet')}
                className="px-4 py-2 rounded-xl text-xs font-extrabold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>Đăng Ký VIP</span>
              </button>

              <button
                onClick={() => setActiveTab('channel')}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 cursor-pointer"
                title="Xem trang hồ sơ kênh"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Info Cards under Stream */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#15151E] border border-white/8 space-y-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-zinc-400">
                Giới Thiệu Kênh
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">{channel.bio}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#15151E] border border-white/8 space-y-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-zinc-400">
                Đặc Quyền Hội Viên (Sub)
              </h3>
              <ul className="text-xs text-zinc-300 space-y-1">
                <li>• Huy hiệu VIP lấp lánh trước tên trong khung Chat</li>
                <li>• Mở khóa 25 bộ Emote độc quyền của kênh</li>
                <li>• Xem livestream 1080p60 không quảng cáo</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-[#15151E] border border-white/8 space-y-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-zinc-400">
                Lịch Phát Sóng Cố Định
              </h3>
              <div className="text-xs text-zinc-300 space-y-1">
                <p className="flex justify-between">
                  <span>Thứ 2 – Thứ 6:</span>
                  <strong className="text-emerald-400">21:30 – 01:00</strong>
                </p>
                <p className="flex justify-between">
                  <span>Thứ 7 (Giải đấu / PK):</span>
                  <strong className="text-amber-400">20:00 – 02:00</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: SMART LIVE CHAT + LEADERBOARD + POLLS */}
      <aside className="w-full lg:w-88 xl:w-96 shrink-0 bg-[#13131A] border-t lg:border-t-0 lg:border-l border-white/8 flex flex-col h-[420px] lg:h-full">
        {/* Chat Header */}
        <div className="px-4 py-3 border-b border-white/8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-white">
              Trò Chuyện Trực Tiếp
            </h2>
          </div>
          <span className="text-[11px] text-zinc-400 tabular-nums">
            {(liveViewerCount * 0.22).toFixed(0)} người đang chat
          </span>
        </div>

        {/* Top 3 Supporters Leaderboard Bar */}
        <div className="px-3 py-2 bg-[#171721] border-b border-white/6">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1">
              <Trophy className="w-3 h-3" /> Bảng Xếp Hạng Đại Gia Phiên Live
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {supporters.map((s) => (
              <div
                key={s.rank}
                className="px-2 py-1.5 rounded-xl bg-white/5 border border-white/8 flex items-center gap-1.5 min-w-0"
              >
                <span className="text-sm shrink-0">{s.avatar}</span>
                <div className="truncate">
                  <p className="text-[10px] font-bold text-white truncate">
                    #{s.rank} {s.name}
                  </p>
                  <p className="text-[9px] font-bold text-amber-400 tabular-nums">
                    {s.points.toLocaleString('vi-VN')} 💎
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Poll / Prediction Widget */}
        {pollVisible && (
          <div className="mx-3 mt-2.5 p-3 rounded-2xl bg-gradient-to-br from-violet-600/20 to-indigo-900/20 border border-violet-500/30">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-violet-300 flex items-center gap-1">
                <Pin className="w-3 h-3" /> Dự Đoán Trực Tiếp ({pollVotes.total} lượt)
              </span>
              <button
                onClick={() => setPollVisible(false)}
                className="text-[10px] text-zinc-400 hover:text-white cursor-pointer"
              >
                Ẩn
              </button>
            </div>
            <p className="text-xs font-bold text-white mb-2">
              Đội chủ nhà có chiến thắng áp đảo trong hiệp này không?
            </p>
            <div className="space-y-1.5">
              <button
                onClick={() => handleVotePoll('A')}
                className={`w-full relative overflow-hidden rounded-xl p-2 text-left text-xs font-bold border transition-all cursor-pointer ${
                  votedOption === 'A'
                    ? 'border-emerald-400 text-white'
                    : 'border-white/10 text-zinc-200 hover:border-white/30'
                }`}
              >
                <div
                  style={{ width: `${pollVotes.A}%` }}
                  className="absolute inset-y-0 left-0 bg-emerald-500/25 transition-all duration-500"
                />
                <div className="relative flex justify-between">
                  <span>🔥 Chắc chắn thắng (All-in)</span>
                  <span className="tabular-nums">{pollVotes.A}%</span>
                </div>
              </button>

              <button
                onClick={() => handleVotePoll('B')}
                className={`w-full relative overflow-hidden rounded-xl p-2 text-left text-xs font-bold border transition-all cursor-pointer ${
                  votedOption === 'B'
                    ? 'border-rose-400 text-white'
                    : 'border-white/10 text-zinc-200 hover:border-white/30'
                }`}
              >
                <div
                  style={{ width: `${pollVotes.B}%` }}
                  className="absolute inset-y-0 left-0 bg-rose-500/25 transition-all duration-500"
                />
                <div className="relative flex justify-between">
                  <span>⚡ Kèo căng, chưa biết được</span>
                  <span className="tabular-nums">{pollVotes.B}%</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Chat Messages Stream */}
        <div
          ref={chatContainerRef}
          onScroll={handleChatScroll}
          className="flex-1 overflow-y-auto px-3 py-3 space-y-2 relative"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-xl px-2.5 py-1.5 text-xs leading-relaxed transition-colors ${
                msg.isSuperChat
                  ? 'bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-rose-500/20 border border-amber-400/40 shadow-sm'
                  : 'hover:bg-white/4'
              }`}
            >
              {msg.isSuperChat && (
                <div className="flex items-center justify-between text-[10px] font-black text-amber-300 mb-0.5">
                  <span>💎 SUPER CHAT • GHIM NỔI BẬT</span>
                  <span className="tabular-nums">{msg.superChatAmount} XU</span>
                </div>
              )}

              <div className="inline">
                {/* Badges */}
                {msg.badges.includes('top1') && (
                  <span className="inline-block mr-1 px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 text-[9px] font-black align-middle">
                    👑 TOP 1
                  </span>
                )}
                {msg.badges.includes('mod') && (
                  <span className="inline-block mr-1 px-1.5 py-0.2 rounded bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold align-middle">
                    ⚔️ MOD
                  </span>
                )}
                {msg.badges.includes('vip') && (
                  <span className="inline-block mr-1 px-1.5 py-0.2 rounded bg-rose-500/25 text-rose-300 border border-rose-500/40 text-[9px] font-bold align-middle">
                    💎 VIP
                  </span>
                )}
                {msg.badges.includes('sub') && (
                  <span className="inline-block mr-1 px-1.5 py-0.2 rounded bg-violet-500/25 text-violet-300 text-[9px] font-bold align-middle">
                    ⭐ SUB
                  </span>
                )}

                <span style={{ color: msg.color }} className="font-extrabold mr-1.5">
                  {msg.user}:
                </span>
                <span className="text-zinc-200 break-words">{msg.text}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Smart Auto-Scroll Paused Floating Button */}
        {autoScrollPaused && (
          <div className="px-3 pb-2">
            <button
              onClick={scrollToBottom}
              className="w-full py-1.5 rounded-xl bg-violet-600/95 hover:bg-violet-500 text-white text-xs font-bold shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowDown className="w-3.5 h-3.5" />
              <span>
                Đang tạm dừng cuộn {unreadCount > 0 ? `(${unreadCount} tin mới)` : ''} — Bấm xuống cuối
              </span>
            </button>
          </div>
        )}

        {/* Quick Emote Bar & Chat Input Form */}
        <div className="p-3 bg-[#161620] border-t border-white/8 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {['🔥', '❤️', '😂', '👏', '🚀', '👑', '⚡'].map((emo) => (
                <button
                  key={emo}
                  type="button"
                  onClick={() => setChatInput((prev) => prev + emo)}
                  className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-sm transition-transform active:scale-90 cursor-pointer"
                >
                  {emo}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsSuperChatMode(!isSuperChatMode)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold border transition-all cursor-pointer flex items-center gap-1 ${
                isSuperChatMode
                  ? 'bg-amber-400 text-slate-950 border-amber-400'
                  : 'bg-white/5 text-amber-300 border-amber-400/30 hover:bg-amber-500/15'
              }`}
              title="Gửi tin nhắn Super Chat nổi bật (100 Xu)"
            >
              <Sparkles className="w-3 h-3" />
              <span>Super Chat</span>
            </button>
          </div>

          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={
                  isSuperChatMode
                    ? 'Nhập tin nhắn Super Chat nổi bật (100 Xu)...'
                    : 'Gửi tin nhắn giao lưu...'
                }
                className={`w-full bg-[#1E1E2A] border rounded-xl pl-3 pr-8 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none ${
                  isSuperChatMode
                    ? 'border-amber-400 ring-1 ring-amber-400/40'
                    : 'border-white/10 focus:border-white/30'
                }`}
              />
              <Smile className="w-4 h-4 text-zinc-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              type="submit"
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold text-white ${brandButtonClass} transition-transform active:scale-95 flex items-center gap-1 cursor-pointer shrink-0`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Gửi</span>
            </button>
          </form>
        </div>
      </aside>
    </div>
  );
};
