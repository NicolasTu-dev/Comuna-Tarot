import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/db/orders", () => ({ createOrder: vi.fn() }));
vi.mock("@/lib/payments/mercadopago", () => ({ createMercadoPagoPreference: vi.fn() }));
vi.mock("@/lib/payments/stripe", () => ({ createStripeCheckoutSession: vi.fn() }));

import { POST } from "./route";
import { createOrder } from "@/lib/db/orders";
import { createMercadoPagoPreference } from "@/lib/payments/mercadopago";
import { createStripeCheckoutSession } from "@/lib/payments/stripe";

function makeRequest(body: unknown) {
  return new NextRequest("http://localhost/api/orders", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

const validBody = {
  name: "Ana",
  whatsapp: "+5491122334455",
  serviceId: "carta-consejo",
  question: "¿Cómo me va a ir?",
  paymentProvider: "mercadopago",
};

beforeEach(() => {
  vi.mocked(createOrder).mockReset();
  vi.mocked(createMercadoPagoPreference).mockReset();
  vi.mocked(createStripeCheckoutSession).mockReset();
});

describe("POST /api/orders", () => {
  it("creates an order and returns the Mercado Pago redirect URL", async () => {
    vi.mocked(createOrder).mockResolvedValue({
      id: 1,
      customerName: "Ana",
      customerWhatsapp: "+5491122334455",
      serviceId: "carta-consejo",
      question: "¿Cómo me va a ir?",
      paymentProvider: "mercadopago",
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    vi.mocked(createMercadoPagoPreference).mockResolvedValue(
      "https://mercadopago.com/checkout/1"
    );

    const response = await POST(makeRequest(validBody));
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.redirectUrl).toBe("https://mercadopago.com/checkout/1");
  });

  it("creates an order and returns the Stripe redirect URL", async () => {
    vi.mocked(createOrder).mockResolvedValue({
      id: 2,
      customerName: "Ana",
      customerWhatsapp: "+5491122334455",
      serviceId: "carta-consejo",
      question: "¿Cómo me va a ir?",
      paymentProvider: "stripe",
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    vi.mocked(createStripeCheckoutSession).mockResolvedValue(
      "https://checkout.stripe.com/session2"
    );

    const response = await POST(makeRequest({ ...validBody, paymentProvider: "stripe" }));
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.redirectUrl).toBe("https://checkout.stripe.com/session2");
  });

  it("rejects an invalid payload with 400", async () => {
    const response = await POST(makeRequest({ name: "a" }));
    expect(response.status).toBe(400);
    expect(createOrder).not.toHaveBeenCalled();
  });

  it("rejects a serviceId that isn't payable (sesion-en-vivo) via schema validation", async () => {
    const response = await POST(makeRequest({ ...validBody, serviceId: "sesion-en-vivo" }));
    expect(response.status).toBe(400);
    expect(createOrder).not.toHaveBeenCalled();
  });
});
