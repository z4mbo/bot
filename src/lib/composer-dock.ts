import { useLayoutEffect, useState, type RefObject } from "react";

/** Clear space between the last message and the composer when scrolled to the end. */
export const COMPOSER_CLEARANCE = "54px";

/** Simple mode's working row (36px, tucked 14px into the 16px row gap) takes this much of the clearance, so the
 * transcript holds still when the row appears. */
export const PRESENCE_SLOT_PX = 38;

const FALLBACK_COMPOSER_PX = 64;

export function transcriptEndPad(composerHeightPx: number, { presenceSlot = false }: { presenceSlot?: boolean } = {}): string {
  const height = Number.isFinite(composerHeightPx)
    ? Math.max(0, Math.ceil(composerHeightPx))
    : FALLBACK_COMPOSER_PX;
  return presenceSlot ? `calc(${height}px + ${COMPOSER_CLEARANCE} - ${PRESENCE_SLOT_PX}px)` : `calc(${height}px + ${COMPOSER_CLEARANCE})`;
}

export function messageBoxHeight(dock: Pick<DOMRect, "bottom">, box: Pick<DOMRect, "top"> | undefined): number {
  return box ? Math.max(0, dock.bottom - box.top) : 0;
}

export function useComposerDockPad(ref: RefObject<HTMLElement | null>) {
  const [height, setHeight] = useState(0);
  const [box, setBox] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const apply = () => {
      const dock = el.getBoundingClientRect();
      setHeight(dock.height);
      setBox(messageBoxHeight(dock, el.querySelector("[data-look=composer]")?.getBoundingClientRect()));
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  const measured = height > 0 ? height : FALLBACK_COMPOSER_PX;
  return { pad: transcriptEndPad(measured), height: measured, box: box > 0 ? box : measured };
}
