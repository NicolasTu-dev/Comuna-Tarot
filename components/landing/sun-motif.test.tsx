// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { SunMotif } from "./sun-motif";

describe("SunMotif", () => {
  it("renders a decorative SVG that is hidden from assistive tech", () => {
    const { container } = render(<SunMotif />);

    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });
});
