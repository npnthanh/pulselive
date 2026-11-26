import React, { useEffect, useRef, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { useDismiss } from '../../hooks/useDismiss';

interface PopoverProps {
  open: boolean;
  onClose: () => void;
  /** Element the panel is positioned against (usually the trigger's wrapper). */
  anchorRef: RefObject<HTMLElement | null>;
  /** Panel takes the anchor's width (dropdown lists) instead of its own (calendars). */
  matchWidth?: boolean;
  /** Horizontal alignment against the anchor when the panel has its own width. */
  align?: 'start' | 'end';
  className?: string;
  children: React.ReactNode;
  panelRef?: RefObject<HTMLDivElement | null>;
}

interface Position {
  top: number;
  left: number;
  width?: number;
  maxHeight: number;
}

const GAP = 6;
const VIEWPORT_MARGIN = 8;

/**
 * Floating panel rendered into <body> with fixed positioning, so it is never clipped by a
 * scrolling card or modal and always sits above sticky headers.
 * Opens below the anchor and flips above when there is more room there.
 * Closes on an outside press or Escape (presses on the anchor are ignored, so the trigger
 * can toggle it).
 */
export const Popover: React.FC<PopoverProps> = ({
  open,
  onClose,
  anchorRef,
  matchWidth = false,
  align = 'start',
  className = '',
  children,
  panelRef: externalPanelRef,
}) => {
  const internalPanelRef = useRef<HTMLDivElement | null>(null);
  const panelRef = externalPanelRef ?? internalPanelRef;
  const [position, setPosition] = useState<Position | null>(null);

  useDismiss(open, [panelRef, anchorRef], onClose);

  useEffect(() => {
    if (!open) return;
    const update = () => {
      const anchor = anchorRef.current;
      const panel = panelRef.current;
      if (!anchor || !panel) return;
      const a = anchor.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const width = matchWidth ? a.width : panel.offsetWidth;
      const height = panel.scrollHeight;

      const spaceBelow = vh - a.bottom - GAP - VIEWPORT_MARGIN;
      const spaceAbove = a.top - GAP - VIEWPORT_MARGIN;
      const placeBelow = height <= spaceBelow || spaceBelow >= spaceAbove;
      const maxHeight = Math.max(120, placeBelow ? spaceBelow : spaceAbove);
      const top = placeBelow ? a.bottom + GAP : a.top - GAP - Math.min(height, maxHeight);

      const preferredLeft = align === 'end' ? a.right - width : a.left;
      const left = Math.min(Math.max(preferredLeft, VIEWPORT_MARGIN), vw - width - VIEWPORT_MARGIN);

      setPosition({ top, left, width: matchWidth ? a.width : undefined, maxHeight });
    };

    // First measure after the hidden panel has been laid out
    const frame = requestAnimationFrame(update);
    window.addEventListener('resize', update);
    // Capture: follow scrolling of any ancestor (cards, modals, the page)
    window.addEventListener('scroll', update, true);
    // Content can change height while open (calendar day ↔ year view) — keep the panel glued
    // to the anchor, which matters when it is placed above it
    const observer = new ResizeObserver(update);
    if (panelRef.current) observer.observe(panelRef.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
      setPosition(null);
    };
  }, [open, anchorRef, panelRef, matchWidth, align]);

  if (!open) return null;

  return createPortal(
    <div
      ref={panelRef}
      style={
        position
          ? { top: position.top, left: position.left, width: position.width, maxHeight: position.maxHeight }
          : { top: 0, left: 0, visibility: 'hidden' }
      }
      className={`fixed z-[200] overflow-y-auto bg-[#181822] border border-white/12 rounded-xl shadow-2xl shadow-black/50 ${
        position ? 'animate-popover-in' : ''
      } ${className}`}
    >
      {children}
    </div>,
    document.body
  );
};
