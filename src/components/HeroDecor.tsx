import type { LucideIcon } from "lucide-react";

// Fondo de los banners: dos manchas de luz que se mueven muy lento (como
// pintura en aerosol), una trama de puntos que se desvanece y la franja naranja
// de la marca abajo.
export function HeroDecor({ icon: Icon }: { icon?: LucideIcon }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -right-16 -top-24 h-72 w-72 animate-drift rounded-full bg-orange-500/30 blur-3xl" />
      <div className="absolute -bottom-28 left-1/4 h-60 w-80 animate-drift-slow rounded-full bg-navy-400/25 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.08)_1px,transparent_1px)] [background-size:18px_18px] [mask-image:linear-gradient(to_bottom_right,black,transparent_70%)]" />
      {Icon && (
        <Icon className="absolute -right-6 -top-6 h-40 w-40 text-white/[0.07]" strokeWidth={1} />
      )}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-orange-500 via-orange-400/70 to-transparent" />
    </div>
  );
}
