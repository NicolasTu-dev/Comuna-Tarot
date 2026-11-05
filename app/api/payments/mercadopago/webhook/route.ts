import { NextRequest, NextResponse } from "next/server";
import { extractMercadoPagoPaymentId, getMercadoPagoPayment } from "@/lib/payments/mercadopago";
import { getOrderById, markOrderPaid } from "@/lib/db/orders";
import { evaluatePaymentConfirmation } from "@/lib/payments/confirm-order";
import { sendOrderNotification } from "@/lib/notifications/whatsapp";
import { getService } from "@/lib/services";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const paymentId = extractMercadoPagoPaymentId(body);

  if (!paymentId) {
    return NextResponse.json({ ok: true });
  }

  const payment = await getMercadoPagoPayment(paymentId);

  if (payment.status !== "approved") {
    return NextResponse.json({ ok: true });
  }

  const orderId = Number(payment.externalReference);
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
