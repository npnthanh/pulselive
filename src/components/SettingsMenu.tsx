import React, { useRef, useState } from 'react';
import { Settings, Palette, Languages, ChevronRight, Check } from 'lucide-react';
import type { BrandTheme } from './Navbar';
import { useDismiss } from '../hooks/useDismiss';

export type Language = 'vi' | 'en';

const LANGUAGES: { id: Language; label: string; code: string }[] = [
  { id: 'vi', label: 'Tiếng Việt', code: 'VI' },
  { id: 'en', label: 'English', code: 'EN' },
];

const THEMES: { id: BrandTheme; label: string; hint: string; swatch: string; ring: string }[] = [
  { id: 'violet', label: 'Tím Neon', hint: 'Twitch', swatch: 'bg-violet-500', ring: 'ring-violet-400' },
  { id: 'kick', label: 'Xanh Kick', hint: 'Kick', swatch: 'bg-emerald-500', ring: 'ring-emerald-400' },
  { id: 'coral', label: 'Đỏ Coral', hint: 'TikTok', swatch: 'bg-rose-500', ring: 'ring-rose-400' },
];

interface SettingsMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brandTheme: BrandTheme;
  setBrandTheme: (theme: BrandTheme) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({
  open,
  onOpenChange,
  brandTheme,
  setBrandTheme,
  language,
  setLanguage,
}) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [langOpen, setLangOpen] = useState(false);
  const currentLanguage = LANGUAGES.find((l) => l.id === language) ?? LANGUAGES[0];

  // Close on outside press / Escape
  useDismiss(open, [rootRef], () => onOpenChange(false));

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={() => onOpenChange(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        title="Cài đặt"
        className={`p-1.5 sm:p-2 rounded-xl border transition-colors cursor-pointer ${
          open
            ? 'bg-white/10 border-white/20 text-white'
            : 'bg-[#1A1A24] hover:bg-white/10 border-white/8 text-zinc-300'
        }`}
      >
        <Settings className={`w-4 h-4 transition-transform duration-500 ${open ? 'rotate-90' : ''}`} />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Cài đặt"
          className="absolute right-0 mt-2 w-72 bg-[#181822] border border-white/12 rounded-2xl shadow-2xl p-2 z-50"
        >
          {/* Theme */}
          <p className="px-2.5 pt-1.5 pb-2 text-[11px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5" /> Màu chủ đề
          </p>
          <div className="space-y-0.5">
            {THEMES.map((t) => {
              const active = brandTheme === t.id;
              return (
                <button
                  key={t.id}
                  role="menuitemradio"
                  aria-checked={active}
                  onClick={() => setBrandTheme(t.id)}
                  className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-sm transition-colors cursor-pointer ${
                    active ? 'bg-white/8 text-white' : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full shrink-0 ${t.swatch} ring-2 ring-offset-2 ring-offset-[#181822] ${
                      active ? t.ring : 'ring-transparent'
                    }`}
                  />
                  <span className="flex-1 text-left font-semibold">{t.label}</span>
                  <span className="text-[11px] text-zinc-500">{t.hint}</span>
                  <Check className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'invisible'}`} />
                </button>
              );
            })}
          </div>

          <div className="my-2 h-px bg-white/8" />

          {/* Language */}
          <button
            onClick={() => setLangOpen(!langOpen)}
            aria-expanded={langOpen}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
              langOpen ? 'bg-(--brand) text-white' : 'text-zinc-200 hover:bg-(--brand) hover:text-white'
            }`}
          >
            <Languages className="w-5 h-5 shrink-0" />
            <span className="flex-1 text-left">Ngôn Ngữ</span>
            <span className="text-xs font-medium opacity-70">{currentLanguage.label}</span>
            <ChevronRight
              className={`w-4 h-4 shrink-0 opacity-70 transition-transform ${langOpen ? 'rotate-90' : ''}`}
            />
          </button>

          {langOpen && (
            <div className="mt-1 space-y-0.5">
              {LANGUAGES.map((l) => {
                const active = language === l.id;
                return (
                  <button
                    key={l.id}
                    role="menuitemradio"
                    aria-checked={active}
                    onClick={() => setLanguage(l.id)}
                    className={`w-full flex items-center gap-3 pl-4 pr-2.5 py-2 rounded-xl text-sm transition-colors cursor-pointer ${
                      active ? 'bg-white/8 text-white' : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="w-7 py-0.5 rounded-md bg-white/8 text-[10px] font-bold text-zinc-300 text-center tabular-nums">
                      {l.code}
                    </span>
                    <span className="flex-1 text-left font-semibold">{l.label}</span>
                    <Check className={`w-4 h-4 shrink-0 ${active ? 'text-(--brand-light)' : 'invisible'}`} />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
