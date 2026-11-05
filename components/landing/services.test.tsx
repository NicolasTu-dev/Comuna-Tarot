// @vitest-environment jsdom
import { describe, it, expect, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import { Services } from "./services";

beforeAll(() => {
  process.env.NEXT_PUBLIC_SOFIA_WHATSAPP_NUMBER = "5491122334455";
});

describe("Services", () => {
  it("renders all three services with the right call to action", () => {
    render(<Services />);

    expect(screen.getByText("Carta consejo")).toBeInTheDocument();
    expect(screen.getByText("Lectura de 2 o más cartas")).toBeInTheDocument();
    expect(screen.getByText("Sesión en vivo")).toBeInTheDocument();
    expect(screen.getAllByText("Pedir lectura")).toHaveLength(2);
    expect(screen.getByText("Consultar por WhatsApp")).toBeInTheDocument();
  });
});
