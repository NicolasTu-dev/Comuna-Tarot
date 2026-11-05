import { MercadoPagoConfig, Preference, Payment } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

export interface CreateMercadoPagoPreferenceInput {
  id: number;
  serviceName: string;
  priceArs: number;
}

export async function createMercadoPagoPreference(
  input: CreateMercadoPagoPreferenceInput
): Promise<string> {
  const preference = new Preference(client);
  const result = await preference.create({
    body: {
      items: [
        {
          id: String(input.id),
          title: input.serviceName,
          quantity: 1,
          unit_price: input.priceArs,
          currency_id: "ARS",
        },
      ],
      external_reference: String(input.id),
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_SITE_URL}/pedir/confirmacion?order=${input.id}`,
        failure: `${process.env.NEXT_PUBLIC_SITE_URL}/pedir?error=pago_fallido`,
      },
      notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payments/mercadopago/webhook`,
    },
  });

  return result.init_point!;
}

export interface MercadoPagoWebhookBody {
  type?: string;
  data?: { id?: string };
}

export function extractMercadoPagoPaymentId(
  body: MercadoPagoWebhookBody
): string | null {
  if (body.type === "payment" && body.data?.id) {
    return body.data.id;
  }
  return null;
}

export interface MercadoPagoPaymentDetails {
  status: string;
  externalReference: string;
}

export async function getMercadoPagoPayment(
  paymentId: string
): Promise<MercadoPagoPaymentDetails> {
  const payment = new Payment(client);
  const result = await payment.get({ id: paymentId });
  return {
    status: result.status!,
    externalReference: result.external_reference!,
  };
}
