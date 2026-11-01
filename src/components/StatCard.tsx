import type { LucideIcon } from "lucide-react";
import { CountUp } from "./motion";

export type StatTone = "navy" | "orange" | "emerald" | "neutral";

const TONES: Record<StatTone, { icon: string; bar: string }> = {
  navy: {
    icon: "bg-navy-50 text-navy-600 dark:bg-navy-500/15 dark:text-navy-200",
    bar: "from-navy-400 to-navy-700",
  },
  orange: {
    icon: "bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300",
    bar: "from-orange-400 to-orange-600",
  },
  emerald: {
    icon: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300",
    bar: "from-emerald-400 to-teal-600",
  },
  neutral: {
    icon: "bg-neutral-100 text-neutral-500 dark:bg-white/5 dark:text-neutral-300",
    bar: "from-neutral-300 to-neutral-500",
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
    <div className="group relative h-full overflow-hidden rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-[0_1px_2px_rgb(21_38_74/0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-navy-900/5 dark:border-white/5 dark:bg-neutral-900">
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
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${t.icon}`}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <div
        className={`absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r transition-transform duration-500 group-hover:scale-x-100 ${t.bar}`}
      />
    </div>
  );
}
