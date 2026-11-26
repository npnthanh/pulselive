import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useNavigationType } from 'react-router';
import {
  Maximize2,
  X,
  Radio,
} from 'lucide-react';
import { Navbar, type ActiveTab, type BrandTheme } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { HomeView } from './components/HomeView';
import { WatchRoomView } from './components/WatchRoomView';
import { StreamerStudioView } from './components/studio/StreamerStudioView';
import { useStudioState } from './components/studio/useStudioState';
import { ChannelProfileView } from './components/ChannelProfileView';
import { WalletView } from './components/WalletView';
import { AccountView } from './components/AccountView';
import {
  STREAM_CHANNELS,
  type StreamChannel,
  LIVE_PRODUCTS,
  type LiveProduct,
} from './data/mockData';
import { INITIAL_USER_PROFILE, type UserProfile } from './data/accountData';
import type { Language } from './components/SettingsMenu';
import { NotFoundView } from './components/NotFoundView';
import { parseRoute, paths, tabOf, titleOf } from './routes';

const THEME_KEY = 'pulselive.theme';
const LANGUAGE_KEY = 'pulselive.language';

/** Read a persisted preference; falls back when storage is unavailable or the value is unknown. */
function readSetting<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return allowed.includes(value as T) ? (value as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeSetting(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage unavailable (private mode, blocked) — preference just won't persist */
  }
}

