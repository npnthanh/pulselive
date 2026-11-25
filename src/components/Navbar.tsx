import React, { useCallback, useState } from 'react';
import { Radio, Search, Bell, Sparkles, Flame, ShoppingBag, Swords } from 'lucide-react';
import { STREAM_CHANNELS, type StreamChannel } from '../data/mockData';
import { SettingsMenu, type Language } from './SettingsMenu';

export type ActiveTab = 'home' | 'watch' | 'studio' | 'channel' | 'wallet' | 'account';
export type BrandTheme = 'violet' | 'kick' | 'coral';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  brandTheme: BrandTheme;
  setBrandTheme: (theme: BrandTheme) => void;
  coins: number;
  onSelectChannel: (channel: StreamChannel) => void;
  cartCount: number;
  userAvatar: string;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  brandTheme,
  setBrandTheme,
  coins,
  onSelectChannel,
  cartCount,
  userAvatar,
  language,
  setLanguage,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  // Only one header dropdown open at a time
  const [openMenu, setOpenMenu] = useState<'notifications' | 'settings' | null>(null);
  const showNotifications = openMenu === 'notifications';
  const handleSettingsOpenChange = useCallback(
    (open: boolean) => setOpenMenu((prev) => (open ? 'settings' : prev === 'settings' ? null : prev)),
    []
  );

  const filteredChannels = STREAM_CHANNELS.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const themeBadgeColor =
    brandTheme === 'violet'
      ? 'from-violet-600 to-cyan-500'
      : brandTheme === 'kick'
      ? 'from-emerald-500 to-lime-400'
      : 'from-rose-500 to-amber-500';

  return (
    <header className="sticky top-0 z-50 h-16 w-full bg-[#121218]/90 backdrop-blur-xl border-b border-white/8 px-4 lg:px-6 flex items-center justify-between gap-3">
      {/* Left: Brand Logo & Primary Navigation */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 group focus:outline-none cursor-pointer"
        >
          <div
            className={`w-9 h-9 rounded-xl bg-gradient-to-br ${themeBadgeColor} flex items-center justify-center shadow-lg transition-transform group-hover:scale-105`}
          >
            <Radio className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-white">
                PULSE<span className="font-light opacity-85">LIVE</span>
              </span>
              <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                PRO
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 -mt-1 hidden sm:inline">
              Interactive Stream Platform
            </span>
          </div>
        </button>
      </div>

      {/* Center: Live Search Bar with Instant Suggestions */}
      <div className="relative flex-1 max-w-md hidden sm:block">
        <div
          className={`flex items-center bg-[#1A1A24] border rounded-xl px-3.5 py-2 transition-all ${
            searchFocused ? 'border-white/30 ring-2 ring-white/10' : 'border-white/8'
          }`}
        >
          <Search className="w-4 h-4 text-zinc-400 mr-2.5 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 180)}
            placeholder="Tìm streamer, giải đấu VALORANT, phòng PK, sản phẩm..."
            className="w-full bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[11px] text-zinc-400 hover:text-white ml-2"
            >
              Xóa
            </button>
          )}
        </div>

        {/* Dropdown Search Results */}
        {searchFocused && (
          <div className="absolute left-0 right-0 mt-2 bg-[#181822] border border-white/12 rounded-2xl shadow-2xl p-3 z-50">
            <div className="flex items-center justify-between px-2 pb-2 border-b border-white/8">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                Luồng Đang Phát Nổi Bật
              </span>
              <span className="text-[11px] text-zinc-500">{filteredChannels.length} kết quả</span>
            </div>
            <div className="mt-2 space-y-1 max-h-64 overflow-y-auto">
              {filteredChannels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => {
                    onSelectChannel(channel);
                    setActiveTab('watch');
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white/6 transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={channel.avatar}
                      alt={channel.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-red-500"
                    />
                    <div className="truncate">
                      <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                        <span>{channel.name}</span>
                        {channel.mode === 'pk' && (
                          <span className="px-1.5 py-0.2 bg-pink-500/20 text-pink-300 rounded text-[10px] flex items-center gap-0.5">
                            <Swords className="w-2.5 h-2.5" /> PK
                          </span>
                        )}
                        {channel.mode === 'commerce' && (
                          <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded text-[10px] flex items-center gap-0.5">
                            <ShoppingBag className="w-2.5 h-2.5" /> SHOP
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 truncate">{channel.category}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-red-400 tabular-nums shrink-0 ml-2">
                    ● {(channel.viewers / 1000).toFixed(1)}K
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right: Wallet, Notifications, Settings, Account */}
      <div className="flex items-center gap-2.5">
        {/* Wallet / Coins Balance */}
        <button
          onClick={() => setActiveTab('wallet')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-bold text-amber-300 tabular-nums">
            {coins.toLocaleString('vi-VN')} Xu
          </span>
          <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded-md">
            + Nạp
          </span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setOpenMenu(showNotifications ? null : 'notifications')}
            className="relative p-2 rounded-xl bg-[#1A1A24] hover:bg-white/10 border border-white/8 text-zinc-300 cursor-pointer"
            title="Thông báo"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
              3
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#181822] border border-white/12 rounded-2xl shadow-2xl p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-white/8">
                <span className="text-xs font-bold text-white">Thông báo mới</span>
                <button
                  onClick={() => setOpenMenu(null)}
                  className="text-[11px] text-zinc-400 hover:text-white"
                >
                  Đóng
                </button>
              </div>
              <div className="mt-2 space-y-2 text-xs">
                <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-white font-medium">🔴 Độ Mixi vừa bắt đầu phát trực tiếp!</p>
                  <p className="text-zinc-400 text-[11px] mt-0.5">2 phút trước • 48.5K người đang xem</p>
                </div>
                <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-white font-medium">⚔️ Linh Ka đang bước vào trận PK quyết định</p>
                  <p className="text-zinc-400 text-[11px] mt-0.5">12 phút trước • Nhân đôi điểm quà tặng</p>
                </div>
                <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-white font-medium">
                    🛒 Giỏ hàng Live của bạn có {cartCount} sản phẩm đang giảm giá
                  </p>
                  <p className="text-zinc-400 text-[11px] mt-0.5">Flash Sale kết thúc sau 15 phút</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Settings: theme + language */}
        <SettingsMenu
          open={openMenu === 'settings'}
          onOpenChange={handleSettingsOpenChange}
          brandTheme={brandTheme}
          setBrandTheme={setBrandTheme}
          language={language}
          setLanguage={setLanguage}
        />

        {/* User Avatar */}
        <button
          onClick={() => setActiveTab('account')}
          className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'account'
              ? 'border-(--brand-light) ring-2 ring-(--brand-soft)'
              : 'border-white/15 hover:border-white/40'
          }`}
          title="Trung tâm cá nhân"
          aria-current={activeTab === 'account' ? 'page' : undefined}
        >
          <img src={userAvatar} alt="Trung tâm cá nhân" className="w-full h-full object-cover" />
        </button>
      </div>
    </header>
  );
};
