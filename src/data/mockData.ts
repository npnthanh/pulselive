export type StreamMode = 'standard' | 'pk' | 'commerce';

export interface StreamChannel {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  verified: boolean;
  title: string;
  category: string;
  categorySlug: string;
  viewers: number;
  followers: string;
  isLive: boolean;
  duration: string;
  thumbnail: string;
  videoPreviewColor: string;
  tags: string[];
  mode: StreamMode;
  bitrate: string;
  fps: number;
  bio: string;
  pkOpponent?: {
    name: string;
    avatar: string;
    score: number;
    myScore: number;
    timeLeft: string;
  };
  pinnedProduct?: LiveProduct;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  viewers: string;
  tags: string[];
  cover: string;
  accent: string;
  badge?: string;
}

export interface VirtualGift {
  id: string;
  name: string;
  emoji: string;
  price: number;
  tier: 'basic' | 'rare' | 'epic' | 'legendary';
  color: string;
  description: string;
}

export interface LiveProduct {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  sold: number;
  stock: number;
  image: string;
  badge: string;
}

export interface ChatMessage {
  id: string;
  user: string;
  avatar?: string;
  color: string;
  badges: ('streamer' | 'mod' | 'vip' | 'sub' | 'top1')[];
  text: string;
  timestamp: string;
  isSuperChat?: boolean;
  superChatAmount?: number;
  giftInfo?: {
    emoji: string;
    name: string;
    count: number;
  };
}

export const STREAM_CHANNELS: StreamChannel[] = [
  {
    id: 'mixi-gaming',
    name: 'Độ Mixi',
    handle: '@domixi',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    verified: true,
    title: 'Tâm sự đêm khuya cùng Bộ Tộc — Giải đấu Ao Làng mở rộng 2026 🔥',
    category: 'Just Chatting & Gaming',
    categorySlug: 'talkshow',
    viewers: 48520,
    followers: '3.8M',
    isLive: true,
    duration: '02:41:18',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
    videoPreviewColor: 'from-violet-900/80 via-indigo-950/90 to-slate-950',
    tags: ['Tiếng Việt', 'Talkshow', 'Top 1 Trending', '1080p60'],
    mode: 'standard',
    bitrate: '6,850 kbps',
    fps: 60,
    bio: 'Kênh livestream chính thức của Độ Mixi. Lịch live cố định 22h15 hàng ngày. Cảm ơn anh em Bộ Tộc luôn đồng hành!',
  },
  {
    id: 'linh-idol-pk',
    name: 'Linh Ka Official',
    handle: '@linhka.live',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160&auto=format&fit=crop&q=80',
    verified: true,
    title: '⚔️ Đại Chiến PK Đêm Nhạc Acoustic — Ai thua phạt hát 5 bài liên tiếp!',
    category: 'Idol & PK Battle',
    categorySlug: 'idol-pk',
    viewers: 19340,
    followers: '1.2M',
    isLive: true,
    duration: '01:15:40',
    thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop&q=80',
    videoPreviewColor: 'from-rose-900/80 via-fuchsia-950/90 to-slate-950',
    tags: ['Đấu PK', 'Acoustic', 'Idol', 'Tặng Quà X2'],
    mode: 'pk',
    bitrate: '5,400 kbps',
    fps: 60,
    bio: 'Ca hát Acoustic & Giao lưu PK mỗi tối 20h00. Cả nhà thả tim và tiếp máu PK giúp Linh nha 💖',
    pkOpponent: {
      name: 'Minh Trang Vocal',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=160&auto=format&fit=crop&q=80',
      myScore: 64200,
      score: 48900,
      timeLeft: '02:38',
    },
  },
  {
    id: 'tech-shop-live',
    name: 'GearVN Flagship Studio',
    handle: '@gearvn.live',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=160&auto=format&fit=crop&q=80',
    verified: true,
    title: '🛒 MEGA FLASH SALE 11.11: Bàn phím cơ Custom & Tai nghe Gaming giảm 45% + Freeship!',
    category: 'Live Commerce',
    categorySlug: 'commerce',
    viewers: 14280,
    followers: '890K',
    isLive: true,
    duration: '03:12:05',
    thumbnail: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1200&auto=format&fit=crop&q=80',
    videoPreviewColor: 'from-amber-900/80 via-orange-950/90 to-slate-950',
    tags: ['Live Shop', 'Voucher 500K', 'Chính Hãng', 'Flash Sale'],
    mode: 'commerce',
    bitrate: '6,000 kbps',
    fps: 60,
    bio: 'Săn deal công nghệ & Gaming Gear chính hãng trực tiếp trên sóng livestream với mức giá độc quyền chỉ có trong khung giờ Live.',
  },
  {
    id: 'valorant-vct',
    name: 'VCT Pacific Tiếng Việt',
    handle: '@vctpacific.vn',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=160&auto=format&fit=crop&q=80',
    verified: true,
    title: '[CHUNG KẾT NHÁNH THẮNG] PRX vs GEN.G — Bình luận Tiếng Việt Full HD 60FPS',
    category: 'VALORANT Esports',
    categorySlug: 'valorant',
    viewers: 36910,
    followers: '1.5M',
    isLive: true,
    duration: '04:05:22',
    thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80',
    videoPreviewColor: 'from-emerald-900/80 via-teal-950/90 to-slate-950',
    tags: ['Esports', 'Giải đấu', 'Drop Quà', '1080p60'],
    mode: 'standard',
    bitrate: '8,000 kbps',
    fps: 60,
    bio: 'Kênh phát sóng bản quyền các giải đấu VALORANT Champions Tour khu vực Châu Á - Thái Bình Dương.',
  },
  {
    id: 'chef-hoang',
    name: 'Bếp Đêm Sài Gòn',
    handle: '@bepdemsg',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
    verified: false,
    title: 'Nấu mì Ramen Tonkotsu nước dùng hầm 12 tiếng + Mukbang đêm khuya 🍜',
    category: 'Ẩm Thực & IRL',
    categorySlug: 'irl',
    viewers: 6840,
    followers: '320K',
    isLive: true,
    duration: '01:48:11',
    thumbnail: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=1200&auto=format&fit=crop&q=80',
    videoPreviewColor: 'from-cyan-900/80 via-slate-900 to-slate-950',
    tags: ['Ẩm thực', 'Mukbang', 'Chill', 'IRL'],
    mode: 'standard',
    bitrate: '5,200 kbps',
    fps: 60,
    bio: 'Mỗi đêm một món ngon cùng câu chuyện ẩm thực đường phố.',
  },
  {
    id: 'dj-mio-set',
    name: 'DJ Mio Rooftop Set',
    handle: '@djmio.official',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=160&auto=format&fit=crop&q=80',
    verified: true,
    title: '🎧 Melodic Techno & Progressive House Live Set ngắm toàn cảnh Skyline',
    category: 'Âm Nhạc & DJ',
    categorySlug: 'music',
    viewers: 11200,
    followers: '640K',
    isLive: true,
    duration: '02:00:09',
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80',
    videoPreviewColor: 'from-purple-900/80 via-violet-950 to-slate-950',
    tags: ['EDM', 'Live DJ', '4K Audio', 'Visuals'],
    mode: 'standard',
    bitrate: '7,200 kbps',
    fps: 60,
    bio: 'Rooftop Electronic Music Sessions mỗi cuối tuần.',
  },
];

