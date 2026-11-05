import { buildWhatsAppLink } from "@/lib/whatsapp-link";

export function Footer() {
  const whatsappNumber = process.env.NEXT_PUBLIC_SOFIA_WHATSAPP_NUMBER!;

  return (
    <footer className="border-t border-primary/20 px-6 py-12 text-center text-sm text-muted-foreground">
      <a
        href={buildWhatsAppLink(whatsappNumber, "Hola Sofía!")}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline underline-offset-4 transition-colors hover:text-accent"
      >
        Escribir por WhatsApp
      </a>
      <p className="font-display mt-4 text-xs tracking-[0.3em] text-foreground/60 uppercase">
        Tarot aquí 🔑
      </p>
    </footer>
  );
}
