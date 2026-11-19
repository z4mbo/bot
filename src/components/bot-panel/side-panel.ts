import { cn } from "@/lib/cn";

export const BOT_PANEL_ID = "bot-panel";

/** Simple's docked panel slides in by its width (and out again while `closing`); the others fade in from the side. */
export const SIDE_PANEL_MOTION_MS = 300;

/** `still`: it takes over from its computer view in the same place, so it does not slide in. */
export const sidePanelCls = (overlay: boolean, simple = false, closing = false, still = false) => cn(
  "absolute inset-0 z-40 flex h-full min-w-0 flex-col outline-none focus-visible:outline-none",
  simple && !overlay
    ? cn("border-l border-ink/[0.06] bg-app [--side-panel:min(569px,45vw)] md:static md:z-auto md:w-(--side-panel) md:shrink-0 md:overflow-hidden md:*:min-w-[calc(var(--side-panel)-1px)] motion-reduce:md:animate-none",
      !still && "animate-sheet-in", closing ? "pointer-events-none md:animate-side-panel-out" : !still && "md:animate-side-panel-in")
    : cn("animate-sheet-in md:animate-panel-in", simple ? "border-l-[0.5px] border-ink/[0.06] bg-app" : "border-l border-hairline/40 bg-panel"),
  overlay && cn("md:inset-auto md:right-0 md:top-0 md:bottom-0 md:shadow-2xl", simple ? "md:w-[320px]" : "md:w-[min(420px,42vw)]"),
  !overlay && !simple && "md:static md:z-auto md:shrink-0 md:w-[min(420px,42vw)]",
);
