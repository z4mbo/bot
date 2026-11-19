/** The bot panel and its computer view take turns in one place: whichever comes in from the other skips its slide. */
let handoffUntil = 0;
const HANDOFF_MS = 400;

export function handOffPanel(now = Date.now()): void {
  handoffUntil = now + HANDOFF_MS;
}

export function takePanelHandoff(now = Date.now()): boolean {
  const handedOff = now < handoffUntil;
  handoffUntil = 0;
  return handedOff;
}
