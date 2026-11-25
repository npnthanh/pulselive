import React, { useState } from 'react';
import { Radio, Check, X } from 'lucide-react';
import { Modal, Field, Toggle } from './studioUi';
import { inputCls, btnGhostCls, btnPrimaryCls } from './styles';
import { STUDIO_CATEGORIES } from '../../data/studioData';
import type { StreamInfo } from './useStudioState';

const MAX_TAGS = 5;

/** Render conditionally (`{open && <StreamInfoModal/>}`) so the draft resets on every open. */
export const StreamInfoModal: React.FC<{
  mode: 'golive' | 'edit';
  initial: StreamInfo;
  notifyDefault?: boolean;
  onClose: () => void;
  onSubmit: (info: StreamInfo) => void;
}> = ({ mode, initial, notifyDefault = true, onClose, onSubmit }) => {
  const [title, setTitle] = useState(initial.title);
  const [category, setCategory] = useState(initial.category);
  const [tags, setTags] = useState<string[]>(initial.tags);
  const [tagInput, setTagInput] = useState('');
  const [notify, setNotify] = useState(notifyDefault);
  const [error, setError] = useState<string | null>(null);

  const addTag = () => {
    const t = tagInput.trim().replace(/^#/, '');
    if (!t || tags.length >= MAX_TAGS || tags.some((x) => x.toLowerCase() === t.toLowerCase())) {
      setTagInput('');
      return;
    }
    setTags([...tags, t.slice(0, 20)]);
    setTagInput('');
  };

  const submit = () => {
    const cleanTitle = title.trim().replace(/\s+/g, ' ');
    if (cleanTitle.length < 5) {
      setError('Tiêu đề cần ít nhất 5 ký tự.');
      return;
    }
    onSubmit({ title: cleanTitle, category, tags });
  };

  return (
    <Modal
      open
      title={mode === 'golive' ? 'Thiết lập buổi livestream' : 'Chỉnh thông tin stream'}
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className={btnGhostCls}>
            Hủy
          </button>
          {mode === 'golive' ? (
            <button
              onClick={submit}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-red-600 to-rose-500 hover:brightness-110 shadow-lg transition-all cursor-pointer"
            >
              <Radio className="w-3.5 h-3.5" /> Bắt đầu phát
            </button>
          ) : (
            <button onClick={submit} className={btnPrimaryCls}>
              <Check className="w-3.5 h-3.5" /> Lưu thay đổi
            </button>
          )}
        </>
      }
    >
      <Field label="Tiêu đề buổi live" hint={`${title.length}/100 ký tự`} error={error ?? undefined}>
        <input
          autoFocus
          value={title}
          maxLength={100}
          onChange={(e) => {
            setTitle(e.target.value);
            setError(null);
          }}
          className={inputCls}
          placeholder="VD: Leo rank cùng anh em tối thứ 6"
        />
      </Field>

      <Field label="Danh mục">
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={`${inputCls} [color-scheme:dark] cursor-pointer`}>
          {STUDIO_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Thẻ tag" hint={`Nhấn Enter để thêm · tối đa ${MAX_TAGS} thẻ`}>
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-[#1C1C28] border border-white/10 focus-within:border-white/30">
          {tags.map((t) => (
            <span key={t} className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 rounded-lg bg-white/8 text-xs text-zinc-200">
              #{t}
              <button
                type="button"
                onClick={() => setTags(tags.filter((x) => x !== t))}
                className="p-0.5 rounded hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer"
                aria-label={`Xóa thẻ ${t}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {tags.length < MAX_TAGS && (
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault();
                  addTag();
                } else if (e.key === 'Backspace' && !tagInput && tags.length) {
                  setTags(tags.slice(0, -1));
                }
              }}
              onBlur={addTag}
              className="flex-1 min-w-24 bg-transparent px-1.5 py-1 text-sm text-white placeholder-zinc-500 focus:outline-none"
              placeholder="Thêm thẻ…"
            />
          )}
        </div>
      </Field>

      {mode === 'golive' && (
        <div className="pt-1">
          <Toggle
            checked={notify}
            onChange={setNotify}
            label="Thông báo cho người theo dõi"
            description="Gửi thông báo đẩy khi bạn bắt đầu phát."
          />
        </div>
      )}
    </Modal>
  );
};
