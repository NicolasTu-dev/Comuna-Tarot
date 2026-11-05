import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export interface CreateStripeCheckoutSessionInput {
  id: number;
  serviceName: string;
  priceUsd: number;
}

export async function createStripeCheckoutSession(
  input: CreateStripeCheckoutSessionInput
): Promise<string> {
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: input.serviceName },
          unit_amount: Math.round(input.priceUsd * 100),
        },
        quantity: 1,
      },
    ],
    metadata: { orderId: String(input.id) },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pedir/confirmacion?order=${input.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pedir?error=pago_cancelado`,
  });

  return session.url!;
}

export function constructStripeEvent(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );
}

export function extractStripeOrderId(event: Stripe.Event): number | null {
  if (event.type !== "checkout.session.completed") {
    return null;
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const orderId = session.metadata?.orderId;

  if (!orderId) {
    return null;
  }

  return Number(orderId);
}
