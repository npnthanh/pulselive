import React, { useState } from 'react';
import {
  CheckCircle2,
  Heart,
  Star,
  Play,
  Calendar,
  Film,
  Scissors,
  Info,
  Users,
  Clock,
  Cpu,
  ExternalLink,
} from 'lucide-react';
import type { StreamChannel } from '../data/mockData';
import type { ActiveTab, BrandTheme } from './Navbar';

interface ChannelProfileViewProps {
  channel: StreamChannel;
  followedIds: string[];
  toggleFollow: (id: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
  brandTheme: BrandTheme;
}

export const ChannelProfileView: React.FC<ChannelProfileViewProps> = ({
  channel,
  followedIds,
  toggleFollow,
  setActiveTab,
  brandTheme,
}) => {
  const [subTab, setSubTab] = useState<'vods' | 'clips' | 'schedule' | 'about'>('vods');
  const isFollowed = followedIds.includes(channel.id);

  const vods = [
    {
      id: 'vod-1',
      title: 'Full Buổi Live: Giải Đấu Ao Làng Mở Rộng — Chung Kết Cực Căng 🔥',
      views: '342K lượt xem',
      date: 'Hôm qua',
      duration: '04:12:30',
      thumb: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'vod-2',
      title: 'Tâm Sự Đêm Khuya & Reaction MV Mới Cùng Anh Em Bộ Tộc',
      views: '289K lượt xem',
      date: '3 ngày trước',
      duration: '03:45:10',
      thumb: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'vod-3',
      title: 'Đêm Nhạc Acoustic Giao Lưu & PK Cùng Khách Mời Đặc Biệt',
      views: '195K lượt xem',
      date: '5 ngày trước',
      duration: '02:50:00',
      thumb: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80',
    },
  ];

  const clips = [
    {
      id: 'clip-1',
      title: 'Pha Clutch 1v5 Không Tưởng Khiến Cả Phòng Chat Nổ Tung!',
      views: '89.5K',
      duration: '0:32',
      creator: 'Cắt bởi MinhKhang99',
      thumb: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'clip-2',
      title: 'Khoảnh Khắc Đại Gia HoangTuan_VIP Thả 99 Quả Tên Lửa Liên Tiếp 🚀',
      views: '124.2K',
      duration: '0:28',
      creator: 'Cắt bởi Mod_ThanhHa',
      thumb: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'clip-3',
      title: 'Unbox Bàn Phím Custom Độc Nhất Vô Nhị Giá 25 Củ',
      views: '54.1K',
      duration: '0:45',
      creator: 'Cắt bởi KienPT_Dev',
      thumb: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80',
    },
  ];

  const scheduleList = [
    { day: 'Thứ Hai', time: '21:30 - 00:30', title: 'Talkshow Giao Lưu Độc Giả & Điểm Tin Công Nghệ', tag: 'Just Chatting' },
    { day: 'Thứ Tư', time: '21:00 - 01:00', title: 'Leo Rank Thách Đấu VALORANT Cùng Đội Tuyển', tag: 'Gaming FPS' },
    { day: 'Thứ Sáu', time: '20:30 - 23:30', title: 'Đại Chiến PK Âm Nhạc & Tặng Quà X2 Điểm', tag: 'Idol & PK' },
    { day: 'Chủ Nhật', time: '19:30 - 23:00', title: 'Giải Đấu Cộng Đồng Cuối Tuần (Custom Room)', tag: 'Sự Kiện Đặc Biệt' },
  ];

  const brandBg =
    brandTheme === 'violet'
      ? 'bg-violet-600 hover:bg-violet-500'
      : brandTheme === 'kick'
      ? 'bg-emerald-600 hover:bg-emerald-500'
      : 'bg-rose-600 hover:bg-rose-500';

  return (
    <div className="flex-1 overflow-y-auto bg-[#0E0E12] pb-12">
      {/* Channel Cover Banner */}
      <div className="relative h-56 sm:h-72 w-full overflow-hidden">
        <img
          src={channel.thumbnail}
          alt={channel.name}
          className="w-full h-full object-cover opacity-65"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E12] via-[#0E0E12]/50 to-transparent" />

        {/* Live Status Floating Pill on Banner */}
        <div className="absolute top-5 right-6 flex items-center gap-3">
          <button
            onClick={() => setActiveTab('watch')}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-extrabold shadow-xl flex items-center gap-2 cursor-pointer live-pulse"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>ĐANG PHÁT TRỰC TIẾP ({channel.viewers.toLocaleString('vi-VN')} người xem) — Vào Xem</span>
          </button>
        </div>
      </div>

      {/* Streamer Profile Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-16 relative z-10 space-y-6">
        <div className="p-5 rounded-3xl bg-[#15151F]/95 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={channel.avatar}
                alt={channel.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-red-500 shadow-xl"
              />
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-red-600 text-[10px] font-black text-white">
                LIVE
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                  {channel.name}
                </h1>
                {channel.verified && <CheckCircle2 className="w-5 h-5 text-cyan-400" />}
              </div>
              <p className="text-xs text-zinc-400 font-medium mt-0.5">
                {channel.handle} • <strong className="text-white">{channel.followers}</strong> người theo dõi
              </p>
              <p className="text-xs text-zinc-300 mt-2 max-w-xl line-clamp-2">
                {channel.bio}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => toggleFollow(channel.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 cursor-pointer ${
                isFollowed
                  ? 'bg-white/10 text-white border border-white/15'
                  : `${brandBg} text-white shadow-lg`
              }`}
            >
              <Heart className={`w-4 h-4 ${isFollowed ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{isFollowed ? 'Đang Theo Dõi' : 'Theo Dõi Kênh'}</span>
            </button>

            <button
              onClick={() => setActiveTab('wallet')}
              className="px-4 py-2.5 rounded-xl text-xs font-extrabold bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center gap-1.5 shadow-lg cursor-pointer"
            >
              <Star className="w-4 h-4 fill-slate-950" />
              <span>Đăng Ký Hội Viên</span>
            </button>
          </div>
        </div>

        {/* Sub-navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto">
          <button
            onClick={() => setSubTab('vods')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 cursor-pointer transition-all ${
              subTab === 'vods'
                ? 'bg-white text-slate-950 shadow'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Video Phát Lại (VODs)</span>
          </button>

          <button
            onClick={() => setSubTab('clips')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 cursor-pointer transition-all ${
              subTab === 'clips'
                ? 'bg-white text-slate-950 shadow'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Scissors className="w-4 h-4" />
            <span>Clips Ngắn Nổi Bật</span>
          </button>

          <button
            onClick={() => setSubTab('schedule')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 cursor-pointer transition-all ${
              subTab === 'schedule'
                ? 'bg-white text-slate-950 shadow'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Lịch Phát Sóng</span>
          </button>

          <button
            onClick={() => setSubTab('about')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 cursor-pointer transition-all ${
              subTab === 'about'
                ? 'bg-white text-slate-950 shadow'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>Giới Thiệu & Cấu Hình PC</span>
          </button>
        </div>

        {/* TAB CONTENT */}
        {subTab === 'vods' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {vods.map((vod) => (
              <div
                key={vod.id}
                onClick={() => setActiveTab('watch')}
                className="group bg-[#15151E] border border-white/8 hover:border-white/25 rounded-2xl overflow-hidden cursor-pointer transition-all hover:-translate-y-1"
              >
                <div className="relative aspect-video">
                  <img src={vod.thumb} alt={vod.title} className="w-full h-full object-cover" />
                  <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/80 text-[11px] font-bold text-white tabular-nums">
                    {vod.duration}
                  </span>
                </div>
                <div className="p-4 space-y-1.5">
                  <h3 className="text-sm font-bold text-white group-hover:text-violet-300 line-clamp-2">
                    {vod.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>{vod.views}</span>
                    <span>{vod.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {subTab === 'clips' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {clips.map((clip) => (
              <div
                key={clip.id}
                onClick={() => setActiveTab('watch')}
                className="group bg-[#15151E] border border-white/8 hover:border-white/25 rounded-2xl overflow-hidden cursor-pointer transition-all hover:-translate-y-1"
              >
                <div className="relative aspect-video">
                  <img src={clip.thumb} alt={clip.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-violet-600 text-[10px] font-extrabold text-white">
                    CLIP HOT
                  </span>
                  <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/80 text-[11px] font-bold text-white tabular-nums">
                    {clip.duration}
                  </span>
                </div>
                <div className="p-4 space-y-1.5">
                  <h3 className="text-sm font-bold text-white line-clamp-2">{clip.title}</h3>
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>{clip.creator}</span>
                    <span className="text-amber-400 font-bold">{clip.views} lượt xem</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {subTab === 'schedule' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scheduleList.map((item) => (
              <div
                key={item.day}
                className="p-4 rounded-2xl bg-[#15151E] border border-white/10 flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-violet-500/20 text-violet-300 text-xs font-extrabold">
                      {item.day}
                    </span>
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 tabular-nums">
                      <Clock className="w-3.5 h-3.5" /> {item.time}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white pt-1">{item.title}</h4>
                  <span className="text-[11px] text-zinc-400">{item.tag}</span>
                </div>
                <button
                  onClick={() => setActiveTab('watch')}
                  className="px-3 py-1.5 rounded-xl bg-white/8 hover:bg-white/15 text-xs font-bold text-white shrink-0 cursor-pointer"
                >
                  Nhắc hẹn
                </button>
              </div>
            ))}
          </div>
        )}

        {subTab === 'about' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 rounded-2xl bg-[#15151E] border border-white/10 space-y-3">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Cấu Hình Dàn Máy Livestream (PC Specs)</span>
              </h3>
              <ul className="text-xs text-zinc-300 space-y-2">
                <li>• <strong>CPU:</strong> AMD Ryzen 9 9950X 16-Core</li>
                <li>• <strong>GPU:</strong> NVIDIA GeForce RTX 5090 32GB GDDR7</li>
                <li>• <strong>RAM:</strong> 64GB DDR5 6400MHz RGB</li>
                <li>• <strong>Camera:</strong> Sony Alpha A7S III + Lens 24mm f/1.4 GM</li>
                <li>• <strong>Micro:</strong> Shure SM7dB + GoXLR Mixer</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-[#15151E] border border-white/10 space-y-3">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                <span>Liên Kết Mạng Xã Hội & Cộng Đồng</span>
              </h3>
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                {['Discord Cộng Đồng (120K)', 'YouTube Official', 'TikTok Highlight', 'Facebook Fanpage'].map(
                  (social) => (
                    <div
                      key={social}
                      className="p-3 rounded-xl bg-white/5 border border-white/8 flex items-center justify-between text-zinc-200 font-semibold"
                    >
                      <span>{social}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
