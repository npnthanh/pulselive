import { STREAM_CHANNELS } from './mockData';
import { createRandom } from './random';

/* ------------------------------------------------------------------ */
/* Stream setup                                                        */
/* ------------------------------------------------------------------ */

export const STUDIO_CATEGORIES = [
  'Just Chatting',
  'VALORANT',
  'Liên Minh Huyền Thoại',
  'PUBG Mobile',
  'Âm Nhạc & DJ',
  'Ẩm Thực & IRL',
  'Live Bán Hàng',
] as const;

export const STREAM_SERVER_URL = 'rtmp://live.pulselive.vn/app';
export const STREAM_KEY = 'live_20481937_Xk9pQ2vRtL7mWb4N';

/* ------------------------------------------------------------------ */
/* Channel analytics (daily, mock)                                     */
/* ------------------------------------------------------------------ */

export interface DailyStat {
  date: Date;
  /** dd/mm */
  label: string;
  views: number;
  watchHours: number;
  newFollowers: number;
  coins: number;
  peakViewers: number;
}

function buildDailyStats(days: number, now = new Date()): DailyStat[] {
  const { rand } = createRandom(20481937);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const stats: DailyStat[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
    const dayIndex = days - 1 - i;
    const weekend = date.getDay() === 0 || date.getDay() === 6;
    const offDay = rand() < 0.1; // streamer took the day off
    const noise = 0.8 + rand() * 0.4;
    const base = 1800 + dayIndex * 9;
    const views = Math.round(base * noise * (weekend ? 1.35 : 1) * (offDay ? 0.3 : 1));

    stats.push({
      date,
      label: `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`,
      views,
      watchHours: Math.round((views * (16 + rand() * 10)) / 60),
      newFollowers: Math.round(views * (0.011 + rand() * 0.009)),
      coins: Math.round(views * (1.1 + rand() * 0.8)),
      peakViewers: Math.round(views * (0.18 + rand() * 0.08)),
    });
  }
  return stats;
}

/** 180 days so every range up to 90 days has a previous period to compare against. */
export const DAILY_STATS = buildDailyStats(180);

export const TRAFFIC_SOURCES = [
  { label: 'Trang chủ Khám phá', share: 38 },
  { label: 'Thông báo người theo dõi', share: 24 },
  { label: 'Tìm kiếm', share: 17 },
  { label: 'Kênh đề xuất', share: 13 },
  { label: 'Liên kết bên ngoài', share: 8 },
];

/* ------------------------------------------------------------------ */
/* Community                                                           */
/* ------------------------------------------------------------------ */

export interface Follower {
  id: string;
  name: string;
  avatarClass: string;
  followedAt: Date;
  giftedCoins: number;
  watchHours: number;
  isSub: boolean;
  isMod: boolean;
}

const FOLLOWER_NAMES = [
  'MinhDuc_FPS', 'ThaoVy_Cute', 'QuocBao_99', 'HuyHoang_Pro', 'LinhChi_98', 'TuanAnh_Gear',
  'HoangTuan_VIP', 'BaoNgoc.Live', 'KhanhLinh_Music', 'DucThang_GG', 'MaiAnh_2k3', 'TrongNghia_Bo',
  'PhuongThao_IRL', 'VietHung_Valo', 'NgocHan_Chill', 'GiaHuy_Sniper', 'ThuTrang_Moon', 'QuangMinh_TV',
  'AnhThu_Kpop', 'DinhKhoa_Esport', 'HaVy_Cooking', 'TienDat_Speed', 'MyDuyen_Art', 'CongPhuong_FC',
  'NhatLinh_Rap', 'ThanhTam_Zen', 'BichNgoc_Shop', 'XuanMai_Daily', 'KimNgan_Vlog', 'DangKhoa_Tech',
  'YenNhi_Dance', 'PhucLam_Gamer', 'TrucLinh_Sing', 'VanHau_Meme', 'BaoAnh_Night', 'ThienAn_Pixel',
  'HongNhung_Tea', 'TuanKiet_Pro', 'MinhChau_Book', 'QuynhAnh_Star', 'NhatHuy_Clutch', 'KhanhVy_Sky',
];

const AVATAR_CLASSES = [
  'bg-sky-500/25 text-sky-200',
  'bg-violet-500/25 text-violet-200',
  'bg-emerald-500/25 text-emerald-200',
  'bg-amber-500/25 text-amber-200',
  'bg-rose-500/25 text-rose-200',
  'bg-cyan-500/25 text-cyan-200',
];

function buildFollowers(now = new Date()): Follower[] {
  const { rand, between, pick } = createRandom(7731);
  return FOLLOWER_NAMES.map((name, i) => {
    const daysAgo = Math.floor(Math.pow(rand(), 1.6) * 420);
    const followedAt = new Date(now.getTime() - daysAgo * 86_400_000 - between(0, 86_399) * 1000);
    const generous = rand() < 0.25;
    return {
      id: `f-${i}`,
      name,
      avatarClass: pick(AVATAR_CLASSES),
      followedAt,
      giftedCoins: generous ? between(800, 25_000) : between(0, 600),
      watchHours: between(2, 320),
      isSub: rand() < 0.3,
      isMod: i === 6 || i === 15 || i === 27,
    };
  });
}

