"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TarotCards } from "./tarot-cards";
import { SunMotif } from "./sun-motif";
import { revealVariants } from "@/lib/motion-variants";

const TITLE = "Tarot aquí";

const titleContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.4 },
  },
};

const titleLetter = {
  hidden: { opacity: 0, y: 24, rotate: -4 },
  visible: { opacity: 1, y: 0, rotate: 0 },
};

export function Hero() {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 600], [0, 160]);
  const sunY = useTransform(scrollY, [0, 600], [0, 90]);

  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      <motion.div
        style={{
          y: backgroundY,
          maskImage: "linear-gradient(to bottom, transparent, black 20%, black 65%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 20%, black 65%, transparent)",
        }}
        className="absolute inset-0"
      >
        <div className="glow-field" />
      </motion.div>
      <motion.div
        style={{
          y: sunY,
          maskImage: "radial-gradient(circle at center, black 35%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(circle at center, black 35%, transparent 70%)",
        }}
        animate={reduceMotion ? undefined : { opacity: [0.35, 0.55, 0.35], scale: [1, 1.05, 1] }}
        transition={reduceMotion ? undefined : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2 opacity-40"
      >
        <SunMotif />
      </motion.div>

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
          variants={titleContainer}
          initial="hidden"
          animate="visible"
          aria-label={TITLE}
          className="font-display mt-3 text-5xl font-semibold tracking-wide text-primary sm:text-7xl"
        >
          {TITLE.split("").map((char, i) => (
            <motion.span key={i} variants={titleLetter} transition={{ duration: 0.5 }} className="inline-block">
              {char === " " ? " " : char}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          variants={revealVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-6 max-w-md text-lg text-foreground/80"
        >
          Lecturas de tarot online.
        </motion.p>

        <motion.div
          variants={revealVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.8, delay: 1.25 }}
          className="mt-10"
        >
          <Button
            nativeButton={false}
            render={<Link href="/pedir" />}
            size="lg"
            className="cta-pulse transition-shadow hover:shadow-[0_0_45px_-2px_oklch(0.8_0.15_83/0.9)]"
          >
            Pedir lectura
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
