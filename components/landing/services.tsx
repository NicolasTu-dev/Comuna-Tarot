import Link from "next/link";
import { listServices, isPayable } from "@/lib/services";
import { buildWhatsAppLink } from "@/lib/whatsapp-link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

export function Services() {
  const whatsappNumber = process.env.NEXT_PUBLIC_SOFIA_WHATSAPP_NUMBER!;

  return (
    <section className="mx-auto max-w-5xl px-6 py-24">
      <h2 className="font-display text-center text-3xl text-primary">Servicios</h2>
      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {listServices().map((service) => (
          <Card key={service.id} className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle>{service.name}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-col items-start gap-3">
              <p className="font-display text-xl text-primary">
                {isPayable(service)
                  ? `$${service.priceArs} ARS / $${service.priceUsd} USD`
                  : "A coordinar"}
              </p>
              {isPayable(service) ? (
                <Button
                  nativeButton={false}
                  render={<Link href={`/pedir?servicio=${service.id}`} />}
                >
                  Pedir lectura
                </Button>
              ) : (
                <Button
                  nativeButton={false}
                  render={
                    <a
                      href={buildWhatsAppLink(
                        whatsappNumber,
                        `Hola Sofía, quiero coordinar una sesión en vivo de tarot.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                >
                  Consultar por WhatsApp
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
