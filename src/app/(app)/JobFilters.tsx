"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, Search, SlidersHorizontal, X } from "lucide-react";
import { JOB_STATUSES, JOB_STATUS_LABELS } from "@/lib/types";
import { buttonSecondary, card, input, inputBase, sectionIcon } from "@/lib/ui";

type Filters = { plate: string; client: string; status: string; from: string; to: string };

const EMPTY: Filters = { plate: "", client: "", status: "", from: "", to: "" };
const TYPING_DELAY_MS = 350;

// Los filtros se aplican solos: al escribir (con una pequeña espera para no
// buscar en cada letra) y al cambiar estado o fechas. Se reflejan en la URL,
// así la búsqueda se mantiene al volver atrás o recargar.
export function JobFilters({ initial }: { initial: Filters }) {
  const router = useRouter();
  const pathname = usePathname();
  const [filters, setFilters] = useState(initial);
  const [searching, startTransition] = useTransition();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function apply(next: Filters) {
    if (timer.current) clearTimeout(timer.current);
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(next)) {
      if (value.trim()) params.set(key, value.trim());
    }
    const query = params.toString();
    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    });
  }

  function update(key: keyof Filters, value: string, { debounce = false } = {}) {
    const next = { ...filters, [key]: value };
    setFilters(next);
    if (!debounce) return apply(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => apply(next), TYPING_DELAY_MS);
  }

  const hasFilters = Object.values(filters).some((v) => v.trim());

  return (
    <form
      className={`${card} space-y-4`}
      onSubmit={(e) => {
        // Enter (o "Ir" en el teclado del celular) busca al instante.
        e.preventDefault();
        apply(filters);
      }}
    >
      <div className="flex items-center gap-2 text-sm font-bold text-navy-900 dark:text-neutral-100">
        <span className={sectionIcon}>
          <SlidersHorizontal />
        </span>
        Filtros
        {searching && <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="relative col-span-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="search"
            name="plate"
            value={filters.plate}
            onChange={(e) => update("plate", e.target.value, { debounce: true })}
            placeholder="Patente"
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="search"
            className={`w-full py-2.5 pl-10 pr-4 uppercase placeholder:normal-case ${inputBase}`}
          />
        </div>
        <div className="relative col-span-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="search"
            name="client"
            value={filters.client}
            onChange={(e) => update("client", e.target.value, { debounce: true })}
            placeholder="Cliente"
            enterKeyHint="search"
            className={`w-full py-2.5 pl-10 pr-4 ${inputBase}`}
          />
        </div>
        <select
          name="status"
          value={filters.status}
          onChange={(e) => update("status", e.target.value)}
          className={`${input} col-span-2 sm:col-span-1`}
        >
          <option value="">Todos los estados</option>
          {JOB_STATUSES.map((s) => (
            <option key={s} value={s}>
              {JOB_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <div className="col-span-2 grid grid-cols-2 gap-2 sm:col-span-3">
          <input
            type="date"
            name="from"
            value={filters.from}
            onChange={(e) => update("from", e.target.value)}
            aria-label="Desde"
            className={`w-full min-w-0 px-3 py-2.5 ${inputBase}`}
          />
          <input
            type="date"
            name="to"
            value={filters.to}
            onChange={(e) => update("to", e.target.value)}
            aria-label="Hasta"
            className={`w-full min-w-0 px-3 py-2.5 ${inputBase}`}
          />
        </div>
      </div>
      {hasFilters && (
        <button
          type="button"
          onClick={() => {
            setFilters(EMPTY);
            apply(EMPTY);
          }}
          className={buttonSecondary}
        >
          <X className="h-4 w-4" />
          Limpiar filtros
        </button>
      )}
    </form>
  );
}
