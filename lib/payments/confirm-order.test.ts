import { describe, it, expect } from "vitest";
import { evaluatePaymentConfirmation } from "./confirm-order";

describe("evaluatePaymentConfirmation", () => {
  it("marks paid and notifies for a pending order", () => {
    const decision = evaluatePaymentConfirmation({ status: "pending" });
    expect(decision).toEqual({
      shouldMarkPaid: true,
      shouldNotify: true,
      alreadyProcessed: false,
    });
  });

  it("does nothing for an order that is already paid", () => {
    const decision = evaluatePaymentConfirmation({ status: "paid" });
    expect(decision).toEqual({
      shouldMarkPaid: false,
      shouldNotify: false,
      alreadyProcessed: true,
    });
  });
});
