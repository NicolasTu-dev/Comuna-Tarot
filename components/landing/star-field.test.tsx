// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { StarField } from "./star-field";

describe("StarField", () => {
  it("renders a decorative, non-interactive background layer", () => {
    const { container } = render(<StarField />);

    const root = container.querySelector(".star-field");
    expect(root).not.toBeNull();
    expect(root).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelectorAll(".star-field__layer")).toHaveLength(2);
  });
});
