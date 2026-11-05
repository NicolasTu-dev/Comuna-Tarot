import { NextRequest, NextResponse } from "next/server";
import { orderFormSchema } from "@/lib/validation";
import { getService } from "@/lib/services";
import { createOrder } from "@/lib/db/orders";
import { createMercadoPagoPreference } from "@/lib/payments/mercadopago";
import { createStripeCheckoutSession } from "@/lib/payments/stripe";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = orderFormSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const service = getService(parsed.data.serviceId)!;

  const order = await createOrder({
    customerName: parsed.data.name,
    customerWhatsapp: parsed.data.whatsapp,
    serviceId: service.id,
    question: parsed.data.question,
    paymentProvider: parsed.data.paymentProvider,
  });

  const redirectUrl =
    parsed.data.paymentProvider === "mercadopago"
      ? await createMercadoPagoPreference({
          id: order.id,
          serviceName: service.name,
          priceArs: service.priceArs!,
        })
      : await createStripeCheckoutSession({
          id: order.id,
          serviceName: service.name,
          priceUsd: service.priceUsd!,
        });

  return NextResponse.json({ redirectUrl });
}
