import { describe, it, expect, vi, beforeEach } from "vitest";

const preferenceCreateMock = vi.fn();
const paymentGetMock = vi.fn();

vi.mock("mercadopago", () => {
  const MockPreference = class {
    create = preferenceCreateMock;
  };
  const MockPayment = class {
    get = paymentGetMock;
  };

  return {
    MercadoPagoConfig: vi.fn(),
    Preference: MockPreference,
    Payment: MockPayment,
  };
});

import {
  createMercadoPagoPreference,
  extractMercadoPagoPaymentId,
  getMercadoPagoPayment,
} from "./mercadopago";

beforeEach(() => {
  preferenceCreateMock.mockReset();
  paymentGetMock.mockReset();
  process.env.NEXT_PUBLIC_SITE_URL = "https://tarot-aqui.vercel.app";
});

describe("createMercadoPagoPreference", () => {
  it("returns the init_point and sends the right body", async () => {
    preferenceCreateMock.mockResolvedValue({
      init_point: "https://mercadopago.com/checkout/123",
    });

    const url = await createMercadoPagoPreference({
      id: 42,
      serviceName: "Carta consejo",
      priceArs: 2000,
    });

    expect(url).toBe("https://mercadopago.com/checkout/123");
    expect(preferenceCreateMock).toHaveBeenCalledWith({
      body: expect.objectContaining({
        external_reference: "42",
        items: [expect.objectContaining({ unit_price: 2000, currency_id: "ARS" })],
      }),
    });
  });
});

describe("extractMercadoPagoPaymentId", () => {
  it("returns the payment id for a payment notification", () => {
    expect(extractMercadoPagoPaymentId({ type: "payment", data: { id: "999" } })).toBe("999");
  });

  it("returns null for other notification types", () => {
    expect(extractMercadoPagoPaymentId({ type: "merchant_order" })).toBeNull();
  });
});

describe("getMercadoPagoPayment", () => {
  it("maps the payment status and external reference", async () => {
    paymentGetMock.mockResolvedValue({ status: "approved", external_reference: "42" });

    const result = await getMercadoPagoPayment("999");

    expect(result).toEqual({ status: "approved", externalReference: "42" });
  });
});
