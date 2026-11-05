import { describe, it, expect } from "vitest";
import { orderFormSchema } from "./validation";

const validInput = {
  name: "María López",
  whatsapp: "+5491122334455",
  serviceId: "carta-consejo",
  question: "¿Cómo me va a ir en el trabajo este mes?",
  paymentProvider: "mercadopago",
};

describe("orderFormSchema", () => {
  it("accepts a valid order", () => {
    const result = orderFormSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("rejects a name that is too short", () => {
    const result = orderFormSchema.safeParse({ ...validInput, name: "A" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid WhatsApp number", () => {
    const result = orderFormSchema.safeParse({ ...validInput, whatsapp: "no-es-un-telefono" });
    expect(result.success).toBe(false);
  });

  it("rejects a serviceId that isn't payable", () => {
    const result = orderFormSchema.safeParse({ ...validInput, serviceId: "sesion-en-vivo" });
    expect(result.success).toBe(false);
  });

  it("rejects a question that is too short", () => {
    const result = orderFormSchema.safeParse({ ...validInput, question: "Hola" });
    expect(result.success).toBe(false);
  });

  it("rejects an unknown payment provider", () => {
    const result = orderFormSchema.safeParse({ ...validInput, paymentProvider: "paypal" });
    expect(result.success).toBe(false);
  });
});
