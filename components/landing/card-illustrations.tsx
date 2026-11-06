type IllustrationProps = {
  className?: string;
};

/** El Loco — a figure stepping toward a cliff's edge, sun overhead, a small dog at heel. */
export function FoolIllustration({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 60 100" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="45" cy="16" r="6" />
      <path d="M45 6v4M45 22v4M35 16h4M51 16h4M37.9 8.9l2.8 2.8M49.3 20.3l2.8 2.8M37.9 23.1l2.8-2.8M49.3 11.7l2.8-2.8" strokeWidth="1" opacity="0.8" />

      <path d="M6 86h20M38 86h16" />
      <path d="M26 86v-8h12v8" opacity="0.7" />

      <circle cx="21" cy="38" r="4.5" />
      <path d="M21 42.5v18" />
      <path d="M21 60.5L13 80" />
      <path d="M21 60.5L30 72L33 82" />
      <path d="M21 46L13 54" />
      <path d="M21 46L31 36L37 26" />
      <path d="M35 24l4 1 -1 4Z" opacity="0.8" />

      <path d="M4 82q-3-5 1-7.5q3-2 5.5 0.5q2 2 -0.5 4.5q-3 3 -6 2.5Z" />
      <path d="M9 76q2-2 4-2.5" />
    </svg>
  );
}

/** La Torre — a tower struck by lightning, its crown breaking apart as two figures fall. */
export function TowerIllustration({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 60 100" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M8 90h44" />
      <path d="M18 90V42h24v48" />
      <path d="M18 42h24" />
      <path d="M18 42v-5h5v5M26 42v-5h5v5M35 42v-5h5v5" />

      <path d="M22 54h4M34 54h4M22 68h4M34 68h4" opacity="0.8" />
      <path d="M22.5 52.5l2 3.5M35.5 52.5l-2 3.5" opacity="0.6" />

      <path d="M32 6l-8 18h7l-9 20" strokeWidth="1.6" />

      <path d="M16 37q3-5 6-7M44 37q-3-5-6-7" opacity="0.7" />
      <path d="M12 30q4-3 8-2M48 30q-4-3-8-2" opacity="0.5" />

      <path d="M10 48l5 8-3 10" opacity="0.8" />
      <path d="M50 48l-5 8 3 10" opacity="0.8" />
    </svg>
  );
}

/** La Rueda de la Fortuna — a spoked wheel beneath a crowned finial, resting on its pedestal. */
export function WheelOfFortuneIllustration({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 60 100" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 20l8-9 8 9-4 2h-8Z" />
      <path d="M30 22v8" />

      <circle cx="30" cy="52" r="22" />
      <circle cx="30" cy="52" r="15" opacity="0.6" />
      <circle cx="30" cy="52" r="3.5" />

      <path d="M30 30v-0M30 44v16M30 60v8" opacity="0.8" />
      <path d="M8 52h12M38 52h14" opacity="0.8" />
      <path d="M14.4 36.4l8.5 8.5M37.1 59.1l8.5 8.5" opacity="0.6" />
      <path d="M45.6 36.4l-8.5 8.5M22.9 59.1l-8.5 8.5" opacity="0.6" />

      <circle cx="30" cy="30" r="1.6" />
      <circle cx="30" cy="74" r="1.6" />
      <circle cx="8" cy="52" r="1.6" />
      <circle cx="52" cy="52" r="1.6" />

      <path d="M18 88h24M22 88v-8h16v8" opacity="0.7" />
    </svg>
  );
}

/** Shared card back — a radiating rosette within a frame, the same on every card in a real deck. */
export function CardBackIllustration({ className }: IllustrationProps) {
  const rays = Array.from({ length: 12 }, (_, i) => i * 30);

  return (
    <svg viewBox="0 0 60 100" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" className={className}>
      <rect x="6" y="6" width="48" height="88" rx="3" opacity="0.5" />
      <circle cx="30" cy="50" r="16" opacity="0.7" />
      <circle cx="30" cy="50" r="9" opacity="0.5" />
      <circle cx="30" cy="50" r="2" />
      {rays.map((deg) => (
        <line key={deg} x1="30" y1="34" x2="30" y2="28" transform={`rotate(${deg} 30 50)`} opacity="0.6" />
      ))}
    </svg>
  );
}
