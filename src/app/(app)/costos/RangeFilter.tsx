"use client";

import { useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CalendarRange, Loader2 } from "lucide-react";
import { inputBase } from "@/lib/ui";

export type RangePreset = { key: string; label: string; href: string };

// Atajos de período + fechas a mano. Todo vive en la URL (?from=&to= o ?all=1).
export function RangeFilter({
  presets,
  activeKey,
  from,
  to,
}: {
  presets: RangePreset[];
  activeKey: string | null;
  from: string;
  to: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, startTransition] = useTransition();

  function setDates(nextFrom: string, nextTo: string) {
    const params = new URLSearchParams();
    if (nextFrom) params.set("from", nextFrom);
    if (nextTo) params.set("to", nextTo);
    if (!nextFrom && !nextTo) params.set("all", "1");
    startTransition(() => router.replace(`${pathname}?${params}`, { scroll: false }));
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        {presets.map((p) => (
          <Link
            key={p.key}
            href={p.href}
            replace
            scroll={false}
            className={`rounded-full px-3.5 py-1.5 text-sm font-semibold ring-1 ring-inset transition-colors ${
              activeKey === p.key
                ? "bg-navy-800 text-white ring-navy-800 dark:bg-orange-500 dark:ring-orange-500"
                : "bg-white text-navy-800 ring-neutral-200 hover:ring-orange-300 hover:text-orange-600 dark:bg-white/5 dark:text-neutral-200 dark:ring-white/10"
            }`}
          >
            {p.label}
          </Link>
        ))}
        {loading && <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />}
      </div>
      <div className="flex items-center gap-2">
        <CalendarRange className="h-4 w-4 shrink-0 text-neutral-400" />
        <input
          type="date"
          aria-label="Desde"
          value={from}
          onChange={(e) => setDates(e.target.value, to)}
          className={`w-full min-w-0 px-3 py-2 sm:w-auto ${inputBase}`}
        />
        <span className="text-neutral-400">–</span>
        <input
          type="date"
          aria-label="Hasta"
          value={to}
          onChange={(e) => setDates(from, e.target.value)}
          className={`w-full min-w-0 px-3 py-2 sm:w-auto ${inputBase}`}
        />
      </div>
    </div>
  );
}
