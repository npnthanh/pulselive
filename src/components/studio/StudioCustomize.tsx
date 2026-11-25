import React, { useEffect, useState } from 'react';
import { Check, Image as ImageIcon, MessageSquare, Share2, UserRound, Tag } from 'lucide-react';
import type { ChannelSettings, StudioState } from './useStudioState';
import { BANNER_OPTIONS } from './useStudioState';
import { Field, SectionTitle, Toggle } from './studioUi';
import { cardCls, inputCls, btnGhostCls, btnPrimaryCls } from './styles';
import { formatNumber } from './format';
import { STUDIO_CATEGORIES, TOTAL_FOLLOWER_COUNT } from '../../data/studioData';

type Errors = Partial<Record<'displayName' | 'handle' | 'bio', string>>;

const validate = (s: ChannelSettings): Errors => {
  const e: Errors = {};
  if (s.displayName.trim().length < 2) e.displayName = 'Tên kênh cần ít nhất 2 ký tự.';
  if (!/^[a-z0-9._]{3,24}$/.test(s.handle)) e.handle = '3–24 ký tự: chữ thường không dấu, số, dấu chấm hoặc gạch dưới.';
  if (s.bio.length > 300) e.bio = 'Giới thiệu tối đa 300 ký tự.';
  return e;
};

const CardHeader: React.FC<{ icon: React.ReactNode; title: string; text?: string }> = ({ icon, title, text }) => (
  <div className="flex items-start gap-2.5 mb-4">
    <span className="p-1.5 rounded-lg bg-white/6 text-zinc-300">{icon}</span>
    <div>
      <h3 className="text-sm font-bold text-white">{title}</h3>
      {text && <p className="text-[11px] text-zinc-500 mt-0.5">{text}</p>}
    </div>
  </div>
);

