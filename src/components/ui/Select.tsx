import { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Popover } from './Popover';

export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

interface SelectProps<T extends string> {
  value: T;
  options: readonly SelectOption<T>[];
  onChange: (value: T) => void;
  /** Accessible name when there is no visible <label> around the control. */
  ariaLabel?: string;
  /** Optional icon shown before the selected label. */
  icon?: React.ReactNode;
  size?: 'sm' | 'md';
  /** Stretch to the container width (default) or size to the content. */
  fullWidth?: boolean;
  className?: string;
}

const SIZE_CLASSES = {
  sm: 'pl-3 pr-2.5 py-2 text-xs font-semibold gap-2',
  md: 'px-3 py-2 text-sm gap-2',
} as const;

/**
 * Themed replacement for the native <select>: first click opens, second click closes,
 * outside press / Escape closes. Keyboard: ↑ ↓ Home End to move, Enter/Space to pick.
 */
export function Select<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
  icon,
  size = 'md',
  fullWidth = true,
  className = '',
}: SelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const listId = useId();

  const selectedIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value)
  );
  const selected = options[selectedIndex];

  const openList = () => {
    setActiveIndex(selectedIndex);
    setOpen(true);
  };
  const close = (refocus = false) => {
    setOpen(false);
    if (refocus) triggerRef.current?.focus();
  };
  const pick = (index: number) => {
    const option = options[index];
    if (option) onChange(option.value);
    close(true);
  };

  // Focus stays on the trigger (combobox pattern); keep the active option scrolled into view
  useEffect(() => {
    if (!open) return;
    (listRef.current?.children[activeIndex] as HTMLElement | undefined)?.scrollIntoView({ block: 'nearest' });
  }, [open, activeIndex]);

  const onTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (open) {
      onOpenListKeyDown(e);
      return;
    }
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
      e.preventDefault();
      openList();
    }
  };

  const onOpenListKeyDown = (e: React.KeyboardEvent) => {
    const last = options.length - 1;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((i) => Math.min(last, i + 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((i) => Math.max(0, i - 1));
        break;
      case 'Home':
        e.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setActiveIndex(last);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        pick(activeIndex);
        break;
      case 'Escape':
        e.preventDefault();
        close(true);
        break;
      case 'Tab':
        close();
        break;
    }
  };

  return (
    <div ref={anchorRef} className={`relative ${fullWidth ? 'w-full' : 'inline-block'}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? close() : openList())}
        onKeyDown={onTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open ? `${listId}-${activeIndex}` : undefined}
        aria-label={ariaLabel}
        className={`${fullWidth ? 'w-full' : ''} flex items-center bg-[#1C1C28] border rounded-xl text-white text-left cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/15 ${
          open ? 'border-white/30 ring-2 ring-white/10' : 'border-white/10 hover:border-white/20'
        } ${SIZE_CLASSES[size]} ${className}`}
      >
        {icon && <span className="shrink-0 text-zinc-400 [&>svg]:w-3.5 [&>svg]:h-3.5">{icon}</span>}
        <span className="flex-1 min-w-0 truncate">{selected?.label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 shrink-0 text-zinc-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <Popover open={open} onClose={() => close()} anchorRef={anchorRef} matchWidth className="p-1">
        <div
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label={ariaLabel}
          className="space-y-0.5"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isActive = index === activeIndex;
            return (
              <div
                key={option.value}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={isSelected}
                onPointerEnter={() => setActiveIndex(index)}
                onClick={() => pick(index)}
                className={`flex items-center justify-between gap-3 px-2.5 py-2 rounded-lg cursor-pointer select-none ${
                  size === 'sm' ? 'text-xs' : 'text-sm'
                } ${isSelected ? 'font-bold text-white' : 'font-medium text-zinc-300'} ${
                  isActive ? 'bg-white/8' : ''
                }`}
              >
                <span className="truncate">{option.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 shrink-0 text-(--brand-light)" strokeWidth={3} />}
              </div>
            );
          })}
        </div>
      </Popover>
    </div>
  );
}
