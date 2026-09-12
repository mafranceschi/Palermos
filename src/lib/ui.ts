export const card =
  "rounded-3xl border border-neutral-200/70 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-sm";

// No padding/width here on purpose: callers that need non-default padding
// (icon-prefixed fields, date inputs, auto-width selects) compose this with
// their own padding/width utilities instead of overriding `input` below.
export const inputBase =
  "rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 transition-shadow";

export const input = `w-full px-4 py-2.5 ${inputBase}`;

export const buttonPrimary =
  "inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl hover:shadow-orange-500/35 hover:brightness-105 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none";

export const buttonSecondary =
  "inline-flex items-center justify-center gap-2 rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-5 py-2.5 text-sm font-semibold text-neutral-700 dark:text-neutral-200 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-700 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none";

export const buttonGhost =
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-neutral-500 dark:text-neutral-400 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100";

export const sectionLabel =
  "flex items-center gap-2 text-base font-bold text-neutral-900 dark:text-neutral-100";

export const pageHero =
  "relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-red-500 to-rose-600 p-6 text-white shadow-lg shadow-orange-500/25 sm:p-8";

const AVATAR_GRADIENTS = [
  "from-orange-500 to-red-500",
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-purple-500 to-fuchsia-600",
  "from-pink-500 to-rose-600",
  "from-amber-500 to-orange-600",
  "from-cyan-500 to-blue-600",
  "from-lime-500 to-green-600",
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
