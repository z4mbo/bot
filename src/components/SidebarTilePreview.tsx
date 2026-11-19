import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import type { Bot } from "@/state/store";
import { BotAvatar } from "./Avatar";

const OPEN_DELAY_MS = 250;

/** Where a tile's preview card opens: beside the tile it was asked from, while the pointer rests on it. */
export function useTilePreview() {
  const [anchor, setAnchor] = useState<DOMRect | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  return {
    anchor,
    open: (tile: HTMLElement) => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setAnchor(tile.getBoundingClientRect()), OPEN_DELAY_MS);
    },
    close: () => {
      clearTimeout(timer.current);
      setAnchor(null);
    },
  };
}

/** The bot's latest words beside its tile: its face and name, then two lines of what it last said. */
export function SidebarTilePreview({ bot, text, anchor }: { bot: Bot; text: string; anchor: DOMRect }) {
  return createPortal(
    <div
      role="tooltip"
      data-sidebar-tile-preview=""
      className="pointer-events-none fixed z-50 w-[260px] rounded-xl bg-composer px-3 py-2.5 inset-ring inset-ring-ink/10 animate-pop-in"
      style={{ left: anchor.right + 8, top: anchor.top + 6 }}
    >
      <div className="flex min-w-0 items-center gap-1.5">
        <BotAvatar bot={bot} size={16} />
        <span className="min-w-0 truncate text-[14px] font-semibold leading-5 text-ink">{bot.name}</span>
      </div>
      <p className="mt-1 line-clamp-2 text-[13px] leading-[18px] text-ink-secondary">{text}</p>
    </div>,
    document.body,
  );
}
