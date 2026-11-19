import { useEffect, useState } from "react";
import type { InboxRow } from "../../../shared/inbox";
import { t } from "@/lib/i18n";
import { readInboxLine, readInboxRow, refreshInbox, useInboxPanel, useInboxView } from "@/state/inbox";
import type { Bot } from "@/state/store";
import { InboxReading } from "../inbox/InboxReading";
import { InboxRowItem } from "../inbox/InboxRow";
import { listedRows } from "../inbox/inbox-view";
import { useInboxActions } from "../inbox/use-inbox-actions";

/** The inbox lines one bot sent, asked for, or did the work behind. */
export function botInboxRows(rows: readonly InboxRow[], botId: string): InboxRow[] {
  return rows.filter((row) => row.from.botId === botId || row.via?.botId === botId || row.workingFor?.botId === botId || row.origin?.botId === botId);
}

export function InboxTab({ bot }: { bot: Pick<Bot, "id" | "name"> }) {
  const view = useInboxView();
  const panel = useInboxPanel();
  const { run, openInChat } = useInboxActions(view);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    void refreshInbox();
    const timer = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(timer);
  }, []);
  const rows = botInboxRows(listedRows(view), bot.id);
  const open = (row: InboxRow) => {
    readInboxRow(row);
    if (row.tab === "needs-you" || row.replies) readInboxLine(row.id);
    else openInChat(row);
  };
  const reading = panel.reading ? rows.find((row) => row.id === panel.reading) : undefined;
  if (reading && view) {
    const at = rows.indexOf(reading);
    return (
      <div data-panel-tabpanel="inbox" className="flex min-h-[320px] flex-col">
        <InboxReading view={view} row={reading} now={now} position={{ index: at, count: rows.length }} onStep={(by) => { const next = rows[at + by]; if (next) open(next); }} />
      </div>
    );
  }
  return (
    <div data-panel-tabpanel="inbox">
      {rows.length === 0
        ? <p data-panel-empty="inbox" className="px-3 py-7 text-center text-[13px] leading-[18px] text-ink-tertiary">{t("inbox.empty")}</p>
        : (
          <div role="list" aria-label={t("inbox.panel.title")} className="space-y-0.5">
            {rows.map((row) => <InboxRowItem key={row.id} row={row} now={now} onOpen={open} onAction={run} />)}
          </div>
        )}
    </div>
  );
}
