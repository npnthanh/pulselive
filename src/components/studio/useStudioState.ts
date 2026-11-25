import { useCallback, useEffect, useState } from 'react';
import type { UserProfile } from '../../data/accountData';
import {
  INITIAL_CLIPS,
  INITIAL_FOLLOWERS,
  INITIAL_VODS,
  LIVE_CHAT_POOL,
  LIVE_GIFTS,
  type Clip,
  type Follower,
  type Vod,
} from '../../data/studioData';
import { STREAM_CHANNELS } from '../../data/mockData';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface StreamInfo {
  title: string;
  category: string;
  tags: string[];
}

export interface LiveStats {
  viewers: number;
  peakViewers: number;
  coins: number;
  newSubs: number;
  newFollowers: number;
}

export type FeedKind = 'follow' | 'gift' | 'sub';

export interface FeedEvent {
  id: string;
  kind: FeedKind;
  user: string;
  text: string;
  at: Date;
}

export interface StudioChatMessage {
  id: string;
  user: string;
  color: string;
  text: string;
  at: Date;
  isStreamer?: boolean;
}

export interface Prediction {
  question: string;
  outcomes: { label: string; points: number; voters: number }[];
  endsAt: number;
  status: 'open' | 'locked' | 'resolved';
  winner: number | null;
}

export interface Poll {
  question: string;
  options: { label: string; votes: number }[];
  endsAt: number;
  status: 'open' | 'ended';
}

export interface ChannelSettings {
  displayName: string;
  handle: string;
  bio: string;
  avatar: string;
  banner: string;
  defaultCategory: string;
  socials: { facebook: string; youtube: string; tiktok: string };
  slowMode: boolean;
  followersOnly: boolean;
  wordFilter: boolean;
  notifyOnLive: boolean;
}

const EMPTY_STATS: LiveStats = { viewers: 0, peakViewers: 0, coins: 0, newSubs: 0, newFollowers: 0 };

export const BANNER_OPTIONS = STREAM_CHANNELS.map((c) => c.thumbnail);

/* ------------------------------------------------------------------ */
/* Clock hook                                                          */
/* ------------------------------------------------------------------ */

/** Current timestamp, refreshed every `intervalMs` while `active`. */
export function useNow(active: boolean, intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return;
    const tick = () => setNow(Date.now());
    const id = setInterval(tick, intervalMs);
    const kickoff = setTimeout(tick, 0);
    return () => {
      clearInterval(id);
      clearTimeout(kickoff);
    };
  }, [active, intervalMs]);
  return now;
}

/* ------------------------------------------------------------------ */
/* Studio state                                                        */
/* ------------------------------------------------------------------ */

const rnd = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
const pickOne = <T,>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)];
const uid = (prefix: string) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;

