import type { LucideIcon } from "lucide-react";
import { CountUp } from "./motion";

export type StatTone = "navy" | "orange" | "emerald" | "neutral";

const TONES: Record<StatTone, { icon: string }> = {
  navy: {
    icon: "bg-navy-50 text-navy-600 dark:bg-navy-500/15 dark:text-navy-200",
  },
  orange: {
    icon: "bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300",
  },
  emerald: {
    icon: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300",
  },
  neutral: {
    icon: "bg-neutral-100 text-neutral-500 dark:bg-white/5 dark:text-neutral-300",
  },
};

export function StatCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  tone: StatTone;
}) {
  const t = TONES[tone];
  return (
    // Solo informativa: sin efectos de hover para que no parezca tocable.
    <div className="h-full rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-[0_1px_2px_rgb(21_38_74/0.04)] dark:border-white/5 dark:bg-neutral-900">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-3xl font-extrabold leading-none tabular-nums text-navy-900 dark:text-white">
            <CountUp value={value} />
          </p>
          <p className="mt-1.5 truncate text-xs font-semibold text-neutral-500 dark:text-neutral-400">
            {label}
          </p>
        </div>
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${t.icon}`}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}
