import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertCircle, ChevronRight, HandCoins, Paintbrush, TrendingUp, Wallet } from "lucide-react";
import { isAdmin } from "@/lib/auth";
import { getJobPricingMap, getJobs } from "@/lib/data";
import { formatMoney, summarizePricing, type JobPricing } from "@/lib/pricing";
import { card, pageHero, sectionIcon, sectionLabel } from "@/lib/ui";
import { HeroDecor } from "@/components/HeroDecor";
import { HeroHeading } from "@/components/HeroHeading";
import { StatusBadge } from "@/components/StatusBadge";
import { RangeFilter, type RangePreset } from "./RangeFilter";

type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

// Fecha de hoy en Argentina, "YYYY-MM-DD".
function todayAR(): string {
  return new Date(Date.now() - 3 * 3600_000).toISOString().slice(0, 10);
}

function monthRange(year: number, month: number): { from: string; to: string } {
  const from = new Date(Date.UTC(year, month, 1));
  const to = new Date(Date.UTC(year, month + 1, 0));
  return { from: from.toISOString().slice(0, 10), to: to.toISOString().slice(0, 10) };
}

function shiftDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

const summaryCard =
  "rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-[0_1px_2px_rgb(21_38_74/0.04)] dark:border-white/5 dark:bg-neutral-900";

