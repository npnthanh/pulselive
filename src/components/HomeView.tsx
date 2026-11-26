import React, { useState } from 'react';
import {
  Play,
  Users,
  Sparkles,
  Flame,
  Swords,
  ShoppingBag,
  CheckCircle2,
  ChevronRight,
  Radio,
  Volume2,
  VolumeX,
  Trophy,
  Compass,
} from 'lucide-react';
import {
  STREAM_CHANNELS,
  CATEGORIES,
  type StreamChannel,
} from '../data/mockData';
import type { ActiveTab, BrandTheme } from './Navbar';
import { AnimatedArrow } from './AnimatedArrow';

interface HomeViewProps {
  onSelectChannel: (channel: StreamChannel) => void;
  setActiveTab: (tab: ActiveTab) => void;
  brandTheme: BrandTheme;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectChannel,
  setActiveTab,
  brandTheme,
}) => {
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [mutedPreview, setMutedPreview] = useState(true);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  const featuredChannel = STREAM_CHANNELS[featuredIndex];

  const filterOptions = [
    { id: 'all', label: '🔥 Tất cả đang Live' },
    { id: 'standard', label: '🎮 Gaming & Esports' },
    { id: 'pk', label: '⚔️ Idol & Đấu PK' },
    { id: 'commerce', label: '🛒 Live Bán Hàng (Flash Sale)' },
    { id: 'talkshow', label: '💬 Talkshow & IRL' },
  ];

  const filteredStreams = STREAM_CHANNELS.filter((channel) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'pk') return channel.mode === 'pk';
    if (selectedFilter === 'commerce') return channel.mode === 'commerce';
    if (selectedFilter === 'talkshow')
      return channel.categorySlug === 'talkshow' || channel.categorySlug === 'irl';
    return channel.mode === 'standard';
  });

  const accentGradient =
    brandTheme === 'violet'
      ? 'from-violet-600 to-cyan-500'
      : brandTheme === 'kick'
      ? 'from-emerald-500 to-lime-500'
      : 'from-rose-600 to-amber-500';

  return (
    <div className="flex-1 min-w-0 overflow-y-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 sm:space-y-8">
      {/* 1. HERO FEATURED CAROUSEL (Twitch/Kick 3D Spotlight Style) */}
      <section className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-[#15151E] shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 sm:min-h-[380px]">
          {/* Left/Main Video Preview Area */}
          <div className="lg:col-span-8 relative group overflow-hidden bg-black flex flex-col justify-between p-4 sm:p-6">
            <img
              src={featuredChannel.thumbnail}
              alt={featuredChannel.title}
              className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E12] via-[#0E0E12]/35 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0E0E12]/70 via-transparent to-[#15151E]" />

            {/* Top Bar inside Hero */}
            <div className="relative z-10 flex items-start justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 min-w-0">
                <span className="px-2 sm:px-2.5 py-1 rounded-lg bg-red-600 text-white text-[11px] sm:text-xs font-extrabold tracking-wider flex items-center gap-1.5 shadow-lg live-pulse whitespace-nowrap">
                  <span className="w-2 h-2 rounded-full bg-white" />
                  TRỰC TIẾP
                </span>
                <span className="px-2 sm:px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 border border-white/10 tabular-nums whitespace-nowrap">
                  <Users className="w-3.5 h-3.5 text-red-400" />
                  {featuredChannel.viewers.toLocaleString('vi-VN')}
                  <span className="hidden sm:inline">người đang xem</span>
                  <span className="sm:hidden">đang xem</span>
                </span>
                {featuredChannel.mode === 'pk' && (
                  <span className="px-2 sm:px-2.5 py-1 rounded-lg bg-pink-600/80 backdrop-blur-md text-white text-[11px] sm:text-xs font-bold flex items-center gap-1 whitespace-nowrap">
                    <Swords className="w-3.5 h-3.5" /> ĐẤU PK ĐÔI
                  </span>
                )}
                {featuredChannel.mode === 'commerce' && (
                  <span className="px-2 sm:px-2.5 py-1 rounded-lg bg-amber-500/90 text-slate-950 text-[11px] sm:text-xs font-extrabold flex items-center gap-1 whitespace-nowrap">
                    <ShoppingBag className="w-3.5 h-3.5" /> FLASH SALE -45%
                  </span>
                )}
              </div>

              <button
                onClick={() => setMutedPreview(!mutedPreview)}
                className="p-2 sm:p-2.5 rounded-xl bg-black/60 hover:bg-black/80 text-white border border-white/15 backdrop-blur-md transition-colors cursor-pointer shrink-0"
                title={mutedPreview ? 'Bật âm thanh xem trước' : 'Tắt âm thanh'}
              >
                {mutedPreview ? (
                  <VolumeX className="w-4 h-4 text-zinc-300" />
                ) : (
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                )}
              </button>
            </div>

            {/* Bottom Stream Info inside Hero */}
            <div className="relative z-10 mt-20 sm:mt-28 max-w-2xl space-y-2.5 sm:space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={featuredChannel.avatar}
                  alt={featuredChannel.name}
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl object-cover ring-2 ring-red-500 shadow-lg shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <h2 className="text-base sm:text-lg font-extrabold text-white truncate">
                      {featuredChannel.name}
                    </h2>
                    {featuredChannel.verified && (
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    )}
                    <span className="text-xs text-zinc-400 font-medium ml-1 truncate">
                      • {featuredChannel.category}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {featuredChannel.tags.map((tag, i) => (
                      <span
                        key={tag}
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-md bg-white/10 text-zinc-200 backdrop-blur-sm ${
                          i >= 2 ? 'hidden sm:inline' : ''
                        }`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <h1 className="text-lg sm:text-2xl font-extrabold text-white leading-snug line-clamp-2">
                {featuredChannel.title}
              </h1>

              <div className="pt-1 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    onSelectChannel(featuredChannel);
                    setActiveTab('watch');
                  }}
                  className={`w-full sm:w-auto justify-center px-5 py-3 sm:py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r ${accentGradient} shadow-lg hover:scale-[1.02] transition-all flex items-center gap-2 cursor-pointer`}
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Vào Phòng Live Ngay</span>
                </button>
                <span className="hidden sm:inline text-xs text-zinc-400 tabular-nums">
                  Chất lượng: <strong className="text-zinc-200">1080p60 Source</strong> • Bitrate:{' '}
                  <strong className="text-zinc-200">{featuredChannel.bitrate}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Spotlight Stream Switcher Cards */}
          <div className="lg:col-span-4 bg-[#14141D] p-3 sm:p-4 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/8">
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-extrabold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Tâm Điểm Đang Phát Sóng
                </span>
                <span className="text-[11px] text-zinc-500">
                  {featuredIndex + 1}/{STREAM_CHANNELS.length}
                </span>
              </div>

              <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory scroll-px-3 sm:scroll-px-0 no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0 sm:block sm:space-y-2 sm:overflow-visible">
                {STREAM_CHANNELS.slice(0, 4).map((channel, idx) => {
                  const active = idx === featuredIndex;
                  return (
                    <button
                      key={channel.id}
                      onClick={() => setFeaturedIndex(idx)}
                      className={`w-[80%] shrink-0 snap-start sm:w-full flex items-center gap-3 p-2.5 rounded-2xl transition-all text-left cursor-pointer border ${
                        active
                          ? 'bg-white/10 border-white/20 shadow-md'
                          : 'bg-white/[0.02] border-transparent hover:bg-white/5'
                      }`}
                    >
                      <div className="relative w-20 h-12 rounded-xl overflow-hidden shrink-0">
                        <img
                          src={channel.thumbnail}
                          alt={channel.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-1 left-1 px-1.5 py-0.2 rounded bg-red-600 text-[9px] font-bold text-white">
                          LIVE
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-white truncate">
                            {channel.name}
                          </span>
                          <span className="text-[11px] font-semibold text-red-400 tabular-nums shrink-0">
                            {(channel.viewers / 1000).toFixed(1)}K
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                          {channel.title}
                        </p>
                        <span className="block text-[10px] text-zinc-500 truncate">{channel.category}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Mode Highlights Box */}
            <div className="hidden sm:flex mt-4 pt-3 border-t border-white/8 items-center justify-between text-xs text-zinc-400 px-1">
              <span className="flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                Hỗ trợ 3 chế độ: Chuẩn, PK & Live Shop
              </span>
              <button
                onClick={() => {
                  onSelectChannel(featuredChannel);
                  setActiveTab('watch');
                }}
                className="group inline-flex items-center gap-1.5 pl-3 pr-2.5 py-1 rounded-lg text-white font-semibold hover:bg-white/8 transition-colors cursor-pointer"
              >
                Trải nghiệm
                <AnimatedArrow />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FILTER PILLS & LIVE CHANNELS GRID */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span>Kênh Trực Tiếp Đề Xuất</span>
            </h2>
            <p className="text-xs text-zinc-400">
              <span className="sm:hidden">Chạm vào thẻ để vào phòng tương tác</span>
              <span className="hidden sm:inline">
                Rê chuột vào thẻ video để xem trước luồng phát trực tiếp • Click để vào phòng tương tác
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-3 px-3 sm:mx-0 sm:px-0">
            {filterOptions.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedFilter(item.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                  selectedFilter === item.id
                    ? 'bg-white text-slate-950 border-white shadow'
                    : 'bg-[#181822] text-zinc-300 border-white/8 hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stream Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {filteredStreams.map((channel) => {
            const isHovered = hoveredCardId === channel.id;
            return (
              <div
                key={channel.id}
                onMouseEnter={() => setHoveredCardId(channel.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                onClick={() => {
                  onSelectChannel(channel);
                  setActiveTab('watch');
                }}
                className="group bg-[#15151E] border border-white/8 hover:border-white/25 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer flex flex-col"
              >
                {/* 16:9 Thumbnail Container */}
                <div className="relative aspect-video bg-black overflow-hidden">
                  <img
                    src={channel.thumbnail}
                    alt={channel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-extrabold tracking-wider flex items-center gap-1 shadow">
                      <Radio className="w-3 h-3" /> LIVE
                    </span>
                    {channel.mode === 'pk' && (
                      <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-pink-600 to-purple-600 text-white text-[10px] font-extrabold flex items-center gap-1 shadow">
                        <Swords className="w-3 h-3" /> ĐẤU PK
                      </span>
                    )}
                    {channel.mode === 'commerce' && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[10px] font-extrabold flex items-center gap-1 shadow">
                        <ShoppingBag className="w-3 h-3" /> LIVE SHOP
                      </span>
                    )}
                  </div>

                  {/* Top Right Quality/FPS */}
                  <span className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 px-2 py-0.5 rounded-md bg-black/65 backdrop-blur-md text-[10px] font-semibold text-zinc-200 border border-white/10">
                    1080p60
                  </span>

                  {/* Bottom Left Viewer Count */}
                  <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-[11px] sm:text-xs font-bold text-white tabular-nums border border-white/10">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    {channel.viewers.toLocaleString('vi-VN')} người xem
                  </div>

                  {/* Bottom Right Duration */}
                  <span className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 px-2 py-0.5 rounded bg-black/70 text-[11px] text-zinc-300 tabular-nums">
                    {channel.duration}
                  </span>

                  {/* Hover Auto-Preview Simulation Indicator */}
                  {isHovered && (
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] flex items-center justify-center transition-opacity">
                      <div className="px-4 py-2 rounded-xl bg-white/95 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-xl">
                        <Play className="w-4 h-4 fill-slate-950" />
                        <span>Bấm để vào phòng Live</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Metadata */}
                <div className="p-3 sm:p-4 flex gap-3 flex-1">
                  <img
                    src={channel.avatar}
                    alt={channel.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white/15 shrink-0 mt-0.5"
                  />
                  <div className="min-w-0 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors line-clamp-2 leading-snug">
                        {channel.title}
                      </h3>
                      <div className="flex items-center gap-1 mt-1.5 min-w-0">
                        <span className="text-xs font-semibold text-zinc-300 truncate shrink-0 max-w-[60%]">
                          {channel.name}
                        </span>
                        {channel.verified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        )}
                        <span className="text-xs text-zinc-500 truncate">• {channel.category}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-2.5 sm:mt-3">
                      {channel.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/6 text-zinc-300 border border-white/5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. TOP CATEGORIES SHELF (3:4 Poster Cards) */}
      <section className="space-y-4 pt-2">
        <div className="flex items-start sm:items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-cyan-400" />
              <span>Danh Mục Khám Phá Hàng Đầu</span>
            </h2>
            <p className="hidden sm:block text-xs text-zinc-400">
              Phân loại nội dung theo xu hướng giải trí, thể thao điện tử và mua sắm trực tiếp
            </p>
          </div>
          <button
            onClick={() => setSelectedFilter('all')}
            className="text-xs font-bold text-zinc-300 hover:text-white flex items-center gap-1 cursor-pointer shrink-0 whitespace-nowrap"
          >
            Xem tất cả <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-px-3 sm:scroll-px-0 no-scrollbar -mx-3 px-3 pb-1 sm:mx-0 sm:px-0 sm:pb-0 sm:overflow-visible sm:grid sm:grid-cols-3 lg:grid-cols-6 sm:gap-4">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                setSelectedFilter(cat.slug === 'idol-pk' ? 'pk' : cat.slug === 'commerce' ? 'commerce' : 'all');
                window.scrollTo({ top: 350, behavior: 'smooth' });
              }}
              className="group w-36 shrink-0 snap-start sm:w-auto bg-[#15151E] border border-white/8 hover:border-white/25 rounded-2xl overflow-hidden transition-all hover:-translate-y-1 cursor-pointer"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={cat.cover}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E12] via-transparent to-transparent" />
                {cat.badge && (
                  <span
                    className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-gradient-to-r ${cat.accent} text-white text-[10px] font-extrabold shadow`}
                  >
                    {cat.badge}
                  </span>
                )}
                <div className="absolute bottom-2.5 left-2.5 right-2.5">
                  <h3 className="text-xs font-extrabold text-white line-clamp-2 sm:line-clamp-1 leading-snug">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-zinc-300 font-semibold tabular-nums flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    {cat.viewers} người xem
                  </p>
                </div>
              </div>
              <div className="p-2 sm:p-2.5 flex flex-wrap gap-1">
                {cat.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-zinc-400 font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
