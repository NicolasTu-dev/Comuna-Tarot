"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { listServices, isPayable } from "@/lib/services";
import { buildWhatsAppLink } from "@/lib/whatsapp-link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { revealVariants, revealViewport } from "@/lib/motion-variants";

export function Services() {
  const whatsappNumber = process.env.NEXT_PUBLIC_SOFIA_WHATSAPP_NUMBER!;

  return (
    <section className="relative mx-auto max-w-5xl px-6 py-24">
      <div className="divider-flourish mb-12">
        <span className="font-display text-xs tracking-[0.35em] uppercase">Servicios</span>
      </div>
      <div className="grid gap-8 sm:grid-cols-3">
        {listServices().map((service, i) => (
          <motion.div
            key={service.id}
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
            transition={{ duration: 0.6, delay: i * 0.12 }}
            whileHover={{ y: -6 }}
            className="group"
          >
            <Card className="flex h-full flex-col justify-between border-primary/25 bg-gradient-to-b from-card to-background transition-shadow duration-300 group-hover:border-silver/50 group-hover:shadow-[0_0_30px_-8px_oklch(0.88_0.015_270/0.45)]">
              <CardHeader>
                <CardTitle className="font-display text-lg tracking-wide">
                  {service.name}
                </CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardFooter className="flex flex-col items-start gap-3">
                <p className="font-display text-xl text-primary">
                  {isPayable(service)
                    ? `$${service.priceArs} ARS / $${service.priceUsd} USD`
                    : "A coordinar"}
                </p>
                {isPayable(service) ? (
                  <Button nativeButton={false} render={<Link href={`/pedir?servicio=${service.id}`} />}>
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
          </motion.div>
        ))}
      </div>
    </section>
  );
}