export default async function CostsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // Pantalla solo para admin: para un viewer directamente no existe.
  if (!(await isAdmin())) notFound();

  const params = await searchParams;
  const today = todayAR();
  const [y, m] = today.split("-").map(Number);
  const thisMonth = monthRange(y, m - 1);
  const lastMonth = monthRange(y, m - 2);
  const last30 = { from: shiftDays(today, -29), to: today };

  const presets: (RangePreset & { from: string; to: string })[] = [
    { key: "mes", label: "Este mes", href: `?from=${thisMonth.from}&to=${thisMonth.to}`, ...thisMonth },
    { key: "mes-pasado", label: "Mes pasado", href: `?from=${lastMonth.from}&to=${lastMonth.to}`, ...lastMonth },
    { key: "30", label: "Últimos 30 días", href: `?from=${last30.from}&to=${last30.to}`, ...last30 },
    { key: "todo", label: "Todo", href: "?all=1", from: "", to: "" },
  ];

  // Sin parámetros: este mes.
  const showAll = first(params.all) === "1";
  let from = first(params.from);
  let to = first(params.to);
  if (!showAll && !from && !to) ({ from, to } = thisMonth);
  const activeKey =
    presets.find((p) => (showAll ? p.key === "todo" : p.from === from && p.to === to))?.key ?? null;

  const jobs = await getJobs({ dateFrom: from || undefined, dateTo: to || undefined });
  const pricingMap = await getJobPricingMap(jobs.map((j) => j.id));

  const rows = jobs.map((job) => {
    const pricing: JobPricing | undefined = pricingMap[job.id];
    const summary = pricing ? summarizePricing(pricing) : null;
    return { job, pricing, summary, complete: summary?.profit != null };
  });

  // Los totales cuentan solo trabajos con los tres datos cargados, así la
  // ganancia y el margen no quedan inflados por trabajos a medio cargar.
  const complete = rows.filter((r) => r.complete);
  const totalClient = complete.reduce((sum, r) => sum + (r.pricing!.client_price ?? 0), 0);
  const totalPainter = complete.reduce((sum, r) => sum + (r.summary!.painterCost ?? 0), 0);
  const totalProfit = totalClient - totalPainter;
  const margin = totalClient > 0 ? totalProfit / totalClient : null;
  const missing = rows.length - complete.length;

  return (
    <div className="space-y-5">
      <div className={pageHero}>
        <HeroDecor icon={Wallet} />
        <div className="relative">
          <HeroHeading
            eyebrow="Taller Palermo"
            title="Costos"
            subtitle="Lo que se cobra, lo que se paga al pintor y lo que queda."
          />
        </div>
      </div>

      <div className={card}>
        <RangeFilter presets={presets} activeKey={activeKey} from={from} to={to} />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className={summaryCard}>
          <p className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
            <HandCoins className="h-4 w-4 text-navy-500 dark:text-navy-300" /> Cobrado a clientes
          </p>
          <p className="mt-2 text-xl font-extrabold tabular-nums text-navy-900 sm:text-2xl dark:text-white">
            {formatMoney(totalClient)}
          </p>
        </div>
        <div className={summaryCard}>
          <p className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
            <Paintbrush className="h-4 w-4 text-orange-500" /> Pagado al pintor
          </p>
          <p className="mt-2 text-xl font-extrabold tabular-nums text-navy-900 sm:text-2xl dark:text-white">
            {formatMoney(totalPainter)}
          </p>
        </div>
        <div
          className={`rounded-2xl p-4 ${
            totalProfit < 0
              ? "bg-red-50 ring-1 ring-inset ring-red-200 dark:bg-red-500/10 dark:ring-red-400/20"
              : "bg-emerald-50 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-500/10 dark:ring-emerald-400/20"
          }`}
        >
          <p className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-300">
            <TrendingUp className="h-4 w-4" /> Ganancia
          </p>
          <p
            className={`mt-2 text-xl font-extrabold tabular-nums sm:text-2xl ${
              totalProfit < 0 ? "text-red-600 dark:text-red-400" : "text-emerald-700 dark:text-emerald-300"
            }`}
          >
            {formatMoney(totalProfit)}
          </p>
        </div>
        <div className={summaryCard}>
          <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Margen</p>
          <p className="mt-2 text-xl font-extrabold tabular-nums text-navy-900 sm:text-2xl dark:text-white">
            {margin != null ? `${Math.round(margin * 100)}%` : "—"}
          </p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            {complete.length} trabajo{complete.length === 1 ? "" : "s"} con costos
          </p>
        </div>
      </div>

      {missing > 0 && (
        <p className="flex items-start gap-2 rounded-2xl bg-orange-50 px-4 py-3 text-sm text-orange-800 ring-1 ring-inset ring-orange-200 dark:bg-orange-500/10 dark:text-orange-200 dark:ring-orange-400/20">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {missing === 1
            ? "Hay 1 trabajo en este período sin los costos completos. No entra en los totales."
            : `Hay ${missing} trabajos en este período sin los costos completos. No entran en los totales.`}
        </p>
      )}

      <section className={`space-y-3 ${card}`}>
        <h2 className={sectionLabel}>
          <span className={sectionIcon}>
            <Wallet />
          </span>
          Trabajos ({rows.length})
        </h2>

        {rows.length === 0 ? (
          <p className="py-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
            No hay trabajos en este período.
          </p>
        ) : (
          <ul className="divide-y divide-neutral-200/80 dark:divide-white/5">
            {rows.map(({ job, pricing, summary, complete: done }) => (
              <li key={job.id}>
                <Link
                  href={`/trabajo/${job.id}`}
                  className="group -mx-2 flex items-center gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-neutral-50 dark:hover:bg-white/5"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold tracking-wide text-navy-900 dark:text-white">
                        {job.vehicle.plate}
                      </span>
                      <StatusBadge status={job.status} />
                    </div>
                    <p className="truncate text-sm text-neutral-500 dark:text-neutral-400">
                      {job.vehicle.client.name} · {new Date(job.entry_date).toLocaleDateString("es-AR")}
                    </p>
                    {done ? (
                      <p className="text-xs text-neutral-400 tabular-nums dark:text-neutral-500">
                        {pricing!.panels} paño{pricing!.panels === 1 ? "" : "s"} ·
                        pintor {formatMoney(summary!.painterCost!)} · cobro{" "}
                        {formatMoney(pricing!.client_price!)}
                      </p>
                    ) : (
                      <p className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                        Faltan cargar costos
                      </p>
                    )}
                  </div>
                  {done && (
                    <span
                      className={`shrink-0 text-right font-extrabold tabular-nums ${
                        summary!.profit! < 0
                          ? "text-red-600 dark:text-red-400"
                          : "text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {formatMoney(summary!.profit!)}
                    </span>
                  )}
                  <ChevronRight className="h-4 w-4 shrink-0 text-neutral-300 transition-transform group-hover:translate-x-0.5 group-hover:text-orange-500" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
