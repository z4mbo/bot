import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { t } from "@/lib/i18n";

/** Drawn by the renderer because the WCO overlay API cannot style hover. They sit in the window's top right corner,
 * level with the headers, in the shape and size of Windows 11's own: 46px wide, 10px glyphs drawn with a 1px line. */
export function WindowCaptionButtons({ visible }: { visible: boolean }) {
  const [maximized, setMaximized] = useState(false);

  useEffect(() => {
    const controls = window.ogb?.windowControls;
    if (!controls) return;
    let alive = true;
    void controls.state().then(({ maximized }) => {
      if (alive) setMaximized(maximized);
    });
    const unsubscribe = controls.onMaximizedChanged((value) => setMaximized(value));
    return () => {
      alive = false;
      unsubscribe();
    };
  }, []);
  useCaptionRoom(visible);

  if (!visible) return null;
  const controls = window.ogb?.windowControls;

  // SAFETY: Electron's -webkit-app-region is not in React's CSSProperties type; the renderer accepts it as an inline
  // style.
  const noDrag = { WebkitAppRegion: "no-drag" } as CSSProperties;
  const captionButton = "flex h-full w-[calc(var(--caption-buttons-width)/3)] items-center justify-center text-ink transition-colors motion-reduce:transition-none";

  return (
    <div
      aria-hidden
      data-window-caption-buttons
      style={noDrag}
      // z-40: above docked panels (z-20/z-40, earlier in the DOM); centre-screen modals (z-50) still paint over.
      className="absolute right-0 top-0 z-40 flex h-[var(--caption-buttons-height)] items-stretch"
    >
      <button
        type="button"
        aria-label={t("window.minimize")}
        title={t("window.minimize")}
        className={cn(captionButton, "hover:bg-ink/[0.06] active:bg-ink/[0.08]")}
        onClick={() => void controls?.minimize()}
      >
        <CaptionGlyph><path d="M0 4.5h10" /></CaptionGlyph>
      </button>
      <button
        type="button"
        aria-label={maximized ? t("window.restore") : t("window.maximize")}
        title={maximized ? t("window.restore") : t("window.maximize")}
        className={cn(captionButton, "hover:bg-ink/[0.06] active:bg-ink/[0.08]")}
        onClick={() => void controls?.toggleMaximize()}
      >
        {maximized
          ? <CaptionGlyph><rect x="0.5" y="2.5" width="7" height="7" /><path d="M2.5 2.5v-2h7v7h-2" /></CaptionGlyph>
          : <CaptionGlyph><rect x="0.5" y="0.5" width="9" height="9" /></CaptionGlyph>}
      </button>
      <button
        type="button"
        aria-label={t("window.close")}
        title={t("window.close")}
        className={cn(captionButton, "hover:bg-danger active:bg-danger/90")}
        onClick={() => void controls?.close()}
      >
        <CaptionGlyph><path d="M0.5 0.5l9 9M9.5 0.5l-9 9" /></CaptionGlyph>
      </button>
    </div>
  );
}

function CaptionGlyph({ children }: { children: ReactNode }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true" className="overflow-visible">
      {children}
    </svg>
  );
}

/** Marks the headers that drag the window and run under the caption buttons with data-caption-room, so their controls
 * stay clear of the buttons as panels open and close and the window resizes. */
function useCaptionRoom(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const root = document.documentElement;
    let frame = 0;
    const mark = () => {
      frame = 0;
      const style = getComputedStyle(root);
      const width = parseFloat(style.getPropertyValue("--caption-buttons-width")) || 0;
      const height = parseFloat(style.getPropertyValue("--caption-buttons-height")) || 0;
      const corner = root.clientWidth - width;
      for (const header of document.querySelectorAll<HTMLElement>("[data-window-drag]")) {
        const box = header.getBoundingClientRect();
        header.toggleAttribute("data-caption-room", box.width > 0 && box.top < height && box.bottom > 0 && box.right > corner);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(mark);
    };
    const resized = new ResizeObserver(schedule);
    const watchHeaders = () => {
      resized.disconnect();
      resized.observe(root);
      for (const header of document.querySelectorAll("[data-window-drag]")) resized.observe(header);
      schedule();
    };
    const changed = new MutationObserver(watchHeaders);
    changed.observe(document.body, { childList: true, subtree: true });
    watchHeaders();
    return () => {
      changed.disconnect();
      resized.disconnect();
      cancelAnimationFrame(frame);
      for (const header of document.querySelectorAll("[data-caption-room]")) header.removeAttribute("data-caption-room");
    };
  }, [active]);
}
