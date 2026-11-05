"use client";

import { motion } from "framer-motion";

const cards = [
  {
    rotate: -14,
    x: -64,
    delay: 0,
    glyph: (
      <path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" />
    ),
  },
  {
    rotate: 0,
    x: 0,
    delay: 0.1,
    glyph: (
      <path d="M20 14.5A8 8 0 1 1 9.5 4a6.4 6.4 0 1 0 10.5 10.5Z" />
    ),
  },
  {
    rotate: 14,
    x: 64,
    delay: 0.2,
    glyph: (
      <path d="M12 3l2.3 5.6L20 11l-5.7 2.4L12 19l-2.3-5.6L4 11l5.7-2.4L12 3Z" />
    ),
  },
];

export function TarotCards() {
  return (
    <div className="relative mx-auto mb-4 h-40 w-full max-w-xs sm:h-48">
      {cards.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30, rotate: card.rotate, x: card.x }}
          animate={{ opacity: 1, y: 0, rotate: card.rotate, x: card.x }}
          transition={{ duration: 0.9, delay: card.delay, ease: "easeOut" }}
          whileHover={{ y: -12, rotate: card.rotate * 0.4, zIndex: 10 }}
          style={{ transformOrigin: "bottom center" }}
          className="absolute left-1/2 top-0 flex h-40 w-24 -translate-x-1/2 flex-col items-center justify-center gap-3 rounded-lg border border-primary/60 bg-gradient-to-b from-card to-background shadow-[0_0_30px_-5px_oklch(0.64_0.19_38/0.35)] sm:h-48 sm:w-28"
        >
          <span className="absolute inset-1.5 rounded-md border border-primary/30" />
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            className="size-7 text-primary"
          >
            {card.glyph}
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
