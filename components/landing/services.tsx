"use client";

import { useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import Link from "next/link";
import { motion, useMotionValue, useReducedMotion } from "framer-motion";
import { listServices, isPayable, type Service } from "@/lib/services";
import { buildWhatsAppLink } from "@/lib/whatsapp-link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { revealVariants, revealViewport } from "@/lib/motion-variants";

function ServiceCard({
  service,
  index,
  whatsappNumber,
}: {
  service: Service;
  index: number;
  whatsappNumber: string;
}) {
  const reduceMotion = useReducedMotion();
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);

  function handleMouseMove(event: ReactMouseEvent<HTMLDivElement>) {
    if (reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
    const offsetY = (event.clientY - rect.top) / rect.height - 0.5;
    tiltX.set(offsetY * -8);
    tiltY.set(offsetX * 8);
  }

  function handleMouseLeave() {
    tiltX.set(0);
    tiltY.set(0);
  }

  return (
    <motion.div
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      whileHover={{ y: -6 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: "preserve-3d" }}
      className="group"
    >
      <Card className="flex h-full flex-col justify-between border-primary/25 bg-gradient-to-b from-card to-background transition-shadow duration-300 group-hover:border-silver/50 group-hover:shadow-[0_0_30px_-8px_oklch(0.88_0.015_270/0.45)]">
        <CardHeader>
          <CardTitle className="font-display text-lg font-semibold tracking-wide">{service.name}</CardTitle>
          <CardDescription>{service.description}</CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col items-start gap-3">
          <p className="font-display text-xl font-semibold text-primary">
            {isPayable(service) ? `$${service.priceArs} ARS / $${service.priceUsd} USD` : "A coordinar"}
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
                  href={buildWhatsAppLink(whatsappNumber, `Hola Sofía, quiero coordinar una sesión en vivo de tarot.`)}
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
  );
}

export function Services() {
  const whatsappNumber = process.env.NEXT_PUBLIC_SOFIA_WHATSAPP_NUMBER!;
  const [dividerInView, setDividerInView] = useState(false);

  return (
    <section className="relative mx-auto max-w-5xl px-6 py-24">
      <motion.div
        className={`divider-flourish mb-12${dividerInView ? " in-view" : ""}`}
        viewport={revealViewport}
        onViewportEnter={() => setDividerInView(true)}
      >
        <span className="font-display text-xs tracking-[0.35em] uppercase">Servicios</span>
      </motion.div>
      <div className="grid gap-8 sm:grid-cols-3">
        {listServices().map((service, i) => (
          <ServiceCard key={service.id} service={service} index={i} whatsappNumber={whatsappNumber} />
        ))}
      </div>
    </section>
  );
}
