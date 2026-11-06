// components/landing/tarot-cards.test.tsx
// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TarotCards } from "./tarot-cards";

describe("TarotCards", () => {
  it("renders three flippable cards, unflipped by default", () => {
    render(<TarotCards />);

    const cards = screen.getAllByRole("button", { name: /carta de tarot decorativa/i });
    expect(cards).toHaveLength(3);
    cards.forEach((card) => expect(card).toHaveAttribute("aria-pressed", "false"));
  });

  it("flips a card to its reverse glyph on click", async () => {
    render(<TarotCards />);

    const [firstCard] = screen.getAllByRole("button", { name: /carta de tarot decorativa/i });
    await userEvent.click(firstCard);

    expect(firstCard).toHaveAttribute("aria-pressed", "true");
  });
});
