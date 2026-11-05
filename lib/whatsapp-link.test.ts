import { describe, it, expect } from "vitest";
import { buildWhatsAppLink } from "./whatsapp-link";

describe("buildWhatsAppLink", () => {
  it("builds a wa.me URL with the encoded message", () => {
    const url = buildWhatsAppLink("5491122334455", "Hola Sofía!");
    expect(url).toBe("https://wa.me/5491122334455?text=Hola%20Sof%C3%ADa!");
  });
});