export function App() {
  // The URL is the source of truth for which page is shown (see routes.ts)
  const location = useLocation();
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const route = parseRoute(location.pathname);
  const activeTab = tabOf(route);
  const [brandTheme, setBrandTheme] = useState<BrandTheme>(() =>
    readSetting(THEME_KEY, ['violet', 'kick', 'coral'] as const, 'violet')
  );
  const [language, setLanguage] = useState<Language>(() =>
    readSetting(LANGUAGE_KEY, ['vi', 'en'] as const, 'vi')
  );
  // Channel of the watch / channel page comes from the URL; elsewhere (mini-player) the last one opened
  const [lastChannel, setLastChannel] = useState<StreamChannel>(STREAM_CHANNELS[0]);
  const selectedChannel =
    route.page === 'watch' || route.page === 'channel' ? route.channel : lastChannel;
  // Components call onSelectChannel(ch) and then setActiveTab('watch' | 'channel') in the same
  // click handler; this carries the picked channel to that navigation before state re-renders.
  const pendingChannelRef = useRef<StreamChannel | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theaterMode, setTheaterMode] = useState(false);
  const [pipActive, setPipActive] = useState(false);
  const [coins, setCoins] = useState<number>(2450);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  // Streamer area state lives here so a live stream keeps running while browsing other pages
  const studio = useStudioState(userProfile);
  const [followedIds, setFollowedIds] = useState<string[]>([
    'mixi-gaming',
    'linh-idol-pk',
    'tech-shop-live',
    'valorant-vct',
  ]);
  const [cartItems, setCartItems] = useState<{ product: LiveProduct; qty: number }[]>([
    { product: LIVE_PRODUCTS[0], qty: 1 },
  ]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', brandTheme);
    writeSetting(THEME_KEY, brandTheme);
  }, [brandTheme]);

  // A new page starts at the top; Back/Forward (POP) keeps the browser's own scroll restoration
  useEffect(() => {
    if (navigationType !== 'POP') window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname, navigationType]);

  const pageTitle = titleOf(route);
  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  const go = (to: string) => navigate(to, { replace: to === location.pathname });

  const selectChannel = (ch: StreamChannel) => {
    setLastChannel(ch);
    setPipActive(false);
    pendingChannelRef.current = ch;
    queueMicrotask(() => {
      pendingChannelRef.current = null;
    });
  };

  const setActiveTab = (tab: ActiveTab) => {
    const channel = pendingChannelRef.current ?? selectedChannel;
    pendingChannelRef.current = null;
    if (tab === 'watch') setPipActive(false);
    switch (tab) {
      case 'home':
        return go(paths.home());
      case 'watch':
        return go(paths.watch(channel.id));
      case 'channel':
        return go(paths.channel(channel.id));
      case 'wallet':
        return go(paths.wallet());
      case 'account':
        return go(paths.account());
      case 'studio':
        return go(paths.studio());
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
    writeSetting(LANGUAGE_KEY, language);
  }, [language]);

  const toggleFollow = (id: string) => {
    setFollowedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddToCart = (product: LiveProduct) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const handleEnablePiP = () => {
    setLastChannel(selectedChannel);
    setPipActive(true);
    go(paths.home());
  };

  return (
    <div className="min-h-screen bg-[#0E0E12] text-[#F4F4F6] flex flex-col">
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab ?? 'home'}
        setActiveTab={setActiveTab}
        brandTheme={brandTheme}
        setBrandTheme={setBrandTheme}
        coins={coins}
        onSelectChannel={selectChannel}
        cartCount={cartItems.reduce((acc, item) => acc + item.qty, 0)}
        userAvatar={userProfile.avatar}
        language={language}
        setLanguage={setLanguage}
      />

      {/* Main Content Layout: Collapsible Left Sidebar + Active View */}
      <div className="flex-1 flex overflow-clip">
        {activeTab !== 'account' && activeTab !== 'studio' && !(activeTab === 'watch' && theaterMode) && (
          <Sidebar
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
            selectedChannel={selectedChannel}
            onSelectChannel={selectChannel}
            setActiveTab={setActiveTab}
            followedIds={followedIds}
          />
        )}

        {activeTab === 'home' && (
          <HomeView
            onSelectChannel={selectChannel}
            setActiveTab={setActiveTab}
            brandTheme={brandTheme}
          />
        )}

        {activeTab === 'watch' && (
          <WatchRoomView
            // A different channel is a different room: fresh chat, player and panel state
            key={selectedChannel.id}
            channel={selectedChannel}
            theaterMode={theaterMode}
            setTheaterMode={setTheaterMode}
            coins={coins}
            setCoins={setCoins}
            followedIds={followedIds}
            toggleFollow={toggleFollow}
            onEnablePiP={handleEnablePiP}
            setActiveTab={setActiveTab}
            brandTheme={brandTheme}
            onAddToCart={handleAddToCart}
            cartItems={cartItems}
          />
        )}

        {route.page === 'studio' && (
          <StreamerStudioView
            studio={studio}
            setActiveTab={setActiveTab}
            section={route.section}
            onSectionChange={(section) => go(paths.studio(section))}
          />
        )}

        {activeTab === 'channel' && (
          <ChannelProfileView
            channel={selectedChannel}
            followedIds={followedIds}
            toggleFollow={toggleFollow}
            setActiveTab={setActiveTab}
            brandTheme={brandTheme}
          />
        )}

        {activeTab === 'wallet' && (
          <WalletView
            coins={coins}
            setCoins={setCoins}
            cartItems={cartItems}
            onClearCart={() => setCartItems([])}
            setActiveTab={setActiveTab}
          />
        )}

        {route.page === 'account' && (
          <AccountView
            profile={userProfile}
            onSaveProfile={setUserProfile}
            coins={coins}
            followedIds={followedIds}
            toggleFollow={toggleFollow}
            onSelectChannel={selectChannel}
            setActiveTab={setActiveTab}
            section={route.section}
            onSectionChange={(section) => go(paths.account(section))}
          />
        )}

        {route.page === 'notfound' && <NotFoundView onGoHome={() => go(paths.home())} />}
      </div>

      {/* FLOATING MINI-PLAYER (Picture-in-Picture Mode when browsing outside Watch Room) */}
      {pipActive && activeTab !== 'watch' && (
        <div className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] right-5 z-50 w-72 sm:w-80 rounded-2xl overflow-hidden bg-[#161622] border border-white/20 shadow-2xl">
          <div className="relative aspect-video bg-black">
            <img
              src={selectedChannel.thumbnail}
              alt={selectedChannel.title}
              className="w-full h-full object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-red-600 text-[10px] font-extrabold text-white flex items-center gap-1">
              <Radio className="w-2.5 h-2.5" /> MINI-PLAYER
            </span>
            <div className="absolute top-2 right-2 flex items-center gap-1">
              <button
                onClick={() => {
                  setPipActive(false);
                  setActiveTab('watch');
                }}
                className="p-1.5 rounded-lg bg-black/70 hover:bg-black text-white cursor-pointer"
                title="Phóng to về Phòng Live"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setPipActive(false)}
                className="p-1.5 rounded-lg bg-black/70 hover:bg-red-600 text-white cursor-pointer"
                title="Đóng Mini-player"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between">
              <span className="text-xs font-extrabold text-white truncate">
                {selectedChannel.name}
              </span>
              <span className="text-[11px] font-bold text-red-400 tabular-nums">
                ● {(selectedChannel.viewers / 1000).toFixed(1)}K
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
