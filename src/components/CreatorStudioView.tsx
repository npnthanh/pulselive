import React, { useState, useRef, useEffect } from 'react';
import {
  Video,
  Camera,
  Mic,
  MicOff,
  MonitorUp,
  Radio,
  Activity,
  Sparkles,
  Copy,
  Check,
  Eye,
  EyeOff,
  Scissors,
  BarChart3,
  Shield,
  BellRing,
  Layers,
  Users,
  Zap,
  RefreshCw,
} from 'lucide-react';
import type { BrandTheme } from './Navbar';

interface CreatorStudioViewProps {
  brandTheme: BrandTheme;
}

export const CreatorStudioView: React.FC<CreatorStudioViewProps> = ({ brandTheme }) => {
  const [isBroadcasting, setIsBroadcasting] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [camActive, setCamActive] = useState(false);
  const [sceneLayout, setSceneLayout] = useState<'pip' | 'fullcam' | 'dual'>('pip');
  const [streamTitle, setStreamTitle] = useState(
    'Giao lưu cuối tuần & Leo Rank Thách Đấu — Tặng quà hiện Alert trực tiếp! 🔥'
  );
  const [streamCategory, setStreamCategory] = useState('VALORANT & Talkshow');
  const [showKey, setShowKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [followersOnly, setFollowersOnly] = useState(true);
  const [slowMode, setSlowMode] = useState(false);
  const [testAlertBanner, setTestAlertBanner] = useState<string | null>(null);
  const [clipSuccess, setClipSuccess] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [activityEvents, setActivityEvents] = useState([
    {
      id: 'ev-1',
      type: 'gift',
      user: 'HoangTuan_VIP',
      detail: 'vừa tặng 🚀 Tên Lửa Vũ Trụ x10 (5,000 Xu)',
      time: 'Vừa xong',
      badge: '💎 GIFT',
      color: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
    },
    {
      id: 'ev-2',
      type: 'sub',
      user: 'MinhKhang99',
      detail: 'đã đăng ký Hội Viên VIP Tier 2 (Tháng thứ 6 liên tiếp)',
      time: '2 phút trước',
      badge: '⭐ SUB',
      color: 'text-violet-300 bg-violet-500/15 border-violet-500/30',
    },
    {
      id: 'ev-3',
      type: 'follow',
      user: 'BaoNgoc_Gaming',
      detail: 'đã bắt đầu theo dõi kênh của bạn',
      time: '4 phút trước',
      badge: '❤️ FOLLOW',
      color: 'text-rose-300 bg-rose-500/15 border-rose-500/30',
    },
    {
      id: 'ev-4',
      type: 'raid',
      user: 'Caster_HoangLuon',
      detail: 'đã dẫn 1,450 người xem sang Raid kênh của bạn!',
      time: '9 phút trước',
      badge: '⚡ RAID',
      color: 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30',
    },
  ]);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCamActive(true);
    } catch {
      // Fallback if no physical webcam is connected
      triggerOverlayAlert('Chế độ Giả lập Studio Camera đã bật (Không tìm thấy Webcam vật lý)');
    }
  };

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setCamActive(false);
  };

  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  const triggerOverlayAlert = (text: string) => {
    setTestAlertBanner(text);
    setTimeout(() => setTestAlertBanner(null), 3500);
  };

  const handleCopyStreamKey = () => {
    navigator.clipboard?.writeText('live_942b1950_pulselive_ultraLowLatencyKey2026');
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const accentBtn =
    brandTheme === 'violet'
      ? 'bg-violet-600 hover:bg-violet-500'
      : brandTheme === 'kick'
      ? 'bg-emerald-600 hover:bg-emerald-500'
      : 'bg-rose-600 hover:bg-rose-500';

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#0E0E12]">
      {/* Studio Top Status Bar */}
      <div className="p-4 rounded-2xl bg-[#15151F] border border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
              isBroadcasting
                ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                : 'bg-zinc-800 text-zinc-400'
            }`}
          >
            <Radio className={`w-6 h-6 ${isBroadcasting ? 'animate-pulse' : ''}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold text-white">
                Creator Studio & Stream Manager
              </h1>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                  isBroadcasting
                    ? 'bg-red-600 text-white'
                    : 'bg-zinc-700 text-zinc-300'
                }`}
              >
                {isBroadcasting ? '● ĐANG PHÁT SÓNG' : 'OFFLINE'}
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Quản lý luồng phát trực tiếp qua WebRTC Trình duyệt hoặc OBS Studio RTMP
            </p>
          </div>
        </div>

        {/* Live Telemetry Metrics */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-[#1C1C28] border border-white/8 text-xs">
            <span className="text-zinc-400 block text-[10px]">Người đang xem</span>
            <strong className="text-white font-extrabold tabular-nums flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-red-400" /> 14,820
            </strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-[#1C1C28] border border-white/8 text-xs">
            <span className="text-zinc-400 block text-[10px]">Bitrate / FPS</span>
            <strong className="text-emerald-400 font-extrabold tabular-nums">
              6,540 kbps • 60 FPS
            </strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-[#1C1C28] border border-white/8 text-xs">
            <span className="text-zinc-400 block text-[10px]">Doanh thu Phiên</span>
            <strong className="text-amber-400 font-extrabold tabular-nums">
              💎 42,600 Xu
            </strong>
          </div>

          <button
            onClick={() => setIsBroadcasting(!isBroadcasting)}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold text-white transition-all cursor-pointer shadow-lg ${
              isBroadcasting
                ? 'bg-zinc-700 hover:bg-red-600'
                : 'bg-red-600 hover:bg-red-500'
            }`}
          >
            {isBroadcasting ? 'Kết Thúc Phiên Live' : '🔴 Bắt Đầu Phát Sóng'}
          </button>
        </div>
      </div>

      {/* Main Modular Grid: Preview Stage (Left 7 cols) + Activity Feed & Quick Actions (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: WebRTC Broadcast Preview + Scene Switcher + Stream Info Config */}
        <div className="lg:col-span-7 space-y-5">
          <div className="rounded-2xl bg-[#15151E] border border-white/10 overflow-hidden">
            <div className="px-4 py-3 border-b border-white/8 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-violet-400" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-white">
                  Màn Hình Kiểm Tra Luồng Phát (Live Preview)
                </span>
              </div>

              {/* Scene Layout Selector */}
              <div className="flex items-center gap-1 bg-[#1D1D29] p-1 rounded-xl border border-white/8">
                <button
                  onClick={() => setSceneLayout('pip')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                    sceneLayout === 'pip'
                      ? 'bg-white text-slate-950'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Màn hình + Cam góc
                </button>
                <button
                  onClick={() => setSceneLayout('fullcam')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                    sceneLayout === 'fullcam'
                      ? 'bg-white text-slate-950'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Chỉ Camera
                </button>
                <button
                  onClick={() => setSceneLayout('dual')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                    sceneLayout === 'dual'
                      ? 'bg-white text-slate-950'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Khung Đôi Giao Lưu
                </button>
              </div>
            </div>

            {/* Canvas Stage */}
            <div className="relative aspect-video bg-black overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80"
                alt="Broadcast Scene"
                className={`w-full h-full object-cover transition-opacity ${
                  sceneLayout === 'fullcam' ? 'opacity-30 blur-sm' : 'opacity-85'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

              {/* Webcam PiP Overlay or Fullcam */}
              <div
                className={`overflow-hidden border-2 border-violet-400 shadow-2xl bg-zinc-900 transition-all duration-300 ${
                  sceneLayout === 'pip'
                    ? 'absolute bottom-4 right-4 w-44 sm:w-52 aspect-video rounded-2xl'
                    : sceneLayout === 'fullcam'
                    ? 'absolute inset-6 rounded-2xl'
                    : 'absolute inset-y-8 right-6 w-5/12 rounded-2xl'
                }`}
              >
                {camActive ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full relative">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80"
                      alt="Streamer Camera"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/75 text-[10px] font-bold text-emerald-300">
                      🎥 Camera Studio HD
                    </span>
                  </div>
                )}
              </div>

              {/* On-Screen Alert Box Simulation */}
              {testAlertBanner && (
                <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 px-5 py-3 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-amber-500 text-white shadow-2xl border border-white/30 flex items-center gap-3 animate-bounce">
                  <Sparkles className="w-5 h-5 text-yellow-300 shrink-0" />
                  <span className="text-xs sm:text-sm font-extrabold">{testAlertBanner}</span>
                </div>
              )}

              {/* Bottom WebRTC Hardware Controls Bar */}
              <div className="absolute bottom-3 left-4 flex items-center gap-2 z-20">
                <button
                  onClick={() => (camActive ? stopWebcam() : startWebcam())}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border cursor-pointer ${
                    camActive
                      ? 'bg-emerald-600 text-white border-emerald-400'
                      : 'bg-black/75 hover:bg-black text-white border-white/15'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{camActive ? 'Đang bật Webcam thật' : 'Bật Webcam Trình duyệt'}</span>
                </button>

                <button
                  onClick={() => setMicEnabled(!micEnabled)}
                  className={`p-2 rounded-xl border text-xs font-bold cursor-pointer ${
                    micEnabled
                      ? 'bg-black/75 text-emerald-400 border-white/15'
                      : 'bg-red-600/90 text-white border-red-400'
                  }`}
                  title={micEnabled ? 'Tắt Micro' : 'Bật Micro'}
                >
                  {micEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>

                <button
                  onClick={() =>
                    triggerOverlayAlert('🖥️ Đã kích hoạt luồng Chia sẻ màn hình (Screen Share 60FPS)')
                  }
                  className="px-3 py-1.5 rounded-xl bg-black/75 hover:bg-black text-white border border-white/15 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <MonitorUp className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">Chia sẻ màn hình</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stream Metadata & OBS RTMP Config */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#15151E] border border-white/10 space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-violet-400" />
                Thông Tin Phiên Phát Sóng
              </h3>
              <div>
                <label className="text-[11px] text-zinc-400 font-semibold block mb-1">
                  Tiêu đề buổi phát trực tiếp
                </label>
                <input
                  type="text"
                  value={streamTitle}
                  onChange={(e) => setStreamTitle(e.target.value)}
                  className="w-full bg-[#1D1D28] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30"
                />
              </div>
              <div>
                <label className="text-[11px] text-zinc-400 font-semibold block mb-1">
                  Danh mục (Category)
                </label>
                <input
                  type="text"
                  value={streamCategory}
                  onChange={(e) => setStreamCategory(e.target.value)}
                  className="w-full bg-[#1D1D28] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30"
                />
              </div>
              <button
                onClick={() => triggerOverlayAlert('✅ Đã cập nhật tiêu đề và danh mục luồng phát!')}
                className={`w-full py-2 rounded-xl text-xs font-bold text-white ${accentBtn} cursor-pointer`}
              >
                Lưu Thay Đổi
              </button>
            </div>

            {/* OBS RTMP Key Card */}
            <div className="p-4 rounded-2xl bg-[#15151E] border border-white/10 space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                Cấu Hình OBS Studio (RTMP / SRT)
              </h3>
              <div>
                <label className="text-[11px] text-zinc-400 font-semibold block mb-1">
                  Máy chủ Ingest (RTMP URL)
                </label>
                <input
                  type="text"
                  readOnly
                  value="rtmp://ingest-vn.pulselive.tv/live"
                  className="w-full bg-[#1D1D28] border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-300 font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] text-zinc-400 font-semibold block mb-1">
                  Khóa luồng phát (Stream Key)
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type={showKey ? 'text' : 'password'}
                    readOnly
                    value="live_942b1950_pulselive_ultraLowLatencyKey2026"
                    className="w-full bg-[#1D1D28] border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-300 font-mono"
                  />
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 cursor-pointer"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleCopyStreamKey}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-white cursor-pointer"
                    title="Sao chép Stream Key"
                  >
                    {copiedKey ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-zinc-500">
                💡 Khuyến nghị: Bitrate 6000 Kbps, Keyframe Interval = 2s, B-frames = 2.
              </p>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Quick Actions Dock + Real-time Activity Feed */}
        <div className="lg:col-span-5 space-y-5">
          {/* Quick Actions Dock */}
          <div className="p-4 rounded-2xl bg-[#15151E] border border-white/10 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Bàn Phím Thao Tác Nhanh (Stream Deck UI)
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <button
                onClick={() =>
                  triggerOverlayAlert('🚀 HoangTuan_VIP vừa tặng Tên Lửa Vũ Trụ x10!')
                }
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 text-left transition-all cursor-pointer group"
              >
                <BellRing className="w-4 h-4 text-amber-400 mb-1.5 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-white">Test Alert Quà</p>
                <p className="text-[10px] text-zinc-400">Hiện hiệu ứng trên live</p>
              </button>

              <button
                onClick={() => {
                  setClipSuccess(true);
                  triggerOverlayAlert('✂️ Đã cắt Clip Highlight 30 giây gần nhất!');
                  setTimeout(() => setClipSuccess(false), 2500);
                }}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 text-left transition-all cursor-pointer group"
              >
                <Scissors className="w-4 h-4 text-cyan-400 mb-1.5 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-white">
                  {clipSuccess ? 'Đã Lưu Clip!' : 'Cắt Clip 30s'}
                </p>
                <p className="text-[10px] text-zinc-400">Lưu khoảnh khắc</p>
              </button>

              <button
                onClick={() =>
                  triggerOverlayAlert('📊 Đã ghim Bình chọn (Poll) mới lên đầu khung Chat!')
                }
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 text-left transition-all cursor-pointer group"
              >
                <BarChart3 className="w-4 h-4 text-violet-400 mb-1.5 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-white">Tạo Bình Chọn</p>
                <p className="text-[10px] text-zinc-400">Tương tác khán giả</p>
              </button>

              <button
                onClick={() => setFollowersOnly(!followersOnly)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  followersOnly
                    ? 'bg-emerald-500/15 border-emerald-500/40'
                    : 'bg-white/5 border-white/8'
                }`}
              >
                <Shield className="w-4 h-4 text-emerald-400 mb-1.5" />
                <p className="text-xs font-bold text-white">Chat Theo Dõi</p>
                <p className="text-[10px] text-zinc-400">
                  {followersOnly ? 'Đang BẬT' : 'Đang TẮT'}
                </p>
              </button>

              <button
                onClick={() => setSlowMode(!slowMode)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  slowMode
                    ? 'bg-amber-500/15 border-amber-500/40'
                    : 'bg-white/5 border-white/8'
                }`}
              >
                <Activity className="w-4 h-4 text-amber-400 mb-1.5" />
                <p className="text-xs font-bold text-white">Slow Mode (3s)</p>
                <p className="text-[10px] text-zinc-400">
                  {slowMode ? 'Đang BẬT' : 'Đang TẮT'}
                </p>
              </button>

              <button
                onClick={() => {
                  const newEv = {
                    id: `ev-${Date.now()}`,
                    type: 'gift',
                    user: 'Shark_Hung',
                    detail: 'vừa tặng 🐉 Rồng Vàng Thần Thoại x1 (5,000 Xu)',
                    time: 'Vừa xong',
                    badge: '🐉 LEGEND',
                    color: 'text-amber-300 bg-amber-500/20 border-amber-400/40',
                  };
                  setActivityEvents((prev) => [newEv, ...prev]);
                  triggerOverlayAlert('🐉 Shark_Hung vừa tặng Rồng Vàng Thần Thoại!');
                }}
                className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-rose-500/20 border border-amber-400/30 text-left transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 text-amber-300 mb-1.5" />
                <p className="text-xs font-bold text-amber-200">Giả Lập Nổ Quà</p>
                <p className="text-[10px] text-zinc-300">Thêm sự kiện mới</p>
              </button>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="p-4 rounded-2xl bg-[#15151E] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-400" />
                Nhật Ký Hoạt Động (Activity Feed)
              </h3>
              <span className="text-[11px] text-zinc-400">Thời gian thực</span>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {activityEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3 rounded-xl bg-[#1B1B26] border border-white/6 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-extrabold border ${ev.color}`}
                      >
                        {ev.badge}
                      </span>
                      <span className="text-xs font-extrabold text-white">{ev.user}</span>
                      <span className="text-[10px] text-zinc-500">• {ev.time}</span>
                    </div>
                    <p className="text-xs text-zinc-300 mt-1">{ev.detail}</p>
                  </div>

                  <button
                    onClick={() => triggerOverlayAlert(`${ev.user} ${ev.detail}`)}
                    className="px-2.5 py-1 rounded-lg bg-white/8 hover:bg-white/15 text-[10px] font-bold text-zinc-200 shrink-0 cursor-pointer"
                  >
                    Phát lại Alert
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
