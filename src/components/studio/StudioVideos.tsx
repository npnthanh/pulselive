import React, { useEffect, useState } from 'react';
import { Download, Scissors, Trash2, Link2, Check, Film, Clapperboard, Eye, Loader2 } from 'lucide-react';
import type { StudioState } from './useStudioState';
import { useNow } from './useStudioState';
import { Modal, Field, SectionTitle, EmptyState } from './studioUi';
import { cardCls, inputCls, btnGhostCls, btnPrimaryCls, btnDangerCls, SERIES_COLOR } from './styles';
import { formatCompact, formatDate, formatDuration, timeAgo } from './format';
import type { Clip, Vod } from '../../data/studioData';

type Tab = 'vods' | 'clips';
type DownloadState = Record<string, number>; // 0–100, 100 = done

const MIN_CLIP = 5;
const MAX_CLIP = 180;

export const StudioVideos: React.FC<{ studio: StudioState }> = ({ studio }) => {
  const { vods, clips } = studio;
  const now = useNow(true, 60_000);
  const [tab, setTab] = useState<Tab>('vods');
  const [downloads, setDownloads] = useState<DownloadState>({});
  const [trimming, setTrimming] = useState<Vod | null>(null);
  const [deleting, setDeleting] = useState<{ kind: Tab; id: string; title: string } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Simulated downloads progress
  const inProgress = Object.values(downloads).some((p) => p < 100);
  useEffect(() => {
    if (!inProgress) return;
    const id = setInterval(() => {
      setDownloads((d) => {
        const next: DownloadState = {};
        for (const [k, p] of Object.entries(d)) next[k] = p >= 100 ? 100 : Math.min(100, p + 8 + Math.random() * 14);
        return next;
      });
    }, 250);
    return () => clearInterval(id);
  }, [inProgress]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const startDownload = (id: string) => setDownloads((d) => (id in d ? d : { ...d, [id]: 0 }));

  const copyLink = async (clip: Clip) => {
    try {
      await navigator.clipboard.writeText(`https://pulselive.vn/clip/${clip.id}`);
      setToast('Đã sao chép link clip');
    } catch {
      setToast('Không thể truy cập bộ nhớ tạm');
    }
  };

  return (
    <div className="space-y-6">
      <SectionTitle title="Video & clip" description="Bản ghi tự động của mỗi buổi live và những clip bạn đã cắt." />

      <div className="inline-flex p-1 rounded-xl bg-white/5 border border-white/8">
        {(
          [
            ['vods', 'Bản ghi buổi live', vods.length, Film],
            ['clips', 'Clip', clips.length, Clapperboard],
          ] as const
        ).map(([id, label, count, Icon]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            aria-pressed={tab === id}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              tab === id ? 'bg-white text-slate-950' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Icon className="w-3.5 h-3.5" /> {label} <span className="opacity-60 tabular-nums">{count}</span>
          </button>
        ))}
      </div>

      {tab === 'vods' &&
        (vods.length === 0 ? (
          <div className={cardCls}>
            <EmptyState icon={<Film className="w-6 h-6" />} title="Chưa có bản ghi nào" text="Mỗi buổi live kết thúc sẽ tự động được lưu tại đây." />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4">
            {vods.map((v) => (
              <article key={v.id} className={`${cardCls} overflow-hidden flex flex-col`}>
                <Thumb src={v.thumbnail} duration={v.durationSec} />
                <div className="p-4 flex-1 flex flex-col gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-white line-clamp-2">{v.title}</h3>
                    <p className="text-[11px] text-zinc-500 mt-1">
                      {formatDate(v.startedAt)} · {v.category} · <Eye className="inline w-3 h-3 -mt-0.5" /> {formatCompact(v.views)}
                    </p>
                  </div>
                  <div className="mt-auto flex flex-wrap gap-2">
                    <DownloadButton progress={downloads[v.id]} onClick={() => startDownload(v.id)} />
                    <button onClick={() => setTrimming(v)} className={`${btnGhostCls} px-3`}>
                      <Scissors className="w-3.5 h-3.5" /> Cắt clip
                    </button>
                    <button
                      onClick={() => setDeleting({ kind: 'vods', id: v.id, title: v.title })}
                      className={`${btnGhostCls} px-2.5 ml-auto hover:text-rose-300`}
                      aria-label={`Xóa bản ghi ${v.title}`}
                      title="Xóa bản ghi"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ))}

      {tab === 'clips' &&
        (clips.length === 0 ? (
          <div className={cardCls}>
            <EmptyState
              icon={<Clapperboard className="w-6 h-6" />}
              title="Chưa có clip nào"
              text="Cắt clip từ bản ghi, hoặc bấm “Tạo clip 30 giây” khi đang live."
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4">
            {clips.map((c) => (
              <article key={c.id} className={`${cardCls} overflow-hidden flex flex-col`}>
                <Thumb src={c.thumbnail} duration={c.durationSec} />
                <div className="p-4 flex-1 flex flex-col gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-white line-clamp-2">{c.title}</h3>
                    <p className="text-[11px] text-zinc-500 mt-1 line-clamp-1" title={c.sourceTitle}>
                      Từ: {c.sourceTitle} · phút {formatDuration(c.startSec)}
                    </p>
                    <p className="text-[11px] text-zinc-500">
                      {timeAgo(c.createdAt, now)} · {formatCompact(c.views)} lượt xem
                    </p>
                  </div>
                  <div className="mt-auto flex flex-wrap gap-2">
                    <DownloadButton progress={downloads[c.id]} onClick={() => startDownload(c.id)} />
                    <button onClick={() => copyLink(c)} className={`${btnGhostCls} px-3`}>
                      <Link2 className="w-3.5 h-3.5" /> Sao chép link
                    </button>
                    <button
                      onClick={() => setDeleting({ kind: 'clips', id: c.id, title: c.title })}
                      className={`${btnGhostCls} px-2.5 ml-auto hover:text-rose-300`}
                      aria-label={`Xóa clip ${c.title}`}
                      title="Xóa clip"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ))}

      {trimming && (
        <TrimModal
          vod={trimming}
          onClose={() => setTrimming(null)}
          onCreate={(title, startSec, durationSec) => {
            studio.addClip({ title, sourceTitle: trimming.title, startSec, durationSec, thumbnail: trimming.thumbnail });
            setTrimming(null);
            setTab('clips');
            setToast('Đã tạo clip mới');
          }}
        />
      )}

      <Modal
        open={deleting !== null}
        title={deleting?.kind === 'vods' ? 'Xóa bản ghi?' : 'Xóa clip?'}
        onClose={() => setDeleting(null)}
        footer={
          <>
            <button onClick={() => setDeleting(null)} className={btnGhostCls}>
              Hủy
            </button>
            <button
              onClick={() => {
                if (!deleting) return;
                if (deleting.kind === 'vods') studio.deleteVod(deleting.id);
                else studio.deleteClip(deleting.id);
                setDeleting(null);
              }}
              className={btnDangerCls}
            >
              <Trash2 className="w-3.5 h-3.5" /> Xóa vĩnh viễn
            </button>
          </>
        }
      >
        <p className="text-sm text-zinc-300">
          “<strong className="text-white">{deleting?.title}</strong>” sẽ bị xóa vĩnh viễn và không thể khôi phục.
        </p>
      </Modal>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] px-4 py-2.5 rounded-xl bg-[#1C1C28] border border-white/15 shadow-2xl text-xs font-semibold text-white flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" /> {toast}
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */

const Thumb: React.FC<{ src: string; duration: number }> = ({ src, duration }) => (
  <div className="relative aspect-video bg-black">
    <img src={src} alt="" className="w-full h-full object-cover" />
    <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[11px] font-semibold text-white tabular-nums">
      {formatDuration(duration)}
    </span>
  </div>
);

const DownloadButton: React.FC<{ progress: number | undefined; onClick: () => void }> = ({ progress, onClick }) => {
  if (progress === undefined)
    return (
      <button onClick={onClick} className={`${btnGhostCls} px-3`}>
        <Download className="w-3.5 h-3.5" /> Tải về
      </button>
    );
  if (progress >= 100)
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/25">
        <Check className="w-3.5 h-3.5" /> Đã tải về
      </span>
    );
  return (
    <span
      className="relative overflow-hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-zinc-200 bg-white/6 border border-white/10 tabular-nums"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span className="absolute inset-y-0 left-0 bg-white/10 transition-all" style={{ width: `${progress}%` }} />
      <Loader2 className="relative w-3.5 h-3.5 animate-spin" />
      <span className="relative">Đang tải {Math.round(progress)}%</span>
    </span>
  );
};

const TrimModal: React.FC<{
  vod: Vod;
  onClose: () => void;
  onCreate: (title: string, startSec: number, durationSec: number) => void;
}> = ({ vod, onClose, onCreate }) => {
  const maxLen = Math.min(MAX_CLIP, vod.durationSec);
  const [start, setStart] = useState(Math.max(0, Math.floor(vod.durationSec / 2) - 15));
  const [length, setLength] = useState(Math.min(30, maxLen));
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  const maxStart = Math.max(0, vod.durationSec - length);
  const clampedStart = Math.min(start, maxStart);
  const end = clampedStart + length;
  const pct = (s: number) => (s / vod.durationSec) * 100;

  const submit = () => {
    const t = title.trim();
    if (t.length < 3) return setError('Đặt tên clip ít nhất 3 ký tự.');
    onCreate(t, clampedStart, length);
  };

  return (
    <Modal
      open
      wide
      title="Cắt clip từ bản ghi"
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className={btnGhostCls}>
            Hủy
          </button>
          <button onClick={submit} className={btnPrimaryCls}>
            <Scissors className="w-3.5 h-3.5" /> Tạo clip
          </button>
        </>
      }
    >
      <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
        <img src={vod.thumbnail} alt="" className="w-full h-full object-cover opacity-80" />
        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-xs font-semibold text-white tabular-nums">
          {formatDuration(clampedStart)} → {formatDuration(end)}
        </span>
      </div>
      <p className="text-[11px] text-zinc-500 -mt-1 line-clamp-1">Bản ghi: {vod.title}</p>

      {/* Timeline */}
      <div>
        <div className="relative h-3 rounded-full bg-white/8 overflow-hidden" aria-hidden="true">
          <div
            className="absolute inset-y-0 rounded-full"
            style={{ left: `${pct(clampedStart)}%`, width: `max(4px, ${pct(length)}%)`, background: SERIES_COLOR }}
          />
        </div>
        <div className="flex justify-between mt-1 text-[10px] text-zinc-500 tabular-nums">
          <span>0:00</span>
          <span>{formatDuration(vod.durationSec)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label={`Bắt đầu: ${formatDuration(clampedStart)}`}>
          <input
            type="range"
            min={0}
            max={maxStart}
            value={clampedStart}
            onChange={(e) => setStart(Number(e.target.value))}
            className="w-full accent-(--brand) cursor-pointer"
          />
        </Field>
        <Field label={`Độ dài: ${length} giây`} hint={`Từ ${MIN_CLIP} giây đến ${Math.floor(maxLen / 60)} phút`}>
          <input
            type="range"
            min={Math.min(MIN_CLIP, maxLen)}
            max={maxLen}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-(--brand) cursor-pointer"
          />
        </Field>
      </div>

      <Field label="Tên clip" error={error ?? undefined} hint={`${title.length}/80`}>
        <input
          autoFocus
          value={title}
          maxLength={80}
          onChange={(e) => {
            setTitle(e.target.value);
            setError(null);
          }}
          className={inputCls}
          placeholder="VD: Pha clutch 1 vs 3 cuối hiệp"
        />
      </Field>
    </Modal>
  );
};
