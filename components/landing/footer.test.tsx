// @vitest-environment jsdom
import { describe, it, expect, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "./footer";

beforeAll(() => {
  process.env.NEXT_PUBLIC_SOFIA_WHATSAPP_NUMBER = "5491122334455";
});

describe("Footer", () => {
  it("renders the WhatsApp link and brand mark", () => {
    render(<Footer />);

    expect(screen.getByRole("link", { name: /Escribir por WhatsApp/ })).toBeInTheDocument();
    expect(screen.getByText(/Comuna Tarot/)).toBeInTheDocument();
  });
});
