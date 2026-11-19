import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

const OPEN_DELAY_MS = 300;

/** A short label floating centred above its control while the pointer rests on it; outside any clipping parent. */
export function HoverTip({ label, children }: { label: string; children: ReactNode }) {
  const [at, setAt] = useState<DOMRect | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const close = () => { clearTimeout(timer.current); setAt(null); };
  return (
    <span
      className="contents"
      onPointerEnter={(event) => {
        const target = (event.target as Element).closest("button, a, [role=button]") ?? (event.target as Element);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setAt(target.getBoundingClientRect()), OPEN_DELAY_MS);
      }}
      onPointerLeave={close}
      onPointerDown={close}
    >
      {children}
      {at && createPortal(
        <span
          role="tooltip"
          data-hover-tip=""
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md bg-composer px-2 text-[13px] leading-6 text-ink inset-ring inset-ring-ink/10"
          style={{ left: at.left + at.width / 2, top: at.top - 9 }}
        >
          {label}
        </span>,
        document.body,
      )}
    </span>
  );
}
