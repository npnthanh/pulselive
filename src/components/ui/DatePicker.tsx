import React, { useRef, useState } from 'react';
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Popover } from './Popover';

interface DatePickerProps {
  /** ISO date `YYYY-MM-DD`, or '' when empty. */
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  invalid?: boolean;
  /** Show a "Xóa" action that empties the value. */
  clearable?: boolean;
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
}

type View = 'day' | 'month' | 'year';

const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const YEARS_PER_PAGE = 12;

const pad = (n: number) => String(n).padStart(2, '0');
const toIso = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;
const todayIso = () => {
  const d = new Date();
  return toIso(d.getFullYear(), d.getMonth(), d.getDate());
};
const parseIso = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return y && m && d ? { year: y, month: m - 1, day: d } : null;
};
const formatDisplay = (iso: string) => {
  const p = parseIso(iso);
  return p ? `${pad(p.day)}/${pad(p.month + 1)}/${p.year}` : '';
};

/**
 * Themed calendar replacing <input type="date">: first click opens, second click closes,
 * outside press / Escape closes. The title switches day → year → month views so far-away
 * dates (e.g. birthdays) take three clicks instead of hundreds of month steps.
 */
export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  min,
  max,
  invalid = false,
  clearable = false,
  placeholder = 'Chọn ngày',
  ariaLabel,
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>('day');
  const [cursor, setCursor] = useState({ year: 2000, month: 0 });
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const today = todayIso();
  const outOfRange = (iso: string) => (min !== undefined && iso < min) || (max !== undefined && iso > max);
  const minYear = min ? parseIso(min)?.year : undefined;
  const maxYear = max ? parseIso(max)?.year : undefined;

  const openPicker = () => {
    // Start from the selected date, else today clamped into range
    const start = parseIso(value) ?? parseIso(max && today > max ? max : min && today < min ? min : today)!;
    setCursor({ year: start.year, month: start.month });
    setView('day');
    setOpen(true);
  };
  const close = (refocus = false) => {
    setOpen(false);
    if (refocus) triggerRef.current?.focus();
  };
  const select = (iso: string) => {
    onChange(iso);
    close(true);
  };

  const step = (dir: -1 | 1) => {
    setCursor(({ year, month }) => {
      if (view === 'day') {
        const m = month + dir;
        return { year: year + Math.floor(m / 12), month: ((m % 12) + 12) % 12 };
      }
      return { year: year + dir * (view === 'year' ? YEARS_PER_PAGE : 1), month };
    });
  };

  // ---- Day grid: 6 weeks starting Monday ----
  const firstOfMonth = new Date(cursor.year, cursor.month, 1);
  const leading = (firstOfMonth.getDay() + 6) % 7;
  const days = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(cursor.year, cursor.month, 1 - leading + i);
    return {
      iso: toIso(d.getFullYear(), d.getMonth(), d.getDate()),
      day: d.getDate(),
      inMonth: d.getMonth() === cursor.month,
    };
  });

  const pageStart = Math.floor(cursor.year / YEARS_PER_PAGE) * YEARS_PER_PAGE;
  const years = Array.from({ length: YEARS_PER_PAGE }, (_, i) => pageStart + i);

  const title =
    view === 'day'
      ? `Tháng ${cursor.month + 1}, ${cursor.year}`
      : view === 'month'
      ? `${cursor.year}`
      : `${pageStart} – ${pageStart + YEARS_PER_PAGE - 1}`;

  const canStep = (dir: -1 | 1) => {
    if (view === 'year') {
      const edge = dir < 0 ? pageStart - 1 : pageStart + YEARS_PER_PAGE;
      return !((dir < 0 && minYear !== undefined && edge < minYear) || (dir > 0 && maxYear !== undefined && edge > maxYear));
    }
    if (view === 'month') {
      const y = cursor.year + dir;
      return !((minYear !== undefined && y < minYear) || (maxYear !== undefined && y > maxYear));
    }
    const m = cursor.month + dir;
    const y = cursor.year + Math.floor(m / 12);
    const mm = ((m % 12) + 12) % 12;
    const first = toIso(y, mm, 1);
    const last = toIso(y, mm, new Date(y, mm + 1, 0).getDate());
    return !((max !== undefined && first > max) || (min !== undefined && last < min));
  };

  const cellBase =
    'flex items-center justify-center rounded-lg font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-25';
  const selectedCls = 'bg-(--brand) text-white shadow-lg shadow-(--brand-glow)';

  return (
    <div ref={anchorRef} className={`relative w-full ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? close() : openPicker())}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' && !open) {
            e.preventDefault();
            openPicker();
          }
        }}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={ariaLabel}
        className={`w-full flex items-center gap-2 bg-[#1C1C28] border rounded-xl px-3 py-2 text-sm text-left cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/15 ${
          invalid
            ? 'border-rose-500/60'
            : open
            ? 'border-white/30 ring-2 ring-white/10'
            : 'border-white/10 hover:border-white/20'
        }`}
      >
        <span className={`flex-1 tabular-nums ${value ? 'text-white' : 'text-zinc-500'}`}>
          {formatDisplay(value) || placeholder}
        </span>
        <CalendarDays className={`w-4 h-4 shrink-0 ${open ? 'text-(--brand-light)' : 'text-zinc-400'}`} />
      </button>

      <Popover open={open} onClose={() => close()} anchorRef={anchorRef} className="w-[296px] p-3">
        <div
          role="dialog"
          aria-label={ariaLabel ?? 'Chọn ngày'}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.preventDefault();
              close(true);
            }
          }}
        >
          {/* Header: title switches views, arrows step month / year / year page */}
          <div className="flex items-center justify-between mb-2.5">
            <button
              type="button"
              onClick={() => setView(view === 'day' ? 'year' : view === 'year' ? 'day' : 'year')}
              className="flex items-center gap-1 px-2 py-1 -ml-1 rounded-lg text-sm font-extrabold text-white hover:bg-white/8 cursor-pointer"
              aria-label="Chọn tháng và năm"
            >
              {title}
              <ChevronDown
                className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${view !== 'day' ? 'rotate-180' : ''}`}
              />
            </button>
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => step(-1)}
                disabled={!canStep(-1)}
                className="p-1.5 rounded-lg text-zinc-300 hover:bg-white/8 hover:text-white cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed"
                aria-label="Trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                disabled={!canStep(1)}
                className="p-1.5 rounded-lg text-zinc-300 hover:bg-white/8 hover:text-white cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed"
                aria-label="Sau"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {view === 'day' && (
            <>
              <div className="grid grid-cols-7 mb-1">
                {WEEKDAYS.map((w) => (
                  <span
                    key={w}
                    className={`h-7 flex items-center justify-center text-[10px] font-bold ${
                      w === 'CN' ? 'text-rose-400/80' : 'text-zinc-500'
                    }`}
                  >
                    {w}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-0.5">
                {days.map(({ iso, day, inMonth }) => {
                  const isSelected = iso === value;
                  const isToday = iso === today;
                  return (
                    <button
                      key={iso}
                      type="button"
                      onClick={() => select(iso)}
                      disabled={outOfRange(iso)}
                      aria-pressed={isSelected}
                      aria-label={formatDisplay(iso)}
                      className={`${cellBase} h-9 text-xs tabular-nums ${
                        isSelected
                          ? selectedCls
                          : `${inMonth ? 'text-zinc-200' : 'text-zinc-600'} hover:bg-white/8 ${
                              isToday ? 'ring-1 ring-inset ring-(--brand-light)/70 text-white' : ''
                            }`
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {view === 'year' && (
            <div className="grid grid-cols-3 gap-1.5">
              {years.map((y) => {
                const disabled = (minYear !== undefined && y < minYear) || (maxYear !== undefined && y > maxYear);
                const isCurrent = y === cursor.year;
                return (
                  <button
                    key={y}
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                      setCursor((c) => ({ ...c, year: y }));
                      setView('month');
                    }}
                    className={`${cellBase} h-11 text-sm tabular-nums ${isCurrent ? selectedCls : 'text-zinc-200 hover:bg-white/8'}`}
                  >
                    {y}
                  </button>
                );
              })}
            </div>
          )}

          {view === 'month' && (
            <div className="grid grid-cols-3 gap-1.5">
              {Array.from({ length: 12 }, (_, m) => {
                const first = toIso(cursor.year, m, 1);
                const last = toIso(cursor.year, m, new Date(cursor.year, m + 1, 0).getDate());
                const disabled = (max !== undefined && first > max) || (min !== undefined && last < min);
                const isCurrent = m === cursor.month;
                return (
                  <button
                    key={m}
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                      setCursor((c) => ({ ...c, month: m }));
                      setView('day');
                    }}
                    className={`${cellBase} h-11 text-sm ${isCurrent ? selectedCls : 'text-zinc-200 hover:bg-white/8'}`}
                  >
                    Tháng {m + 1}
                  </button>
                );
              })}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/8">
            {clearable ? (
              <button
                type="button"
                onClick={() => select('')}
                className="px-2 py-1 rounded-lg text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/8 cursor-pointer"
              >
                Xóa
              </button>
            ) : (
              <span className="text-[11px] text-zinc-500 tabular-nums">{value ? formatDisplay(value) : ''}</span>
            )}
            <button
              type="button"
              onClick={() => select(today)}
              disabled={outOfRange(today)}
              className="px-2 py-1 rounded-lg text-xs font-bold text-(--brand-light) hover:bg-white/8 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Hôm nay
            </button>
          </div>
        </div>
      </Popover>
    </div>
  );
};
