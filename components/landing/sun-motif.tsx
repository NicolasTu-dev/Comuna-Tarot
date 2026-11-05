export function SunMotif() {
  const rays = Array.from({ length: 16 }, (_, i) => i * (360 / 16));

  return (
    <svg
      viewBox="0 0 400 400"
      aria-hidden="true"
      className="pointer-events-none select-none text-primary"
    >
      <circle
        cx="200"
        cy="200"
        r="60"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeWidth="1"
      />
      {rays.map((deg) => (
        <line
          key={deg}
          x1="200"
          y1="60"
          x2="200"
          y2="10"
          stroke="currentColor"
          strokeOpacity="0.25"
          strokeWidth="1.5"
          transform={`rotate(${deg} 200 200)`}
        />
      ))}
      <circle
        cx="200"
        cy="200"
        r="130"
        fill="none"
        stroke="var(--silver)"
        strokeOpacity="0.15"
        strokeWidth="1"
      />
    </svg>
  );
}