export const CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-1',
    name: 'Just Chatting / Talkshow',
    slug: 'talkshow',
    viewers: '142.8K',
    tags: ['IRL', 'Giao lưu'],
    cover: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500&auto=format&fit=crop&q=80',
    accent: 'from-violet-600 to-indigo-600',
    badge: 'HOT #1',
  },
  {
    id: 'cat-2',
    name: 'VALORANT & FPS',
    slug: 'valorant',
    viewers: '98.4K',
    tags: ['Shooter', 'Esports'],
    cover: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80',
    accent: 'from-rose-600 to-red-700',
    badge: 'ESPORTS',
  },
  {
    id: 'cat-3',
    name: 'Idol & Đấu PK',
    slug: 'idol-pk',
    viewers: '84.2K',
    tags: ['Ca hát', 'Đấu PK'],
    cover: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop&q=80',
    accent: 'from-pink-600 to-purple-700',
    badge: 'PK X2',
  },
  {
    id: 'cat-4',
    name: 'Live Commerce / Săn Deal',
    slug: 'commerce',
    viewers: '63.5K',
    tags: ['Flash Sale', 'Mua sắm'],
    cover: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500&auto=format&fit=crop&q=80',
    accent: 'from-amber-500 to-orange-600',
    badge: 'VOUCHER 50%',
  },
  {
    id: 'cat-5',
    name: 'Liên Minh Huyền Thoại',
    slug: 'lol',
    viewers: '115.0K',
    tags: ['MOBA', 'Rank Thách Đấu'],
    cover: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&auto=format&fit=crop&q=80',
    accent: 'from-blue-600 to-cyan-600',
  },
  {
    id: 'cat-6',
    name: 'Âm Nhạc & Live Session',
    slug: 'music',
    viewers: '41.9K',
    tags: ['Acoustic', 'DJ Set'],
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
    accent: 'from-emerald-600 to-teal-700',
  },
];

