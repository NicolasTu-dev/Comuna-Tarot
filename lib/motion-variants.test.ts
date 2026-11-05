import { describe, it, expect } from "vitest";
import { revealVariants, revealViewport } from "./motion-variants";

describe("motion-variants", () => {
  it("defines a hidden/visible fade+rise pair", () => {
    expect(revealVariants.hidden).toEqual({ opacity: 0, y: 24 });
    expect(revealVariants.visible).toEqual({ opacity: 1, y: 0 });
  });

  it("defines a once-only viewport trigger", () => {
    expect(revealViewport).toEqual({ once: true, margin: "-60px" });
  });
});
