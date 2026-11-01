// Monograma inspirado en el logo de Taller Palermo: la "P" en azul marino con
// la pistola de pintura en naranja apoyada arriba a la izquierda.
export function BrandMark({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dims = { sm: "h-8 w-8", md: "h-10 w-10", lg: "h-14 w-14" }[size];

  return (
    <span
      className={`relative inline-flex ${dims} shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-navy-900/10`}
    >
      <svg viewBox="0 0 40 40" className="h-[78%] w-[78%]" aria-hidden>
        {/* P */}
        <path
          d="M13 9h10.5a8 8 0 0 1 0 16H19v7h-6V9Zm6 5.5v5h4.2a2.5 2.5 0 0 0 0-5H19Z"
          className="fill-navy-700"
        />
        {/* pistola de pintura */}
        <g className="fill-orange-500">
          <rect x="4" y="6" width="9" height="4.5" rx="1.2" />
          <rect x="7.2" y="2.5" width="3" height="4" rx="0.8" />
          <rect x="9.5" y="10" width="3" height="6" rx="1" />
          <circle cx="2.4" cy="8.25" r="1.1" />
        </g>
      </svg>
    </span>
  );
}

export function BrandWordmark({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <span className="flex flex-col leading-none">
      <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-orange-500">
        Taller
      </span>
      <span
        className={`text-base font-extrabold uppercase tracking-tight ${
          tone === "light" ? "text-white" : "text-navy-800"
        }`}
      >
        Palermo
      </span>
    </span>
  );
}
