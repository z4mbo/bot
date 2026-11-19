import type { Bot, Task } from "@/state/store";
import { botOpensTo } from "@/state/thread-navigation";
import { isArchived, isSnoozed, threadRecency } from "@/components/SidebarThreadRow";

export const PEEK_LIMIT = 3;

/** The threads a bot's menu offers: its main conversation, then the newest open ones, keeping the one on screen. */
export function peekThreads(bot: Pick<Bot, "threadId" | "mainThreadId" | "tasks">, current?: string): Task[] {
  const main = botOpensTo(bot, false);
  const others = (bot.tasks ?? [])
    .filter((task) => task.threadId !== main && !task.routineRunId && !task.openedBy?.burstId && !task.closedBy && !isArchived(task) && !isSnoozed(task))
    .sort((a, b) => threadRecency(b) - threadRecency(a));
  return [
    ...(bot.tasks ?? []).filter((task) => task.threadId === main),
    ...others.filter((task, index) => index < PEEK_LIMIT || task.threadId === current),
  ];
}
