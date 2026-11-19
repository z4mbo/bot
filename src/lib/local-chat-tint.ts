import type { CSSProperties } from "react";
import type { Bot } from "@/state/store";

export type ChatTint = { bubble: CSSProperties; fill: string; ink: string; hover: string };
type TintBot = Pick<Bot, "id" | "name" | "color" | "defaultBot" | "chiefOfStaff">;
type LocalTint = { useChatTint(bot: TintBot | undefined): ChatTint | undefined };

const noTint = (_bot: TintBot | undefined): ChatTint | undefined => undefined;

/** A git-excluded local experiment may recolour a bot's chat; in any other checkout this is always undefined. */
export const useLocalChatTint: (bot: TintBot | undefined) => ChatTint | undefined =
  (import.meta.env.MODE === "test" ? undefined : Object.values(import.meta.glob<LocalTint>("../grok-study/BotAvatarOverride.tsx", { eager: true }))[0]?.useChatTint) ?? noTint;
