"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TarotCards } from "./tarot-cards";
import { StarField } from "./star-field";
import { SunMotif } from "./sun-motif";
import { revealVariants } from "@/lib/motion-variants";

export function Hero() {
  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      <StarField />
      <div className="glow-field" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2 opacity-40">
        <SunMotif />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <TarotCards />

        <motion.p
          variants={revealVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.7, delay: 0.3 }}
          className="font-display text-xs tracking-[0.35em] text-accent uppercase"
        >
          Lecturas de tarot
        </motion.p>

        <motion.h1
          variants={revealVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-display mt-3 text-5xl tracking-wide text-primary sm:text-7xl"
        >
          Tarot aquí
        </motion.h1>

        <motion.p
          variants={revealVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mt-6 max-w-md text-lg text-foreground/80"
        >
          Lecturas de tarot con Sofía, online y a tu ritmo.
        </motion.p>

        <motion.div
          variants={revealVariants}
          initial="hidden"
          animate="visible"
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
