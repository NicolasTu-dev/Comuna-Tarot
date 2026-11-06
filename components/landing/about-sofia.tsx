"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { revealVariants, revealViewport } from "@/lib/motion-variants";

export function AboutSofia() {
  const [dividerInView, setDividerInView] = useState(false);

  return (
    <section className="relative mx-auto max-w-2xl px-6 py-24">
      <motion.div
        className={`divider-flourish mb-10${dividerInView ? " in-view" : ""}`}
        viewport={revealViewport}
        onViewportEnter={() => setDividerInView(true)}
      >
        <span className="font-display text-xs tracking-[0.35em] uppercase">Sobre Sofía</span>
      </motion.div>
      <motion.p
        variants={revealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        transition={{ duration: 0.7 }}
        className="text-center text-lg leading-relaxed text-foreground/80"
      >
        Sofía lee tarot hace varios años. Cada lectura es un espacio para pensar una pregunta
        puntual o lo que estás atravesando, con las cartas como guía.
      </motion.p>
    </section>
  );
}
