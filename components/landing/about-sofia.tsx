"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { revealVariants, revealViewport } from "@/lib/motion-variants";

export function AboutSofia() {
  const [dividerInView, setDividerInView] = useState(false);

  return (
    <section className="relative mx-auto max-w-2xl px-6 pt-20 pb-10">
      <motion.div
        className={`divider-flourish mb-10 ${dividerInView ? "in-view" : ""}`}
        viewport={revealViewport}
        onViewportEnter={() => setDividerInView(true)}
      >
        <span className="font-display text-xs tracking-[0.35em] uppercase">Sobre Sofía</span>
      </motion.div>
      <motion.div
        variants={revealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        transition={{ duration: 0.7 }}
        className="relative rounded-2xl border border-primary/20 bg-card/50 px-8 py-10 shadow-[0_0_40px_-20px_oklch(0.8_0.15_83/0.5)] backdrop-blur-sm sm:px-12"
      >
        <span aria-hidden="true" className="font-display absolute -top-5 left-8 text-6xl text-primary/40 sm:left-10">
          “
        </span>
        <p className="text-center text-lg leading-relaxed text-foreground/80">
          Sofía lee tarot hace varios años. Cada lectura es un espacio para pensar una pregunta
          puntual o lo que estás atravesando, con las cartas como guía.
        </p>
      </motion.div>
    </section>
  );
}