export const StudioCustomize: React.FC<{ studio: StudioState }> = ({ studio }) => {
  const [draft, setDraft] = useState<ChannelSettings>(studio.settings);
  const [errors, setErrors] = useState<Errors>({});
  const [saved, setSaved] = useState(false);
  const dirty = JSON.stringify(draft) !== JSON.stringify(studio.settings);

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 2200);
    return () => clearTimeout(t);
  }, [saved]);

  const set = <K extends keyof ChannelSettings>(key: K, value: ChannelSettings[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    if (key in errors) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const save = () => {
    const cleaned = { ...draft, displayName: draft.displayName.trim().replace(/\s+/g, ' '), bio: draft.bio.trim() };
    const found = validate(cleaned);
    setErrors(found);
    if (Object.values(found).some(Boolean)) return;
    studio.saveSettings(cleaned);
    setDraft(cleaned);
    setSaved(true);
  };

  return (
    <div className="space-y-6 pb-20">
      <SectionTitle
        title="Tùy chỉnh"
        description="Thiết lập thông tin và cài đặt mặc định của kênh."
        action={
          saved && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
              <Check className="w-3.5 h-3.5" /> Đã lưu thay đổi
            </span>
          )
        }
      />

      {/* Live preview */}
      <div className={`${cardCls} overflow-hidden`}>
        <div className="relative h-32 sm:h-40 bg-black">
          <img src={draft.banner} alt="" className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#15151E] to-transparent" />
          <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/60 text-[10px] font-bold uppercase tracking-wider text-zinc-300">
            Xem trước
          </span>
        </div>
        <div className="px-5 pb-5 -mt-8 relative flex items-end gap-4">
          <img src={draft.avatar} alt="" className="w-16 h-16 rounded-2xl object-cover ring-4 ring-[#15151E]" />
          <div className="min-w-0 pb-1">
            <p className="text-base font-extrabold text-white truncate">{draft.displayName || 'Tên kênh'}</p>
            <p className="text-xs text-zinc-400">
              @{draft.handle || 'handle'} · {formatNumber(TOTAL_FOLLOWER_COUNT)} người theo dõi
            </p>
          </div>
        </div>
        {draft.bio && <p className="px-5 pb-5 -mt-2 text-xs text-zinc-300 leading-relaxed">{draft.bio}</p>}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-start">
        <div className={`${cardCls} p-5 space-y-4`}>
          <CardHeader icon={<UserRound className="w-4 h-4" />} title="Hồ sơ kênh" />
          <Field label="Tên kênh" error={errors.displayName}>
            <input value={draft.displayName} maxLength={40} onChange={(e) => set('displayName', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Handle" error={errors.handle} hint={`pulselive.vn/@${draft.handle}`}>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500">@</span>
              <input
                value={draft.handle}
                maxLength={24}
                onChange={(e) => set('handle', e.target.value.toLowerCase().replace(/\s/g, ''))}
                className={`${inputCls} pl-7`}
              />
            </div>
          </Field>
          <Field label="Giới thiệu kênh" error={errors.bio} hint={`${draft.bio.length}/300`}>
            <textarea
              value={draft.bio}
              maxLength={300}
              rows={4}
              onChange={(e) => set('bio', e.target.value)}
              className={`${inputCls} resize-none leading-relaxed`}
            />
          </Field>
        </div>

        <div className="space-y-4">
          <div className={`${cardCls} p-5`}>
            <CardHeader icon={<ImageIcon className="w-4 h-4" />} title="Ảnh bìa" text="Hiển thị trên đầu trang kênh và khi bạn offline." />
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Ảnh bìa">
              {BANNER_OPTIONS.map((src, i) => {
                const active = draft.banner === src;
                return (
                  <button
                    key={src}
                    role="radio"
                    aria-checked={active}
                    aria-label={`Ảnh bìa ${i + 1}`}
                    onClick={() => set('banner', src)}
                    className={`relative aspect-video rounded-lg overflow-hidden ring-2 transition cursor-pointer ${
                      active ? 'ring-(--brand)' : 'ring-transparent hover:ring-white/30'
                    }`}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    {active && (
                      <span className="absolute top-1 right-1 p-0.5 rounded-full bg-(--brand) text-white">
                        <Check className="w-3 h-3" strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className={`${cardCls} p-5`}>
            <CardHeader icon={<Tag className="w-4 h-4" />} title="Danh mục mặc định" text="Tự điền khi bạn thiết lập buổi live mới." />
            <select
              value={draft.defaultCategory}
              onChange={(e) => set('defaultCategory', e.target.value)}
              className={`${inputCls} [color-scheme:dark] cursor-pointer`}
            >
              {STUDIO_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={`${cardCls} p-5 space-y-4`}>
          <CardHeader icon={<Share2 className="w-4 h-4" />} title="Mạng xã hội" text="Hiện dưới phần giới thiệu kênh." />
          {(
            [
              ['facebook', 'Facebook', 'facebook.com/tenkenh'],
              ['youtube', 'YouTube', 'youtube.com/@tenkenh'],
              ['tiktok', 'TikTok', '@tenkenh'],
            ] as const
          ).map(([key, label, placeholder]) => (
            <Field key={key} label={label}>
              <input
                value={draft.socials[key]}
                maxLength={80}
                onChange={(e) => set('socials', { ...draft.socials, [key]: e.target.value })}
                className={inputCls}
                placeholder={placeholder}
              />
            </Field>
          ))}
        </div>

        <div className={`${cardCls} p-5`}>
          <CardHeader
            icon={<MessageSquare className="w-4 h-4" />}
            title="Chat & thông báo mặc định"
            text="Áp dụng khi bắt đầu mỗi buổi live — vẫn đổi được trong lúc live."
          />
          <div className="space-y-4 divide-y divide-white/6 [&>*:not(:first-child)]:pt-4">
            <Toggle checked={draft.slowMode} onChange={(v) => set('slowMode', v)} label="Chế độ chậm" description="Mỗi người chỉ gửi 1 tin nhắn / 10 giây." />
            <Toggle checked={draft.followersOnly} onChange={(v) => set('followersOnly', v)} label="Chỉ người theo dõi được chat" />
            <Toggle checked={draft.wordFilter} onChange={(v) => set('wordFilter', v)} label="Lọc từ ngữ thô tục" description="Tự động ẩn tin nhắn chứa từ bị chặn." />
            <Toggle checked={draft.notifyOnLive} onChange={(v) => set('notifyOnLive', v)} label="Thông báo khi lên live" description="Gửi thông báo đẩy cho người theo dõi." />
          </div>
        </div>
      </div>

      {dirty && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-xl flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-[#1C1C28]/95 backdrop-blur border border-white/15 shadow-2xl">
          <span className="text-xs font-semibold text-zinc-200">Bạn có thay đổi chưa lưu</span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setDraft(studio.settings);
                setErrors({});
              }}
              className={btnGhostCls}
            >
              Hủy thay đổi
            </button>
            <button onClick={save} className={btnPrimaryCls}>
              <Check className="w-3.5 h-3.5" /> Lưu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
