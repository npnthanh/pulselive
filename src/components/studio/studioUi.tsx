import React, { useEffect } from 'react';
import { X, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cardCls, SERIES_COLOR } from './styles';

/* ------------------------------------------------------------------ */
/* Section title                                                       */
/* ------------------------------------------------------------------ */

export const SectionTitle: React.FC<{ title: string; description?: string; action?: React.ReactNode }> = ({
  title,
  description,
  action,
}) => (
  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
    <div>
      <h1 className="text-xl font-extrabold text-white">{title}</h1>
      {description && <p className="text-xs text-zinc-400 mt-1">{description}</p>}
    </div>
    {action}
  </div>
);

/* ------------------------------------------------------------------ */
/* Modal                                                               */
/* ------------------------------------------------------------------ */

export const Modal: React.FC<{
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  wide?: boolean;
}> = ({ open, title, onClose, children, footer, wide }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/65 backdrop-blur-sm flex items-center justify-center p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`w-full ${wide ? 'max-w-2xl' : 'max-w-lg'} max-h-[90vh] flex flex-col ${cardCls} bg-[#17171F] shadow-2xl`}
      >
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-white/8">
          <h2 className="text-sm font-extrabold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/8 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-5 py-4 overflow-y-auto space-y-4">{children}</div>
        {footer && (
          <div className="px-5 py-3.5 border-t border-white/8 flex items-center justify-end gap-2">{footer}</div>
        )}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Form bits                                                           */
/* ------------------------------------------------------------------ */

export const Field: React.FC<{ label: string; hint?: string; error?: string; children: React.ReactNode }> = ({
  label,
  hint,
  error,
  children,
}) => (
  <label className="block">
    <span className="block text-xs font-semibold text-zinc-300 mb-1.5">{label}</span>
    {children}
    {error ? (
      <span className="block text-[11px] text-rose-400 mt-1.5">{error}</span>
    ) : (
      hint && <span className="block text-[11px] text-zinc-500 mt-1.5">{hint}</span>
    )}
  </label>
);

export const Toggle: React.FC<{
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}> = ({ checked, onChange, label, description, disabled }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className="w-full flex items-center justify-between gap-4 text-left cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
  >
    <span className="min-w-0">
      <span className="block text-sm font-semibold text-white">{label}</span>
      {description && <span className="block text-[11px] text-zinc-500 mt-0.5">{description}</span>}
    </span>
    <span
      className={`relative w-10 h-6 rounded-full shrink-0 transition-colors ${checked ? 'bg-(--brand)' : 'bg-white/15'}`}
    >
      <span
        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-4' : ''
        }`}
      />
    </span>
  </button>
);

export const EmptyState: React.FC<{ icon: React.ReactNode; title: string; text?: string; action?: React.ReactNode }> = ({
  icon,
  title,
  text,
  action,
}) => (
  <div className="py-10 px-6 flex flex-col items-center text-center">
    <span className="p-3 rounded-2xl bg-white/5 text-zinc-400">{icon}</span>
    <p className="mt-3 text-sm font-bold text-zinc-200">{title}</p>
    {text && <p className="mt-1 text-xs text-zinc-500 max-w-xs">{text}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

/* ------------------------------------------------------------------ */
/* Stat tile + sparkline                                               */
/* ------------------------------------------------------------------ */

const Sparkline: React.FC<{ values: number[] }> = ({ values }) => {
  if (values.length < 2) return null;
  const w = 96;
  const h = 28;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  const points = values.map((v, i) => [(i / (values.length - 1)) * (w - 4) + 2, h - 3 - ((v - min) / span) * (h - 6)]);
  const last = points[points.length - 1];
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" className="shrink-0">
      <polyline
        points={points.map((p) => p.join(',')).join(' ')}
        fill="none"
        stroke="#71717a"
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx={last[0]} cy={last[1]} r={2.5} fill={SERIES_COLOR} />
    </svg>
  );
};

export const StatTile: React.FC<{
  label: string;
  value: string;
  /** Fractional change vs previous period, e.g. 0.12 = +12% */
  delta?: number | null;
  deltaLabel?: string;
  trend?: number[];
  icon?: React.ReactNode;
}> = ({ label, value, delta, deltaLabel, trend, icon }) => {
  const hasDelta = delta !== undefined && delta !== null && Number.isFinite(delta);
  const up = hasDelta && delta > 0.0005;
  const down = hasDelta && delta < -0.0005;
  return (
    <div className={`${cardCls} p-4 flex flex-col gap-2 min-w-0`}>
      <p className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400">
        {icon}
        {label}
      </p>
      <div className="flex items-end justify-between gap-3">
        <p className="text-2xl font-extrabold text-white truncate">{value}</p>
        {trend && <Sparkline values={trend} />}
      </div>
      {hasDelta && (
        <p className="flex items-center gap-1 text-[11px]">
          <span
            className={`inline-flex items-center gap-0.5 font-bold ${
              up ? 'text-emerald-400' : down ? 'text-rose-400' : 'text-zinc-400'
            }`}
          >
            {up ? <TrendingUp className="w-3.5 h-3.5" /> : down ? <TrendingDown className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
            {delta > 0 ? '+' : ''}
            {(delta * 100).toFixed(1).replace('.', ',')}%
          </span>
          {deltaLabel && <span className="text-zinc-500">{deltaLabel}</span>}
        </p>
      )}
    </div>
  );
};
