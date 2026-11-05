// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(""),
}));

import PedirForm from "./pedir-form";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
});

// `getByRole("radio", { name })` is used instead of `getByLabelText` here: Base UI's
// RadioGroupItem (components/ui/radio-group.tsx) gives both its wrapper <span> and its
// hidden native <input> an accessible name matching the <Label>, so `getByLabelText`
// matches two elements and throws. `getByRole` uniquely matches the radio control.
describe("PedirForm", () => {
  it("renders both payable services and the payment methods", () => {
    render(<PedirForm />);

    expect(screen.getByText(/Carta consejo/)).toBeInTheDocument();
    expect(screen.getByText(/Lectura de 2 o más cartas/)).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Mercado Pago" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Tarjeta (Stripe)" })).toBeInTheDocument();
  });

  it("shows a validation error when submitting an empty form", async () => {
    render(<PedirForm />);

    await userEvent.click(screen.getByRole("button", { name: /Pagar y enviar consulta/ }));

    expect(await screen.findByText(/Ingresá tu nombre completo/)).toBeInTheDocument();
  });
});
