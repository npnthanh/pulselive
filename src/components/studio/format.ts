const pad = (n: number) => String(n).padStart(2, '0');

/** 3725 → "01:02:05" */
export const formatClock = (totalSec: number) => {
  const s = Math.max(0, Math.floor(totalSec));
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
};

/** 3725 → "1:02:05", 42 → "0:42" */
export const formatDuration = (totalSec: number) => {
  const s = Math.max(0, Math.floor(totalSec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return h > 0 ? `${h}:${pad(m)}:${pad(s % 60)}` : `${m}:${pad(s % 60)}`;
};

/** 1284 → "1.284", 12_900 → "12,9K", 4_200_000 → "4,2M" (same style as the rest of the app) */
export const formatCompact = (n: number) => {
  const trim = (x: number) => x.toFixed(1).replace(/\.0$/, '').replace('.', ',');
  if (Math.abs(n) >= 1_000_000) return `${trim(n / 1_000_000)}M`;
  if (Math.abs(n) >= 10_000) return `${trim(n / 1_000)}K`;
  return n.toLocaleString('vi-VN');
};

export const formatNumber = (n: number) => n.toLocaleString('vi-VN');

export const formatDate = (d: Date) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;

export const formatTime = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

export const timeAgo = (d: Date, now: number) => {
  const sec = Math.max(0, Math.floor((now - d.getTime()) / 1000));
  if (sec < 60) return 'vừa xong';
  if (sec < 3600) return `${Math.floor(sec / 60)} phút trước`;
  if (sec < 86_400) return `${Math.floor(sec / 3600)} giờ trước`;
  if (sec < 86_400 * 30) return `${Math.floor(sec / 86_400)} ngày trước`;
  return formatDate(d);
};
