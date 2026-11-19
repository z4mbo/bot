import { describe, expect, it } from "vitest";
import type { InboxRow } from "../../../shared/inbox";
import { botInboxRows } from "./InboxTab";

const row = (id: string, extra: Partial<InboxRow>): InboxRow => ({ id, kind: "message", tab: "info", from: { name: "Someone" }, text: id, at: 1, unread: false, ...extra });

describe("a bot's Inbox tab", () => {
  it("keeps the lines the bot sent, passed on, worked on or started from, and leaves out other bots'", () => {
    const rows = [
      row("sent", { from: { name: "Atlas", botId: "atlas" } }),
      row("passed", { via: { botId: "atlas", name: "Atlas" } }),
      row("worked", { workingFor: { botId: "atlas", name: "Atlas" } }),
      row("started", { origin: { botId: "atlas", threadId: "t", title: "Taxes" } }),
      row("other", { from: { name: "Orbit", botId: "orbit" } }),
      row("person", {}),
    ];
    expect(botInboxRows(rows, "atlas").map((one) => one.id)).toEqual(["sent", "passed", "worked", "started"]);
  });
});
