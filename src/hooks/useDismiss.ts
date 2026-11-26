import { useEffect, useRef, type RefObject } from 'react';

/**
 * While `active`, calls `onDismiss` when the user presses (mouse, touch or pen) outside every
 * element in `refs`, or presses Escape. Put the popup AND the button that toggles it in `refs`,
 * otherwise a press on the toggle would close the popup and the click would reopen it.
 */
export function useDismiss(
  active: boolean,
  refs: RefObject<HTMLElement | null>[],
  onDismiss: () => void
) {
  // Latest values without re-subscribing listeners on every render
  const refsRef = useRef(refs);
  const onDismissRef = useRef(onDismiss);
  useEffect(() => {
    refsRef.current = refs;
    onDismissRef.current = onDismiss;
  });

  useEffect(() => {
    if (!active) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (refsRef.current.some((ref) => ref.current?.contains(target))) return;
      onDismissRef.current();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismissRef.current();
    };
    // Capture phase so a stopPropagation inside the page can't keep a popup stuck open
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [active]);
}
