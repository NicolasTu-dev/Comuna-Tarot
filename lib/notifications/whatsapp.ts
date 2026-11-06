export interface OrderNotificationInput {
  customerName: string;
  customerWhatsapp: string;
  serviceName: string;
  question: string;
}

export function buildOrderNotificationMessage(input: OrderNotificationInput): string {
  return `Nuevo pedido en Comuna Tarot 🔮

Servicio: ${input.serviceName}
Cliente: ${input.customerName}
WhatsApp: ${input.customerWhatsapp}
Consulta: ${input.question}`;
}

export async function sendOrderNotification(
  input: OrderNotificationInput
): Promise<void> {
  const message = buildOrderNotificationMessage(input);
  const accountSid = process.env.TWILIO_ACCOUNT_SID!;
  const authToken = process.env.TWILIO_AUTH_TOKEN!;
  const fromNumber = process.env.TWILIO_WHATSAPP_FROM!;
  const toNumber = process.env.SOFIA_WHATSAPP_NUMBER!;

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ From: fromNumber, To: toNumber, Body: message }),
    }
  );

  if (!response.ok) {
    throw new Error(`WhatsApp notification failed: ${response.status} ${await response.text()}`);
  }
}
