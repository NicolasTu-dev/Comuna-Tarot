import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/payments/mercadopago", () => ({
  extractMercadoPagoPaymentId: vi.fn(),
  getMercadoPagoPayment: vi.fn(),
}));
vi.mock("@/lib/db/orders", () => ({ getOrderById: vi.fn(), markOrderPaid: vi.fn() }));
vi.mock("@/lib/notifications/whatsapp", () => ({ sendOrderNotification: vi.fn() }));

import { POST } from "./route";
import { extractMercadoPagoPaymentId, getMercadoPagoPayment } from "@/lib/payments/mercadopago";
import { getOrderById, markOrderPaid } from "@/lib/db/orders";
import { sendOrderNotification } from "@/lib/notifications/whatsapp";

function makeRequest(body: unknown) {
  return new NextRequest("http://localhost/api/payments/mercadopago/webhook", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

const order = {
  id: 42,
  customerName: "Ana",
  customerWhatsapp: "+5491122334455",
  serviceId: "carta-consejo",
  question: "¿Cómo me va a ir?",
  paymentProvider: "mercadopago" as const,
  status: "pending" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

beforeEach(() => {
  vi.mocked(extractMercadoPagoPaymentId).mockReset();
  vi.mocked(getMercadoPagoPayment).mockReset();
  vi.mocked(getOrderById).mockReset();
  vi.mocked(markOrderPaid).mockReset();
  vi.mocked(sendOrderNotification).mockReset();
});

describe("POST /api/payments/mercadopago/webhook", () => {
  it("marks the order paid and notifies Sofía on an approved payment", async () => {
    vi.mocked(extractMercadoPagoPaymentId).mockReturnValue("999");
    vi.mocked(getMercadoPagoPayment).mockResolvedValue({
      status: "approved",
      externalReference: "42",
    });
    vi.mocked(getOrderById).mockResolvedValue(order);

    const response = await POST(makeRequest({ type: "payment", data: { id: "999" } }));

    expect(response.status).toBe(200);
    expect(markOrderPaid).toHaveBeenCalledWith(42);
    expect(sendOrderNotification).toHaveBeenCalledWith({
      customerName: "Ana",
      customerWhatsapp: "+5491122334455",
      serviceName: "Carta consejo",
      question: "¿Cómo me va a ir?",
    });
  });

  it("ignores notifications that aren't payments", async () => {
    vi.mocked(extractMercadoPagoPaymentId).mockReturnValue(null);

    const response = await POST(makeRequest({ type: "merchant_order" }));

    expect(response.status).toBe(200);
    expect(getMercadoPagoPayment).not.toHaveBeenCalled();
  });

  it("ignores payments that aren't approved", async () => {
    vi.mocked(extractMercadoPagoPaymentId).mockReturnValue("999");
    vi.mocked(getMercadoPagoPayment).mockResolvedValue({
      status: "pending",
      externalReference: "42",
    });

    const response = await POST(makeRequest({ type: "payment", data: { id: "999" } }));

    expect(response.status).toBe(200);
    expect(markOrderPaid).not.toHaveBeenCalled();
  });

  it("does not notify twice for an order that is already paid", async () => {
    vi.mocked(extractMercadoPagoPaymentId).mockReturnValue("999");
    vi.mocked(getMercadoPagoPayment).mockResolvedValue({
      status: "approved",
      externalReference: "42",
    });
    vi.mocked(getOrderById).mockResolvedValue({ ...order, status: "paid" });

    const response = await POST(makeRequest({ type: "payment", data: { id: "999" } }));

    expect(response.status).toBe(200);
    expect(markOrderPaid).not.toHaveBeenCalled();
    expect(sendOrderNotification).not.toHaveBeenCalled();
  });

  it("logs and still returns 200 when the WhatsApp notification fails", async () => {
    vi.mocked(extractMercadoPagoPaymentId).mockReturnValue("999");
    vi.mocked(getMercadoPagoPayment).mockResolvedValue({
      status: "approved",
      externalReference: "42",
    });
    vi.mocked(getOrderById).mockResolvedValue(order);
    vi.mocked(sendOrderNotification).mockRejectedValue(new Error("Twilio down"));
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await POST(makeRequest({ type: "payment", data: { id: "999" } }));

    expect(response.status).toBe(200);
    expect(markOrderPaid).toHaveBeenCalledWith(42);
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
