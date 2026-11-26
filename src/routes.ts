import { matchPath } from 'react-router';
import type { ActiveTab } from './components/Navbar';
import { STREAM_CHANNELS, type StreamChannel } from './data/mockData';

/**
 * URL map of the app — every page has its own address, so links can be shared, bookmarked,
 * reloaded, and the browser Back/Forward buttons work.
 *
 *   /                          Trang chủ
 *   /live/:channelId           Phòng xem live
 *   /channel/:channelId        Trang kênh
 *   /wallet                    Ví Xu
 *   /account[/following|coins] Trung tâm cá nhân
 *   /studio[/live|analytics|community|videos|customize]  Creator Studio
 */

export const ACCOUNT_SECTIONS = ['info', 'following', 'coins'] as const;
export type AccountSection = (typeof ACCOUNT_SECTIONS)[number];

export const STUDIO_SECTIONS = ['home', 'live', 'analytics', 'community', 'videos', 'customize'] as const;
export type StudioSection = (typeof STUDIO_SECTIONS)[number];

export const paths = {
  home: () => '/',
  watch: (channelId: string) => `/live/${channelId}`,
  channel: (channelId: string) => `/channel/${channelId}`,
  wallet: () => '/wallet',
  /** The default section lives at the bare path (`/account`, `/studio`). */
  account: (section: AccountSection = 'info') => (section === 'info' ? '/account' : `/account/${section}`),
  studio: (section: StudioSection = 'home') => (section === 'home' ? '/studio' : `/studio/${section}`),
};

export type AppRoute =
  | { page: 'home' }
  | { page: 'watch'; channel: StreamChannel }
  | { page: 'channel'; channel: StreamChannel }
  | { page: 'wallet' }
  | { page: 'account'; section: AccountSection }
  | { page: 'studio'; section: StudioSection }
  | { page: 'notfound' };

const findChannel = (id: string | undefined) => STREAM_CHANNELS.find((c) => c.id === id);
const isOneOf = <T extends string>(list: readonly T[], value: string | undefined): value is T =>
  value !== undefined && (list as readonly string[]).includes(value);

/** Turns a pathname into the page to render; unknown paths / ids become `notfound`. */
export function parseRoute(pathname: string): AppRoute {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  if (path === '/') return { page: 'home' };

  const live = matchPath('/live/:channelId', path);
  if (live) {
    const channel = findChannel(live.params.channelId);
    return channel ? { page: 'watch', channel } : { page: 'notfound' };
  }
  const channelPage = matchPath('/channel/:channelId', path);
  if (channelPage) {
    const channel = findChannel(channelPage.params.channelId);
    return channel ? { page: 'channel', channel } : { page: 'notfound' };
  }
  if (matchPath('/wallet', path)) return { page: 'wallet' };

  const account = matchPath('/account/:section?', path);
  if (account) {
    const section = account.params.section ?? 'info';
    return isOneOf(ACCOUNT_SECTIONS, section) ? { page: 'account', section } : { page: 'notfound' };
  }
  const studio = matchPath('/studio/:section?', path);
  if (studio) {
    const section = studio.params.section ?? 'home';
    return isOneOf(STUDIO_SECTIONS, section) ? { page: 'studio', section } : { page: 'notfound' };
  }
  return { page: 'notfound' };
}

/** Which top-level area a route belongs to (drives header highlights and the left sidebar). */
export const tabOf = (route: AppRoute): ActiveTab | null => (route.page === 'notfound' ? null : route.page);

const SITE = 'PulseLive';
const ACCOUNT_TITLES: Record<AccountSection, string> = {
  info: 'Thông tin của tôi',
  following: 'Theo dõi của tôi',
  coins: 'Xu của tôi',
};
const STUDIO_TITLES: Record<StudioSection, string> = {
  home: 'Trang chủ',
  live: 'Quản lý livestream',
  analytics: 'Phân tích dữ liệu',
  community: 'Cộng đồng',
  videos: 'Video & clip',
  customize: 'Tùy chỉnh',
};

/** Browser-tab title for each page. */
export function titleOf(route: AppRoute): string {
  switch (route.page) {
    case 'home':
      return `${SITE} — Nền Tảng Livestream Tương Tác Thế Hệ Mới`;
    case 'watch':
      return `${route.channel.name} đang live: ${route.channel.title} | ${SITE}`;
    case 'channel':
      return `${route.channel.name} — Kênh | ${SITE}`;
    case 'wallet':
      return `Ví Xu | ${SITE}`;
    case 'account':
      return `${ACCOUNT_TITLES[route.section]} | ${SITE}`;
    case 'studio':
      return `${STUDIO_TITLES[route.section]} — Creator Studio | ${SITE}`;
    case 'notfound':
      return `Không tìm thấy trang | ${SITE}`;
  }
}
