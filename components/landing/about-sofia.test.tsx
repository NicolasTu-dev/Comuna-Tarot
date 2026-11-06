// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AboutSofia } from "./about-sofia";

describe("AboutSofia", () => {
  it("renders the section heading and body copy", () => {
    render(<AboutSofia />);

    expect(screen.getByText("Sobre Sofía")).toBeInTheDocument();
    expect(screen.getByText(/Sofía lee tarot hace varios años/)).toBeInTheDocument();
  });
});
