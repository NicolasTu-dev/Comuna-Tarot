import { NextRequest, NextResponse } from "next/server";
import { constructStripeEvent, extractStripeOrderId } from "@/lib/payments/stripe";
import { getOrderById, markOrderPaid } from "@/lib/db/orders";
import { evaluatePaymentConfirmation } from "@/lib/payments/confirm-order";
import { sendOrderNotification } from "@/lib/notifications/whatsapp";
import { getService } from "@/lib/services";

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Falta la firma" }, { status: 400 });
  }

  let event;
  try {
    event = constructStripeEvent(payload, signature);
  } catch {
    return NextResponse.json({ error: "Firma inválida" }, { status: 400 });
  }

  const orderId = extractStripeOrderId(event);

  if (orderId === null) {
    return NextResponse.json({ ok: true });
  }

  const order = await getOrderById(orderId);

  if (!order) {
    return NextResponse.json({ ok: true });
  }

  const decision = evaluatePaymentConfirmation({ status: order.status });

  if (decision.alreadyProcessed) {
    return NextResponse.json({ ok: true });
  }

  await markOrderPaid(order.id);

  if (decision.shouldNotify) {
    const service = getService(order.serviceId)!;
    try {
      await sendOrderNotification({
        customerName: order.customerName,
        customerWhatsapp: order.customerWhatsapp,
        serviceName: service.name,
        question: order.question,
      });
    } catch (error) {
      console.error(`Failed to notify Sofía for order ${order.id}:`, error);
    }
  }

  return NextResponse.json({ ok: true });
}