export const VIRTUAL_GIFTS: VirtualGift[] = [
  {
    id: 'gift-rose',
    name: 'Hoa Hồng Đỏ',
    emoji: '🌹',
    price: 10,
    tier: 'basic',
    color: 'from-rose-500 to-pink-600',
    description: 'Gửi lời chào ngọt ngào tới Streamer',
  },
  {
    id: 'gift-boba',
    name: 'Trà Sữa Full Topping',
    emoji: '🧋',
    price: 50,
    tier: 'basic',
    color: 'from-amber-500 to-orange-500',
    description: 'Tiếp năng lượng livestream xuyên đêm',
  },
  {
    id: 'gift-trophy',
    name: 'Cúp Vô Địch',
    emoji: '🏆',
    price: 200,
    tier: 'rare',
    color: 'from-yellow-400 to-amber-600',
    description: 'Vinh danh pha xử lý đỉnh cao',
  },
  {
    id: 'gift-rocket',
    name: 'Tên Lửa Vũ Trụ',
    emoji: '🚀',
    price: 500,
    tier: 'epic',
    color: 'from-violet-500 to-fuchsia-600',
    description: 'Kích hoạt thông báo toàn phòng + hiệu ứng Hype',
  },
  {
    id: 'gift-supercar',
    name: 'Siêu Xe Neon',
    emoji: '🏎️',
    price: 1200,
    tier: 'epic',
    color: 'from-cyan-400 to-blue-600',
    description: 'Hiệu ứng siêu xe lướt ngang màn hình',
  },
  {
    id: 'gift-dragon',
    name: 'Rồng Vàng Thần Thoại',
    emoji: '🐉',
    price: 5000,
    tier: 'legendary',
    color: 'from-amber-300 via-yellow-500 to-red-600',
    description: 'Vật phẩm Huyền Thoại — Thông báo vinh danh toàn server!',
  },
];

export const LIVE_PRODUCTS: LiveProduct[] = [
  {
    id: 'prod-1',
    name: 'Bàn phím cơ Không Dây Aula F75 Pro Custom Hotswap RGB',
    price: 1190000,
    originalPrice: 1890000,
    sold: 412,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&auto=format&fit=crop&q=80',
    badge: 'ĐANG GHIM #1',
  },
  {
    id: 'prod-2',
    name: 'Chuột Gaming Siêu Nhẹ Logitech G Pro X Superlight 2',
    price: 2650000,
    originalPrice: 3590000,
    sold: 189,
    stock: 9,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=300&auto=format&fit=crop&q=80',
    badge: 'GIẢM 26%',
  },
  {
    id: 'prod-3',
    name: 'Tai nghe Studio HyperX Cloud III Wireless 7.1 Surround',
    price: 2190000,
    originalPrice: 2990000,
    sold: 275,
    stock: 24,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=300&auto=format&fit=crop&q=80',
    badge: 'TẶNG GIÁ ĐỠ',
  },
  {
    id: 'prod-4',
    name: 'Micro Thu Âm Livestream Elgato Wave:3 USB-C Chống Ồn',
    price: 3150000,
    originalPrice: 4200000,
    sold: 94,
    stock: 7,
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=300&auto=format&fit=crop&q=80',
    badge: 'DEAL ĐỘC QUYỀN',
  },
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    user: 'HoangTuan_VIP',
    color: '#F59E0B',
    badges: ['top1', 'vip', 'sub'],
    text: 'Chào anh em nhé! Hôm nay lên sóng sớm thế 🔥🔥',
    timestamp: '22:40',
  },
  {
    id: 'msg-2',
    user: 'Mod_ThanhHa',
    color: '#10B981',
    badges: ['mod', 'sub'],
    text: '📌 Nhắc nhẹ anh em giữ văn minh lịch sự trong khung chat và bấm bình chọn ở hộp Poll phía trên nha!',
    timestamp: '22:41',
  },
  {
    id: 'msg-3',
    user: 'MinhKhang99',
    color: '#A78BFA',
    badges: ['sub'],
    text: 'Âm thanh với nét căng đét 1080p60 luôn đỉnh thật sự 👏',
    timestamp: '22:41',
  },
  {
    id: 'msg-4',
    user: 'Shark_Hung',
    color: '#F43F5E',
    badges: ['vip', 'sub'],
    text: 'Mở màn ủng hộ kênh 1 quả Tên Lửa Vũ Trụ lấy hên đêm nay nhé!! 🚀🚀🚀',
    timestamp: '22:42',
    isSuperChat: true,
    superChatAmount: 500,
    giftInfo: {
      emoji: '🚀',
      name: 'Tên Lửa Vũ Trụ',
      count: 1,
    },
  },
  {
    id: 'msg-5',
    user: 'BaoNgoc_Gaming',
    color: '#38BDF8',
    badges: [],
    text: 'Cho mình hỏi bàn phím đang dùng trên bàn là mã gì vậy mọi người?',
    timestamp: '22:42',
  },
  {
    id: 'msg-6',
    user: 'KienPT_Dev',
    color: '#34D399',
    badges: ['sub'],
    text: 'Giao diện Theater Mode của web mới nhìn mượt hơn hẳn Twitch luôn 😍',
    timestamp: '22:43',
  },
];

export const TOP_SUPPORTERS = [
  { rank: 1, name: 'HoangTuan_VIP', points: 18500, avatar: '👑', badgeColor: 'from-amber-400 to-yellow-600' },
  { rank: 2, name: 'Shark_Hung', points: 12400, avatar: '🦈', badgeColor: 'from-slate-300 to-slate-500' },
  { rank: 3, name: 'LinhChi_98', points: 8950, avatar: '💎', badgeColor: 'from-amber-600 to-orange-700' },
];
