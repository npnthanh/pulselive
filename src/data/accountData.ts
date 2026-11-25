import { STREAM_CHANNELS, VIRTUAL_GIFTS } from './mockData';
import { createRandom } from './random';

/* ------------------------------------------------------------------ */
/* User profile                                                        */
/* ------------------------------------------------------------------ */

export type Gender = 'male' | 'female' | 'other';

export const GENDER_LABELS: Record<Gender, string> = {
  male: 'Nam',
  female: 'Nữ',
  other: 'Khác',
};

export interface UserProfile {
  id: string;
  name: string;
  gender: Gender;
  /** Local date in YYYY-MM-DD format */
  birthday: string;
  phone: string;
  avatar: string;
}

export const USER_AVATAR =
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80';

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'PL-20481937',
  name: 'Trần Minh Khang',
  gender: 'male',
  birthday: '2000-08-15',
  phone: '0912345678',
  avatar: USER_AVATAR,
};

/* ------------------------------------------------------------------ */
/* Coin history (mock, deterministic per month)                        */
/* ------------------------------------------------------------------ */

export type CoinTxnType = 'gifted' | 'received' | 'expired';

export interface CoinTransaction {
  id: string;
  type: CoinTxnType;
  amount: number;
  date: Date;
  title: string;
  detail: string;
}

export interface MonthOption {
  key: string;
  year: number;
  /** 1–12 */
  month: number;
  label: string;
}

/** The `count` most recent months, newest first (current month included). */
export function getRecentMonths(count = 12, now = new Date()): MonthOption[] {
  const months: MonthOption[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    months.push({
      key: `${year}-${String(month).padStart(2, '0')}`,
      year,
      month,
      label: `Tháng ${month}/${year}`,
    });
  }
  return months;
}

const TYPE_SEED: Record<CoinTxnType, number> = { gifted: 11, received: 23, expired: 37 };

const RECEIVED_SOURCES = [
  { title: 'Thưởng điểm danh hằng ngày', detail: 'Chuỗi đăng nhập liên tiếp', min: 5, max: 30 },
  { title: 'Rương quà Streamer Cup', detail: 'Sự kiện Giải Đấu Streamer Cup', min: 50, max: 300 },
  { title: 'Hoàn Xu đơn Live Shop', detail: 'Ưu đãi Flash Sale', min: 20, max: 150 },
  { title: 'Thưởng nhiệm vụ xem live', detail: 'Xem đủ 60 phút trong ngày', min: 10, max: 60 },
  { title: 'Quà từ bạn bè', detail: 'Được tặng qua tin nhắn', min: 50, max: 500 },
];

const EXPIRED_SOURCES = [
  { title: 'Xu thưởng sự kiện hết hạn', detail: 'Hạn dùng 30 ngày' },
  { title: 'Xu điểm danh hết hạn', detail: 'Hạn dùng 14 ngày' },
  { title: 'Xu khuyến mãi nạp lần đầu hết hạn', detail: 'Hạn dùng 60 ngày' },
];

const COUNT_RANGE: Record<CoinTxnType, [number, number]> = {
  gifted: [3, 8],
  received: [2, 6],
  expired: [0, 2],
};

const txnCache = new Map<string, CoinTransaction[]>();

/**
 * Mock coin transactions of one type for a given month, newest first.
 * For the current month only days up to today are generated.
 */
export function getCoinTransactions(
  type: CoinTxnType,
  year: number,
  month: number,
  now = new Date()
): CoinTransaction[] {
  const cacheKey = `${type}-${year}-${month}`;
  const cached = txnCache.get(cacheKey);
  if (cached) return cached;

  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1;
  const daysInMonth = new Date(year, month, 0).getDate();
  const lastDay = isCurrentMonth ? now.getDate() : daysInMonth;

  const { between, pick } = createRandom(year * 1000 + month * 10 + TYPE_SEED[type]);

  const [minCount, maxCount] = COUNT_RANGE[type];
  const count = Math.round((between(minCount, maxCount) * lastDay) / daysInMonth);

  const txns: CoinTransaction[] = [];
  for (let i = 0; i < count; i++) {
    const date = new Date(year, month - 1, between(1, lastDay), between(8, 23), between(0, 59));
    const id = `${cacheKey}-${i}`;

    if (type === 'gifted') {
      const gift = pick(VIRTUAL_GIFTS.filter((g) => g.price <= 1200));
      const qty = gift.price <= 50 ? pick([1, 10, 10, 66]) : 1;
      const channel = pick(STREAM_CHANNELS);
      txns.push({
        id,
        type,
        amount: gift.price * qty,
        date,
        title: `${gift.emoji} ${gift.name} x${qty}`,
        detail: `Tặng ${channel.name}`,
      });
    } else if (type === 'received') {
      const src = pick(RECEIVED_SOURCES);
      txns.push({ id, type, amount: between(src.min, src.max), date, title: src.title, detail: src.detail });
    } else {
      const src = pick(EXPIRED_SOURCES);
      txns.push({ id, type, amount: between(10, 120), date, title: src.title, detail: src.detail });
    }
  }

  txns.sort((a, b) => b.date.getTime() - a.date.getTime());
  txnCache.set(cacheKey, txns);
  return txns;
}
