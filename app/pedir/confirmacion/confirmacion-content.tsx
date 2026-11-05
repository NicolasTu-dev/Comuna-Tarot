"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ConfirmacionContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");

  return (
    <main className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="font-display text-4xl text-primary">¡Gracias por tu pedido!</h1>
      <p className="mt-4 text-foreground/80">
        Recibimos tu pago{orderId ? ` (pedido #${orderId})` : ""}. Sofía va a leer tu
        consulta y te va a responder por WhatsApp con la foto de las cartas y su
        interpretación en las próximas 24 a 48 horas.
      </p>
      <Link href="/" className="mt-8 inline-block text-primary underline">
        Volver al inicio
      </Link>
    </main>
  );
}
