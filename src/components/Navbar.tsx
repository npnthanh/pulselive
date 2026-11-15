import React, { useState } from 'react';
import {
  Radio,
  Search,
  Compass,
  PlaySquare,
  Video,
  UserCheck,
  Bell,
  Sparkles,
  Palette,
  Flame,
  ShoppingBag,
  Swords,
} from 'lucide-react';
import { STREAM_CHANNELS, type StreamChannel } from '../data/mockData';

export type ActiveTab = 'home' | 'watch' | 'studio' | 'channel' | 'wallet';
export type BrandTheme = 'violet' | 'kick' | 'coral';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  brandTheme: BrandTheme;
  setBrandTheme: (theme: BrandTheme) => void;
  coins: number;
  onSelectChannel: (channel: StreamChannel) => void;
  cartCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  brandTheme,
  setBrandTheme,
  coins,
  onSelectChannel,
  cartCount,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

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

  const activeBtnStyle =
    brandTheme === 'violet'
      ? 'bg-violet-500/15 text-violet-300 border-violet-500/40'
      : brandTheme === 'kick'
      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
      : 'bg-rose-500/15 text-rose-300 border-rose-500/40';

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

        <nav className="hidden md:flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
              activeTab === 'home'
                ? activeBtnStyle
                : 'border-transparent text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Khám phá</span>
          </button>

          <button
            onClick={() => setActiveTab('watch')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
              activeTab === 'watch'
                ? activeBtnStyle
                : 'border-transparent text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <PlaySquare className="w-4 h-4" />
            <span>Phòng Xem Live</span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          </button>

          <button
            onClick={() => setActiveTab('studio')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
              activeTab === 'studio'
                ? activeBtnStyle
                : 'border-transparent text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Creator Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('channel')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
              activeTab === 'channel'
                ? activeBtnStyle
                : 'border-transparent text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Kênh Cá Nhân</span>
          </button>
        </nav>
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

      {/* Right: Theme Switcher, Wallet, Notifications, Go Live CTA */}
      <div className="flex items-center gap-2.5">
        {/* Brand Accent Theme Switcher */}
        <div className="hidden xl:flex items-center gap-1 bg-[#1A1A24] border border-white/8 rounded-xl p-1">
          <span className="text-[11px] text-zinc-400 px-2 flex items-center gap-1">
            <Palette className="w-3.5 h-3.5" /> Theme:
          </span>
          <button
            onClick={() => setBrandTheme('violet')}
            title="Phong cách Twitch (Electric Violet)"
            className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              brandTheme === 'violet'
                ? 'bg-violet-600 text-white shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-violet-400" />
            Tím Neon
          </button>
          <button
            onClick={() => setBrandTheme('kick')}
            title="Phong cách Kick (Cyber Green)"
            className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              brandTheme === 'kick'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Xanh Kick
          </button>
          <button
            onClick={() => setBrandTheme('coral')}
            title="Phong cách TikTok/YouTube (Coral Red)"
            className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              brandTheme === 'coral'
                ? 'bg-rose-600 text-white shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            Đỏ Coral
          </button>
        </div>

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
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-[#1A1A24] hover:bg-white/10 border border-white/8 text-zinc-300 cursor-pointer"
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
                  onClick={() => setShowNotifications(false)}
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

        {/* Go Live Button */}
        <button
          onClick={() => setActiveTab('studio')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r ${themeBadgeColor} shadow-lg hover:opacity-95 transition-all flex items-center gap-1.5 cursor-pointer`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Phát Trực Tiếp</span>
        </button>

        {/* User Avatar */}
        <button
          onClick={() => setActiveTab('channel')}
          className="w-9 h-9 rounded-xl overflow-hidden border-2 border-white/15 hover:border-white/40 transition-all cursor-pointer shrink-0"
          title="Kênh cá nhân của bạn"
        >
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80"
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
        </button>
      </div>
    </header>
  );
};
