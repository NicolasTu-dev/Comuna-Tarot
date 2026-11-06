"use client";

import { motion } from "framer-motion";
import { revealVariants, revealViewport } from "@/lib/motion-variants";

export function AboutSofia() {
  return (
    <section className="relative mx-auto max-w-2xl px-6 py-24">
      <div className="divider-flourish mb-10">
        <span className="font-display text-xs tracking-[0.35em] uppercase">Sobre Sofía</span>
      </div>
      <motion.p
        variants={revealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        transition={{ duration: 0.7 }}
        className="text-center text-lg leading-relaxed text-foreground/80"
      >
        Sofía lee tarot hace varios años, acompañando a quienes la consultan con
        honestidad y calidez. Cada lectura es un espacio para pensar una pregunta
        puntual o lo que estás atravesando, con las cartas como guía.
      </motion.p>
    </section>
  );
}
