"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TarotCards } from "./tarot-cards";

export function Hero() {
  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div className="glow-field" />

      <div className="relative z-10 flex flex-col items-center">
        <TarotCards />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="font-display text-xs tracking-[0.35em] text-accent uppercase"
        >
          Lecturas de tarot
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-display mt-3 text-5xl tracking-wide text-primary sm:text-7xl"
        >
          Tarot aquí
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mt-6 max-w-md text-lg text-foreground/80"
        >
          Lecturas de tarot con Sofía, online y a tu ritmo.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-10"
        >
          <Button
            nativeButton={false}
            render={<Link href="/pedir" />}
            size="lg"
            className="shadow-[0_0_25px_-6px_oklch(0.8_0.15_83/0.6)] transition-shadow hover:shadow-[0_0_35px_-4px_oklch(0.8_0.15_83/0.8)]"
          >
            Pedir lectura
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