export function useStudioState(profile: UserProfile) {
  const [settings, setSettings] = useState<ChannelSettings>(() => ({
    displayName: profile.name,
    handle: 'minhkhang.live',
    bio: 'Stream VALORANT, talkshow đêm khuya và thỉnh thoảng đi ăn đêm Sài Gòn. Lịch live: 21:00 mỗi tối.',
    avatar: profile.avatar,
    banner: BANNER_OPTIONS[0],
    defaultCategory: 'Just Chatting',
    socials: { facebook: 'facebook.com/minhkhang.live', youtube: '', tiktok: '@minhkhang.live' },
    slowMode: false,
    followersOnly: false,
    wordFilter: true,
    notifyOnLive: true,
  }));

  const [streamInfo, setStreamInfo] = useState<StreamInfo>({
    title: 'Giao lưu cùng anh em — tối nay chơi gì?',
    category: 'Just Chatting',
    tags: ['Tiếng Việt', 'Talkshow'],
  });

  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [stats, setStats] = useState<LiveStats>(EMPTY_STATS);
  const [feed, setFeed] = useState<FeedEvent[]>([]);
  const [chat, setChat] = useState<StudioChatMessage[]>([]);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [poll, setPoll] = useState<Poll | null>(null);
  const [slowMode, setSlowMode] = useState(false);
  const [followersOnly, setFollowersOnly] = useState(false);
  const [vods, setVods] = useState<Vod[]>(INITIAL_VODS);
  const [clips, setClips] = useState<Clip[]>(INITIAL_CLIPS);
  const [followers, setFollowers] = useState<Follower[]>(INITIAL_FOLLOWERS);

  const isLive = startedAt !== null;

  /* Live simulation: viewers, chat, follows, gifts, prediction/poll votes */
  useEffect(() => {
    if (startedAt === null) return;

    const id = setInterval(() => {
      const minutes = (Date.now() - startedAt) / 60_000;
      const target = Math.min(2600, 600 + minutes * 40);

      setStats((s) => {
        const viewers = Math.max(1, Math.round(s.viewers + (target - s.viewers) * 0.15 + rnd(-15, 20)));
        return { ...s, viewers, peakViewers: Math.max(s.peakViewers, viewers) };
      });

      if (Math.random() < 0.4) {
        const m = pickOne(LIVE_CHAT_POOL);
        setChat((c) => [...c.slice(-99), { id: uid('m'), user: m.user, color: m.color, text: m.text, at: new Date() }]);
      }

      const roll = Math.random();
      if (roll < 0.16) {
        const user = pickOne(LIVE_CHAT_POOL).user;
        setStats((s) => ({ ...s, newFollowers: s.newFollowers + 1 }));
        setFeed((f) => [{ id: uid('e'), kind: 'follow' as const, user, text: 'vừa theo dõi kênh', at: new Date() }, ...f].slice(0, 50));
      } else if (roll < 0.28) {
        const user = pickOne(LIVE_CHAT_POOL).user;
        const gift = pickOne(LIVE_GIFTS);
        const qty = gift.price <= 50 ? pickOne([1, 1, 10]) : 1;
        setStats((s) => ({ ...s, coins: s.coins + gift.price * qty }));
        setFeed((f) =>
          [{ id: uid('e'), kind: 'gift' as const, user, text: `tặng ${gift.emoji} ${gift.name} x${qty}`, at: new Date() }, ...f].slice(0, 50)
        );
      } else if (roll < 0.32) {
        const user = pickOne(LIVE_CHAT_POOL).user;
        setStats((s) => ({ ...s, newSubs: s.newSubs + 1 }));
        setFeed((f) => [{ id: uid('e'), kind: 'sub' as const, user, text: 'đăng ký hội viên', at: new Date() }, ...f].slice(0, 50));
      }

      setPrediction((p) => {
        if (!p || p.status !== 'open') return p;
        if (Date.now() >= p.endsAt) return { ...p, status: 'locked' };
        const idx = rnd(0, p.outcomes.length - 1);
        return {
          ...p,
          outcomes: p.outcomes.map((o, i) =>
            i === idx ? { ...o, points: o.points + rnd(50, 900), voters: o.voters + rnd(1, 6) } : o
          ),
        };
      });

      setPoll((p) => {
        if (!p || p.status !== 'open') return p;
        if (Date.now() >= p.endsAt) return { ...p, status: 'ended' };
        return { ...p, options: p.options.map((o) => ({ ...o, votes: o.votes + rnd(0, 7) })) };
      });
    }, 2000);

    return () => clearInterval(id);
  }, [startedAt]);

  /* ---------------- Actions ---------------- */

  const goLive = useCallback(
    (info: StreamInfo) => {
      setStreamInfo(info);
      setStats(EMPTY_STATS);
      setFeed([]);
      setChat([]);
      setPrediction(null);
      setPoll(null);
      setSlowMode(settings.slowMode);
      setFollowersOnly(settings.followersOnly);
      setStartedAt(Date.now());
    },
    [settings.slowMode, settings.followersOnly]
  );

  /** Ends the stream and saves the session as a recording. Returns the new recording. */
  const endLive = useCallback((): Vod | null => {
    if (startedAt === null) return null;
    const durationSec = Math.max(1, Math.floor((Date.now() - startedAt) / 1000));
    const vod: Vod = {
      id: uid('v'),
      title: streamInfo.title,
      category: streamInfo.category,
      startedAt: new Date(startedAt),
      durationSec,
      views: Math.max(stats.peakViewers, Math.round(stats.peakViewers * 2.6)),
      peakViewers: stats.peakViewers,
      thumbnail: settings.banner,
    };
    setVods((v) => [vod, ...v]);
    setStartedAt(null);
    setStats(EMPTY_STATS);
    setPrediction(null);
    setPoll(null);
    return vod;
  }, [startedAt, streamInfo, stats.peakViewers, settings.banner]);

  const startPrediction = useCallback((question: string, outcomes: string[], durationSec: number) => {
    setPrediction({
      question,
      outcomes: outcomes.map((label) => ({ label, points: 0, voters: 0 })),
      endsAt: Date.now() + durationSec * 1000,
      status: 'open',
      winner: null,
    });
  }, []);

  const lockPrediction = useCallback(() => {
    setPrediction((p) => (p && p.status === 'open' ? { ...p, status: 'locked' } : p));
  }, []);

  /** Picks the winning outcome. */
  const resolvePrediction = useCallback((winner: number) => {
    setPrediction((p) => (p ? { ...p, status: 'resolved', winner } : p));
  }, []);

  /** Cancels (points refunded) or dismisses a finished prediction. */
  const clearPrediction = useCallback(() => setPrediction(null), []);

  const startPoll = useCallback((question: string, options: string[], durationSec: number) => {
    setPoll({
      question,
      options: options.map((label) => ({ label, votes: 0 })),
      endsAt: Date.now() + durationSec * 1000,
      status: 'open',
    });
  }, []);

  const endPoll = useCallback(() => {
    setPoll((p) => (p && p.status === 'open' ? { ...p, status: 'ended' } : p));
  }, []);

  const clearPoll = useCallback(() => setPoll(null), []);

  const sendChat = useCallback(
    (text: string) => {
      setChat((c) => [
        ...c.slice(-99),
        { id: uid('m'), user: settings.displayName, color: '#C4B5FD', text, at: new Date(), isStreamer: true },
      ]);
    },
    [settings.displayName]
  );

  const addClip = useCallback((clip: Omit<Clip, 'id' | 'createdAt' | 'views'>) => {
    const created: Clip = { ...clip, id: uid('c'), createdAt: new Date(), views: 0 };
    setClips((c) => [created, ...c]);
    return created;
  }, []);

  /** Clips the last 30 seconds of the current live stream. */
  const clipLive = useCallback(() => {
    if (startedAt === null) return null;
    const elapsed = Math.floor((Date.now() - startedAt) / 1000);
    return addClip({
      title: `Khoảnh khắc ${streamInfo.title}`.slice(0, 80),
      sourceTitle: `${streamInfo.title} (đang live)`,
      startSec: Math.max(0, elapsed - 30),
      durationSec: Math.min(30, Math.max(1, elapsed)),
      thumbnail: settings.banner,
    });
  }, [startedAt, streamInfo.title, settings.banner, addClip]);

  const deleteVod = useCallback((id: string) => setVods((v) => v.filter((x) => x.id !== id)), []);
  const deleteClip = useCallback((id: string) => setClips((c) => c.filter((x) => x.id !== id)), []);

  const toggleMod = useCallback(
    (id: string) => setFollowers((f) => f.map((x) => (x.id === id ? { ...x, isMod: !x.isMod } : x))),
    []
  );
  const removeFollower = useCallback((id: string) => setFollowers((f) => f.filter((x) => x.id !== id)), []);
  const restoreFollower = useCallback(
    (follower: Follower) => setFollowers((f) => (f.some((x) => x.id === follower.id) ? f : [...f, follower])),
    []
  );

  return {
    settings,
    saveSettings: setSettings,
    streamInfo,
    updateStreamInfo: setStreamInfo,
    isLive,
    startedAt,
    stats,
    feed,
    chat,
    prediction,
    poll,
    slowMode,
    setSlowMode,
    followersOnly,
    setFollowersOnly,
    vods,
    clips,
    followers,
    goLive,
    endLive,
    startPrediction,
    lockPrediction,
    resolvePrediction,
    clearPrediction,
    startPoll,
    endPoll,
    clearPoll,
    sendChat,
    addClip,
    clipLive,
    deleteVod,
    deleteClip,
    toggleMod,
    removeFollower,
    restoreFollower,
  };
}

export type StudioState = ReturnType<typeof useStudioState>;
