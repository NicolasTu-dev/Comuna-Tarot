// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams("order=42"),
}));

import ConfirmacionContent from "./confirmacion-content";

describe("ConfirmacionContent", () => {
  it("shows the thank-you message with the order number", () => {
    render(<ConfirmacionContent />);

    expect(screen.getByText(/Gracias por tu pedido/)).toBeInTheDocument();
    expect(screen.getByText(/pedido #42/)).toBeInTheDocument();
  });
});
