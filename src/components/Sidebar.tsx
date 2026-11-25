import React from 'react';
import {
  PanelLeftClose,
  PanelLeftOpen,
  Heart,
  Sparkles,
  Swords,
  ShoppingBag,
  CheckCircle2,
  Flame,
} from 'lucide-react';
import { STREAM_CHANNELS, type StreamChannel } from '../data/mockData';
import type { ActiveTab } from './Navbar';
import { AnimatedArrow } from './AnimatedArrow';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  selectedChannel: StreamChannel;
  onSelectChannel: (channel: StreamChannel) => void;
  setActiveTab: (tab: ActiveTab) => void;
  followedIds: string[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  selectedChannel,
  onSelectChannel,
  setActiveTab,
  followedIds,
}) => {
  const followedChannels = STREAM_CHANNELS.filter((c) => followedIds.includes(c.id));
  const recommendedChannels = STREAM_CHANNELS.filter((c) => !followedIds.includes(c.id));

  return (
    <aside
      className={`hidden lg:flex flex-col shrink-0 bg-[#13131A] border-r border-white/8 select-none transition-all duration-300 h-[calc(100vh-4rem)] sticky top-16 ${
        collapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Header Toggle */}
      <div className="p-3.5 flex items-center justify-between border-b border-white/6">
        {!collapsed && (
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            Kênh Đang Theo Dõi
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-white/8 text-zinc-400 hover:text-white transition-colors mx-auto lg:mx-0 cursor-pointer"
          title={collapsed ? 'Mở rộng thanh bên' : 'Thu gọn thanh bên'}
        >
          {collapsed ? (
            <PanelLeftOpen className="w-4 h-4" />
          ) : (
            <PanelLeftClose className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Channels List */}
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-4">
        {/* Followed Group */}
        <div className="space-y-1">
          {followedChannels.map((channel) => {
            const isSelected = selectedChannel.id === channel.id;
            return (
              <button
                key={channel.id}
                onClick={() => {
                  onSelectChannel(channel);
                  setActiveTab('watch');
                }}
                title={`${channel.name} — ${channel.title}`}
                className={`w-full flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer group ${
                  isSelected
                    ? 'bg-white/10 border border-white/15 shadow-sm'
                    : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={channel.avatar}
                      alt={channel.name}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-red-500/80 group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-red-500 border-2 border-[#13131A]" />
                  </div>

                  {!collapsed && (
                    <div className="text-left truncate">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-white truncate">
                          {channel.name}
                        </span>
                        {channel.verified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 truncate">{channel.category}</p>
                    </div>
                  )}
                </div>

                {!collapsed && (
                  <div className="flex flex-col items-end shrink-0 ml-1">
                    <div className="flex items-center gap-1 text-xs font-semibold text-zinc-200 tabular-nums">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      {(channel.viewers / 1000).toFixed(1)}K
                    </div>
                    {channel.mode === 'pk' && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-pink-500/20 text-pink-300 flex items-center gap-0.5 mt-0.5">
                        <Swords className="w-2.5 h-2.5" /> PK
                      </span>
                    )}
                    {channel.mode === 'commerce' && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 flex items-center gap-0.5 mt-0.5">
                        <ShoppingBag className="w-2.5 h-2.5" /> SHOP
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Recommended Section */}
        <div className="pt-2 border-t border-white/6 space-y-1">
          {!collapsed && (
            <div className="px-2 pb-1.5 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Đề Xuất Cho Bạn
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold">LIVE</span>
            </div>
          )}

          {recommendedChannels.map((channel) => {
            const isSelected = selectedChannel.id === channel.id;
            return (
              <button
                key={channel.id}
                onClick={() => {
                  onSelectChannel(channel);
                  setActiveTab('watch');
                }}
                title={`${channel.name} — ${channel.title}`}
                className={`w-full flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer group ${
                  isSelected
                    ? 'bg-white/10 border border-white/15'
                    : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={channel.avatar}
                      alt={channel.name}
                      className="w-9 h-9 rounded-full object-cover ring-1 ring-white/20"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#13131A]" />
                  </div>

                  {!collapsed && (
                    <div className="text-left truncate">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-semibold text-zinc-200 truncate">
                          {channel.name}
                        </span>
                        {channel.verified && (
                          <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-500 truncate">{channel.category}</p>
                    </div>
                  )}
                </div>

                {!collapsed && (
                  <span className="text-xs font-medium text-zinc-400 tabular-nums shrink-0">
                    {(channel.viewers / 1000).toFixed(1)}K
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Event Banner */}
      {!collapsed && (
        <div className="p-3 m-2.5 rounded-2xl bg-gradient-to-br from-violet-600/20 via-fuchsia-600/15 to-amber-500/10 border border-white/10">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Flame className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Giải Đấu Streamer Cup</span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
            Bình chọn đội tuyển yêu thích & nhận rương quà Kim Cương miễn phí mỗi giờ!
          </p>
          <button
            onClick={() => setActiveTab('watch')}
            className="group mt-2.5 w-full py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
          >
            Vào Xem & Nhận Quà
            <AnimatedArrow />
          </button>
        </div>
      )}
    </aside>
  );
};
