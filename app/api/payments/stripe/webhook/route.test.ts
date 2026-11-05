import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/payments/stripe", () => ({
  constructStripeEvent: vi.fn(),
  extractStripeOrderId: vi.fn(),
}));
vi.mock("@/lib/db/orders", () => ({ getOrderById: vi.fn(), markOrderPaid: vi.fn() }));
vi.mock("@/lib/notifications/whatsapp", () => ({ sendOrderNotification: vi.fn() }));

import { POST } from "./route";
import { constructStripeEvent, extractStripeOrderId } from "@/lib/payments/stripe";
import { getOrderById, markOrderPaid } from "@/lib/db/orders";
import { sendOrderNotification } from "@/lib/notifications/whatsapp";

function makeRequest(body: string, signature: string | null) {
  const headers = new Headers();
  if (signature) headers.set("stripe-signature", signature);
  return new NextRequest("http://localhost/api/payments/stripe/webhook", {
    method: "POST",
    body,
    headers,
  });
}

const order = {
  id: 42,
  customerName: "Ana",
  customerWhatsapp: "+5491122334455",
  serviceId: "carta-consejo",
  question: "¿Cómo me va a ir?",
  paymentProvider: "stripe" as const,
  status: "pending" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

beforeEach(() => {
  vi.mocked(constructStripeEvent).mockReset();
  vi.mocked(extractStripeOrderId).mockReset();
  vi.mocked(getOrderById).mockReset();
  vi.mocked(markOrderPaid).mockReset();
  vi.mocked(sendOrderNotification).mockReset();
});

describe("POST /api/payments/stripe/webhook", () => {
  it("rejects a request without a signature header", async () => {
    const response = await POST(makeRequest("{}", null));
    expect(response.status).toBe(400);
  });

  it("rejects a request with an invalid signature", async () => {
    vi.mocked(constructStripeEvent).mockImplementation(() => {
      throw new Error("invalid signature");
    });

    const response = await POST(makeRequest("{}", "bad-signature"));
    expect(response.status).toBe(400);
  });

  it("marks the order paid and notifies Sofía on checkout.session.completed", async () => {
    vi.mocked(constructStripeEvent).mockReturnValue({ type: "checkout.session.completed" } as any);
    vi.mocked(extractStripeOrderId).mockReturnValue(42);
    vi.mocked(getOrderById).mockResolvedValue(order);

    const response = await POST(makeRequest("{}", "good-signature"));

    expect(response.status).toBe(200);
    expect(markOrderPaid).toHaveBeenCalledWith(42);
    expect(sendOrderNotification).toHaveBeenCalledWith({
      customerName: "Ana",
      customerWhatsapp: "+5491122334455",
      serviceName: "Carta consejo",
      question: "¿Cómo me va a ir?",
    });
  });

  it("does not notify twice for an order that is already paid", async () => {
    vi.mocked(constructStripeEvent).mockReturnValue({ type: "checkout.session.completed" } as any);
    vi.mocked(extractStripeOrderId).mockReturnValue(42);
    vi.mocked(getOrderById).mockResolvedValue({ ...order, status: "paid" });

    const response = await POST(makeRequest("{}", "good-signature"));

    expect(response.status).toBe(200);
    expect(markOrderPaid).not.toHaveBeenCalled();
    expect(sendOrderNotification).not.toHaveBeenCalled();
  });

  it("ignores irrelevant event types", async () => {
    vi.mocked(constructStripeEvent).mockReturnValue({ type: "payment_intent.created" } as any);
    vi.mocked(extractStripeOrderId).mockReturnValue(null);

    const response = await POST(makeRequest("{}", "good-signature"));

    expect(response.status).toBe(200);
    expect(getOrderById).not.toHaveBeenCalled();
  });

  it("logs and still returns 200 when the WhatsApp notification fails", async () => {
    vi.mocked(constructStripeEvent).mockReturnValue({ type: "checkout.session.completed" } as any);
    vi.mocked(extractStripeOrderId).mockReturnValue(42);
    vi.mocked(getOrderById).mockResolvedValue(order);
    vi.mocked(sendOrderNotification).mockRejectedValue(new Error("Twilio down"));
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await POST(makeRequest("{}", "good-signature"));

    expect(response.status).toBe(200);
    expect(markOrderPaid).toHaveBeenCalledWith(42);
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
