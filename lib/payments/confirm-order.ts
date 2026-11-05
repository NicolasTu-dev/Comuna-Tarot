export interface OrderStatusSnapshot {
  status: "pending" | "paid" | "failed";
}

export interface PaymentConfirmationDecision {
  shouldMarkPaid: boolean;
  shouldNotify: boolean;
  alreadyProcessed: boolean;
}

export function evaluatePaymentConfirmation(
  order: OrderStatusSnapshot
): PaymentConfirmationDecision {
  if (order.status === "paid") {
    return { shouldMarkPaid: false, shouldNotify: false, alreadyProcessed: true };
  }

  return { shouldMarkPaid: true, shouldNotify: true, alreadyProcessed: false };
}
