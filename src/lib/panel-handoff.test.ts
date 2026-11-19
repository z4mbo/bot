import { describe, expect, it } from "vitest";
import { handOffPanel, takePanelHandoff } from "./panel-handoff";

describe("the bot panel's hand-off to its computer view", () => {
  it("is taken once, by the panel that comes in right after it", () => {
    handOffPanel(1_000);
    expect(takePanelHandoff(1_100)).toBe(true);
    expect(takePanelHandoff(1_150), "the next panel slides as usual").toBe(false);
  });

  it("lapses when nothing takes it soon after", () => {
    handOffPanel(1_000);
    expect(takePanelHandoff(2_000)).toBe(false);
  });
});