export const INITIAL_FOLLOWERS = buildFollowers();
export const TOTAL_FOLLOWER_COUNT = 12_486;

/* ------------------------------------------------------------------ */
/* Videos & clips                                                      */
/* ------------------------------------------------------------------ */

export interface Vod {
  id: string;
  title: string;
  category: string;
  startedAt: Date;
  durationSec: number;
  views: number;
  peakViewers: number;
  thumbnail: string;
}

export interface Clip {
  id: string;
  title: string;
  sourceTitle: string;
  startSec: number;
  durationSec: number;
  createdAt: Date;
  views: number;
  thumbnail: string;
}

const THUMBS = STREAM_CHANNELS.map((c) => c.thumbnail);
const daysAgo = (d: number, hour = 21) => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() - d, hour, 30);
};

export const INITIAL_VODS: Vod[] = [
  { id: 'v-1', title: 'Leo rank Radiant cùng anh em — đêm thứ 3', category: 'VALORANT', startedAt: daysAgo(1), durationSec: 4 * 3600 + 12 * 60 + 8, views: 18_420, peakViewers: 3_910, thumbnail: THUMBS[0] },
  { id: 'v-2', title: 'Talkshow đêm khuya: Hỏi xoáy đáp xoay', category: 'Just Chatting', startedAt: daysAgo(2, 22), durationSec: 2 * 3600 + 45 * 60 + 31, views: 9_870, peakViewers: 2_140, thumbnail: THUMBS[1] },
  { id: 'v-3', title: 'Unbox bàn phím custom & test âm thanh switch', category: 'Live Bán Hàng', startedAt: daysAgo(4, 20), durationSec: 1 * 3600 + 58 * 60 + 2, views: 6_310, peakViewers: 1_480, thumbnail: THUMBS[2] },
  { id: 'v-4', title: 'Giải đấu Ao Làng — Vòng bảng ngày 2', category: 'VALORANT', startedAt: daysAgo(6, 19), durationSec: 5 * 3600 + 3 * 60 + 44, views: 24_905, peakViewers: 5_620, thumbnail: THUMBS[3] },
  { id: 'v-5', title: 'Acoustic cuối tuần: request bài hát', category: 'Âm Nhạc & DJ', startedAt: daysAgo(9, 21), durationSec: 2 * 3600 + 10 * 60 + 15, views: 7_442, peakViewers: 1_730, thumbnail: THUMBS[4] },
  { id: 'v-6', title: 'Đi ăn đêm Sài Gòn — phố ẩm thực Hồ Thị Kỷ', category: 'Ẩm Thực & IRL', startedAt: daysAgo(12, 22), durationSec: 1 * 3600 + 26 * 60 + 50, views: 5_118, peakViewers: 990, thumbnail: THUMBS[5 % THUMBS.length] },
];

export const INITIAL_CLIPS: Clip[] = [
  { id: 'c-1', title: 'Ace 1 vs 5 cực gắt cuối hiệp', sourceTitle: INITIAL_VODS[0].title, startSec: 2 * 3600 + 14 * 60, durationSec: 42, createdAt: daysAgo(1, 23), views: 12_830, thumbnail: THUMBS[0] },
  { id: 'c-2', title: 'Câu trả lời khiến cả chat cười lăn', sourceTitle: INITIAL_VODS[1].title, startSec: 58 * 60, durationSec: 27, createdAt: daysAgo(2, 23), views: 4_290, thumbnail: THUMBS[1] },
  { id: 'c-3', title: 'Clutch giữ điểm B — Vòng bảng ngày 2', sourceTitle: INITIAL_VODS[3].title, startSec: 3 * 3600 + 2 * 60, durationSec: 55, createdAt: daysAgo(6, 23), views: 21_074, thumbnail: THUMBS[3] },
];

/* ------------------------------------------------------------------ */
/* Live simulation pools                                               */
/* ------------------------------------------------------------------ */

export const LIVE_CHAT_POOL = [
  { user: 'MinhDuc_FPS', color: '#38BDF8', text: 'Hello anh, hôm nay chơi map gì vậy?' },
  { user: 'ThaoVy_Cute', color: '#F472B6', text: 'Tiếng mic hôm nay rõ quá 🔥' },
  { user: 'QuocBao_99', color: '#34D399', text: 'Hình nét căng luôn anh ơi' },
  { user: 'HuyHoang_Pro', color: '#A78BFA', text: 'Mở dự đoán đi anh, em cược thắng!' },
  { user: 'LinhChi_98', color: '#FBBF24', text: 'Vừa đi học về vào xem liền 🥰' },
  { user: 'TuanAnh_Gear', color: '#60A5FA', text: 'Anh dùng chuột gì vậy ạ?' },
  { user: 'HoangTuan_VIP', color: '#F59E0B', text: 'GG anh em, pha vừa rồi đỉnh thật' },
  { user: 'NgocHan_Chill', color: '#2DD4BF', text: 'Cho em xin bài nhạc nền với ạ' },
];

export const LIVE_GIFTS = [
  { name: 'Hoa Hồng Đỏ', emoji: '🌹', price: 10 },
  { name: 'Trà Sữa Full Topping', emoji: '🧋', price: 50 },
  { name: 'Cúp Vô Địch', emoji: '🏆', price: 200 },
  { name: 'Tên Lửa Vũ Trụ', emoji: '🚀', price: 500 },
];
