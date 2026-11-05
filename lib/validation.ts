import { z } from "zod";
import { PAYABLE_SERVICE_IDS } from "./services";

export const orderFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Ingresá tu nombre completo")
    .max(100, "El nombre es demasiado largo"),
  whatsapp: z
    .string()
    .trim()
    .regex(
      /^\+?[0-9]{8,15}$/,
      "Ingresá un número de WhatsApp válido, con código de país (ej. +5491122334455)"
    ),
  serviceId: z.enum(PAYABLE_SERVICE_IDS, {
    errorMap: () => ({ message: "Elegí un servicio válido" }),
  }),
  question: z
    .string()
    .trim()
    .min(5, "Contanos un poco más sobre tu consulta")
    .max(1000, "Tu consulta es demasiado larga"),
  paymentProvider: z.enum(["mercadopago", "stripe"], {
    errorMap: () => ({ message: "Elegí un método de pago" }),
  }),
});

export type OrderFormInput = z.infer<typeof orderFormSchema>;
