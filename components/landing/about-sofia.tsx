"use client";

import { motion } from "framer-motion";

export function AboutSofia() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-24">
      <div className="divider-flourish mb-10">
        <span className="font-display text-xs tracking-[0.35em] uppercase">Sobre Sofía</span>
      </div>
      <motion.p
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
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
