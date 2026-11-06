// components/landing/hero.test.tsx
// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "./hero";

describe("Hero", () => {
  it("renders the title, CTA, and decorative background layers", () => {
    const { container } = render(<Hero />);

    expect(screen.getByRole("heading", { name: "Tarot aquí" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Pedir lectura/i })).toBeInTheDocument();
    expect(container.querySelector(".star-field")).not.toBeNull();
    expect(container.querySelector("svg[aria-hidden='true']")).not.toBeNull();
  });
});
