import { buildWhatsAppLink } from "@/lib/whatsapp-link";

export function Footer() {
  const whatsappNumber = process.env.NEXT_PUBLIC_SOFIA_WHATSAPP_NUMBER!;

  return (
    <footer className="border-t border-border px-6 py-10 text-center text-sm text-muted-foreground">
      <a
        href={buildWhatsAppLink(whatsappNumber, "Hola Sofía!")}
        target="_blank"
        rel="noopener noreferrer"
        className="underline"
      >
        Escribir por WhatsApp
      </a>
      <p className="mt-2">Tarot aquí 🔑 — lecturas de tarot online</p>
    </footer>
  );
}
