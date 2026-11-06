"use client";

import { useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { motion, useMotionValue, useReducedMotion } from "framer-motion";
import {
  FoolIllustration,
  TowerIllustration,
  WheelOfFortuneIllustration,
  CardBackIllustration,
} from "./card-illustrations";

const cards = [
  { name: "El Loco", rotate: -14, x: -64, delay: 0, floatDuration: 4.2, Illustration: FoolIllustration },
  { name: "La Torre", rotate: 0, x: 0, delay: 0.1, floatDuration: 4.8, Illustration: TowerIllustration },
  {
    name: "La Rueda de la Fortuna",
    rotate: 14,
    x: 64,
    delay: 0.2,
    floatDuration: 4.5,
    Illustration: WheelOfFortuneIllustration,
  },
];

type Card = (typeof cards)[number];

function TarotCard({ card, flipped, onToggle }: { card: Card; flipped: boolean; onToggle: () => void }) {
  const reduceMotion = useReducedMotion();
  const tiltX = useMotionValue(0);
  const tiltZ = useMotionValue(0);
  const Illustration = card.Illustration;

  function handleMouseMove(event: ReactMouseEvent<HTMLButtonElement>) {
    if (reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
    const offsetY = (event.clientY - rect.top) / rect.height - 0.5;
    tiltX.set(offsetY * -14);
    tiltZ.set(offsetX * 6);
  }

  function handleMouseLeave() {
    tiltX.set(0);
    tiltZ.set(0);
  }

  return (
    <motion.button
      type="button"
      aria-label={`Carta de tarot decorativa: ${card.name}`}
      aria-pressed={flipped}
      onClick={onToggle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30, x: card.x, rotate: card.rotate }}
      animate={{ opacity: 1, y: 0, x: card.x, rotate: card.rotate }}
      transition={{ duration: 0.9, delay: card.delay, ease: "easeOut" }}
      whileHover={{ zIndex: 10 }}
      style={{ transformOrigin: "bottom center", transformStyle: "preserve-3d" }}
      className="absolute left-1/2 top-0 h-40 w-24 -translate-x-1/2 cursor-pointer sm:h-48 sm:w-28"
    >
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
        transition={
          reduceMotion
            ? undefined
            : { duration: card.floatDuration, repeat: Infinity, ease: "easeInOut", delay: card.delay }
        }
        style={{ rotateX: tiltX, rotateZ: tiltZ, transformStyle: "preserve-3d" }}
        className="h-full w-full"
      >
        <motion.span
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5 }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative block h-full w-full"
        >
          <span
            style={{ backfaceVisibility: "hidden" }}
            className="absolute inset-0 flex items-center justify-center rounded-lg border border-primary/60 bg-gradient-to-b from-card to-background p-2.5 shadow-[0_0_30px_-5px_oklch(0.64_0.19_38/0.35)]"
          >
            <span className="absolute inset-1.5 rounded-md border border-primary/30" />
            <Illustration className="h-full w-full text-primary" />
          </span>
          <span
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            className="absolute inset-0 flex items-center justify-center rounded-lg border border-silver/60 bg-gradient-to-b from-card to-background p-2.5 shadow-[0_0_30px_-5px_oklch(0.88_0.015_270/0.35)]"
          >
            <span className="absolute inset-1.5 rounded-md border border-silver/30" />
            <CardBackIllustration className="h-full w-full text-silver" />
          </span>
        </motion.span>
      </motion.div>
    </motion.button>
  );
}

export function TarotCards() {
  const [flipped, setFlipped] = useState<boolean[]>([false, false, false]);

  function toggle(index: number) {
    setFlipped((prev) => prev.map((value, i) => (i === index ? !value : value)));
  }

  return (
    <div className="relative mx-auto mb-4 h-40 w-full max-w-xs sm:h-48">
      {cards.map((card, i) => (
        <TarotCard key={card.name} card={card} flipped={flipped[i]} onToggle={() => toggle(i)} />
      ))}
    </div>
  );
}
