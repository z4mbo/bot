import { describe, expect, it } from "vitest";

import { COMPOSER_CLEARANCE, messageBoxHeight, transcriptEndPad } from "./composer-dock";

describe("transcriptEndPad", () => {
  it("leaves 54px clear between the last message and the measured composer", () => {
    expect(COMPOSER_CLEARANCE).toBe("54px");
    expect(transcriptEndPad(72)).toBe("calc(72px + 54px)");
  });

  it("ceils fractional heights so a subpixel composer cannot eat the gap", () => {
    expect(transcriptEndPad(71.2)).toBe("calc(72px + 54px)");
  });

  it("gives the working row its slot out of the clearance, so the transcript holds still", () => {
    expect(transcriptEndPad(72, { presenceSlot: true })).toBe("calc(72px + 54px - 38px)");
  });

  it("does not go negative", () => {
    expect(transcriptEndPad(-4)).toBe("calc(0px + 54px)");
  });

  it("uses a one-line empty-composer fallback, not the old two-row slot", () => {
    expect(transcriptEndPad(Number.NaN)).toBe("calc(64px + 54px)");
  });
});

describe("messageBoxHeight", () => {
  it("leaves out what is stacked above the message box, so an open page is not squeezed by attachments", () => {
    expect(messageBoxHeight({ bottom: 900 }, { top: 840 })).toBe(60);
  });

  it("is zero without a message box, and never negative", () => {
    expect(messageBoxHeight({ bottom: 900 }, undefined)).toBe(0);
    expect(messageBoxHeight({ bottom: 900 }, { top: 910 })).toBe(0);
  });
});
