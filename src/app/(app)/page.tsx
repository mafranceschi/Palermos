import Link from "next/link";
import { CarFront, CheckCircle2, PackageCheck, Search, SlidersHorizontal, Wrench, X } from "lucide-react";
import { getJobs, getJobStatusCounts, getSignedPhotoUrl } from "@/lib/data";
import { JOB_STATUSES, JOB_STATUS_LABELS, type JobStatus } from "@/lib/types";
import { StatCard } from "@/components/StatCard";
import { buttonPrimary, buttonSecondary, card, input, inputBase, pageHero } from "@/lib/ui";
import { JobCards } from "./JobCards";

type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const plate = first(params.plate);
  const clientName = first(params.client);
  const status = first(params.status) as JobStatus | "";
  const dateFrom = first(params.from);
  const dateTo = first(params.to);
  const hasFilters = !!(plate || clientName || status || dateFrom || dateTo);

  const [jobs, counts] = await Promise.all([
    getJobs({
      plate: plate || undefined,
      clientName: clientName || undefined,
      status: status || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    }),
    getJobStatusCounts(),
  ]);

  const jobsWithThumbnails = await Promise.all(
    jobs.map(async (job) => {
      const firstPhoto = job.photos[0];
      if (!firstPhoto) return { ...job, thumbnailUrl: null };
      try {
        return { ...job, thumbnailUrl: await getSignedPhotoUrl(firstPhoto.storage_path, 600) };
      } catch {
        return { ...job, thumbnailUrl: null };
      }
    })
  );

  return (
    <div className="space-y-6">
      <div className={pageHero}>
        <div className="pointer-events-none absolute -right-8 -top-8 opacity-20">
          <CarFront className="h-40 w-40" strokeWidth={1} />
        </div>
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Ingresos
            </h1>
            <p className="mt-1 text-sm text-white/90 sm:text-base">
              Todo lo que entró al taller, en un solo lugar.
            </p>
          </div>
          <Link
            href="/nuevo"
            className="hidden items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-orange-600 shadow-lg transition-transform hover:scale-105 sm:inline-flex"
          >
            + Nuevo ingreso
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          icon={CarFront}
          label="Ingresados"
          value={counts.ingresado}
          gradient="from-blue-500 to-indigo-500"
        />
        <StatCard
          icon={Wrench}
          label="En reparación"
          value={counts.en_reparacion}
          gradient="from-amber-500 to-orange-500"
        />
        <StatCard
          icon={CheckCircle2}
          label="Listos"
          value={counts.listo}
          gradient="from-emerald-500 to-teal-500"
        />
        <StatCard
          icon={PackageCheck}
          label="Entregados"
          value={counts.entregado}
          gradient="from-neutral-400 to-neutral-500"
        />
      </div>

      <form className={`${card} space-y-4`}>
        <div className="flex items-center gap-2 text-sm font-bold text-neutral-700 dark:text-neutral-200">
          <SlidersHorizontal className="h-4 w-4 text-orange-600" />
          Filtros
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="relative col-span-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              name="plate"
              defaultValue={plate}
              placeholder="Patente"
              className={`w-full py-2.5 pl-10 pr-4 ${inputBase}`}
            />
          </div>
          <div className="relative col-span-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              name="client"
              defaultValue={clientName}
              placeholder="Cliente"
              className={`w-full py-2.5 pl-10 pr-4 ${inputBase}`}
            />
          </div>
          <select
            name="status"
            defaultValue={status}
            className={`${input} col-span-1`}
          >
            <option value="">Todos los estados</option>
            {JOB_STATUSES.map((s) => (
              <option key={s} value={s}>
                {JOB_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
          <div className="col-span-1 flex gap-2">
            <input
              type="date"
              name="from"
              defaultValue={dateFrom}
              className={`w-full px-2 py-2.5 ${inputBase}`}
            />
            <input
              type="date"
              name="to"
              defaultValue={dateTo}
              className={`w-full px-2 py-2.5 ${inputBase}`}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button type="submit" className={buttonPrimary}>
            Filtrar
          </button>
          {hasFilters && (
            <Link href="/" className={buttonSecondary}>
              <X className="h-4 w-4" />
              Limpiar
            </Link>
          )}
        </div>
      </form>

      {jobs.length === 0 ? (
        <div className={`${card} flex flex-col items-center gap-2 border-dashed py-14 text-center`}>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25">
            <CarFront className="h-7 w-7" />
          </div>
          <p className="font-bold text-neutral-700 dark:text-neutral-200">
            {hasFilters ? "No hay ingresos que coincidan" : "Todavía no hay ingresos"}
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {hasFilters
              ? "Probá ajustar los filtros de búsqueda."
              : "Registrá el primer vehículo que entra al taller."}
          </p>
        </div>
      ) : (
        <JobCards jobs={jobsWithThumbnails} />
      )}
    </div>
  );
}
