import { describe, it, expect, vi, beforeEach } from "vitest";

const { sessionsCreateMock, constructEventMock } = vi.hoisted(() => {
  return {
    sessionsCreateMock: vi.fn(),
    constructEventMock: vi.fn(),
  };
});

vi.mock("stripe", () => {
  const MockStripe = class {
    checkout = { sessions: { create: sessionsCreateMock } };
    webhooks = { constructEvent: constructEventMock };
  };

  return { default: MockStripe };
});

import {
  createStripeCheckoutSession,
  constructStripeEvent,
  extractStripeOrderId,
} from "./stripe";

beforeEach(() => {
  sessionsCreateMock.mockReset();
  constructEventMock.mockReset();
  process.env.NEXT_PUBLIC_SITE_URL = "https://tarot-aqui.vercel.app";
});

describe("createStripeCheckoutSession", () => {
  it("returns the session url and sends the right line item", async () => {
    sessionsCreateMock.mockResolvedValue({ url: "https://checkout.stripe.com/session123" });

    const url = await createStripeCheckoutSession({
      id: 42,
      serviceName: "Carta consejo",
      priceUsd: 2,
    });

    expect(url).toBe("https://checkout.stripe.com/session123");
    expect(sessionsCreateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: { orderId: "42" },
        line_items: [
          expect.objectContaining({
            price_data: expect.objectContaining({
              currency: "usd",
              unit_amount: 200,
            }),
          }),
        ],
      })
    );
  });
});

describe("extractStripeOrderId", () => {
  it("returns the order id for a completed checkout session", () => {
    const event = {
      type: "checkout.session.completed",
      data: { object: { id: "cs_123", metadata: { orderId: "42" } } },
    } as any;

    expect(extractStripeOrderId(event)).toBe(42);
  });

  it("returns null for other event types", () => {
    const event = { type: "payment_intent.created", data: { object: {} } } as any;
    expect(extractStripeOrderId(event)).toBeNull();
  });

  it("returns null when the session has no orderId in metadata", () => {
    const event = {
      type: "checkout.session.completed",
      data: { object: { id: "cs_123", metadata: {} } },
    } as any;

    expect(extractStripeOrderId(event)).toBeNull();
  });
});

describe("constructStripeEvent", () => {
  it("delegates to the Stripe SDK", () => {
    constructEventMock.mockReturnValue({ type: "checkout.session.completed" });
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";

    const event = constructStripeEvent("raw-payload", "sig_header");

    expect(event).toEqual({ type: "checkout.session.completed" });
    expect(constructEventMock).toHaveBeenCalledWith("raw-payload", "sig_header", "whsec_test");
  });
});
