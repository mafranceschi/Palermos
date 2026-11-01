export const card =
  "rounded-3xl border border-neutral-200/80 dark:border-white/5 bg-white dark:bg-neutral-900 p-5 shadow-[0_1px_2px_rgb(21_38_74/0.04),0_8px_24px_-12px_rgb(21_38_74/0.12)]";

// No padding/width here on purpose: callers that need non-default padding
// (icon-prefixed fields, date inputs, auto-width selects) compose this with
// their own padding/width utilities instead of overriding `input` below.
export const inputBase =
  "rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 transition-[box-shadow,border-color,background-color] focus:bg-white dark:focus:bg-neutral-800";

export const input = `w-full px-4 py-2.5 ${inputBase}`;

export const buttonPrimary =
  "shine inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-orange-500/30 transition-all duration-200 hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/40 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none";

export const buttonSecondary =
  "inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-5 py-2.5 text-sm font-semibold text-navy-800 dark:text-neutral-200 transition-colors hover:border-navy-200 hover:bg-navy-50 dark:hover:bg-neutral-700 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none";

export const buttonGhost =
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-neutral-500 dark:text-neutral-400 transition-colors hover:bg-navy-50 dark:hover:bg-neutral-800 hover:text-navy-800 dark:hover:text-neutral-100";

export const sectionLabel =
  "flex items-center gap-2 text-base font-bold text-navy-900 dark:text-neutral-100";

// Ícono de sección: cuadradito naranja suave, para que cada bloque tenga color
// sin cargar la pantalla.
export const sectionIcon =
  "flex h-7 w-7 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400 [&>svg]:h-4 [&>svg]:w-4";

export const pageHero =
  "relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-700 via-navy-800 to-navy-950 p-6 text-white shadow-xl shadow-navy-900/20 ring-1 ring-white/5 sm:p-8";

// Paleta de avatares alineada con la marca: marinos, naranjas y algunos tonos
// de apoyo para que la lista no se vea repetida.
const AVATAR_GRADIENTS = [
  "from-navy-500 to-navy-800",
  "from-orange-400 to-orange-600",
  "from-sky-500 to-navy-600",
  "from-amber-400 to-orange-500",
  "from-teal-500 to-navy-700",
  "from-navy-400 to-navy-600",
  "from-orange-500 to-rose-600",
  "from-slate-500 to-navy-800",
];

export function getAvatarGradient(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length];
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
