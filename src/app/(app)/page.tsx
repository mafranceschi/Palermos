import Link from "next/link";
import { Car, Search, SlidersHorizontal, X } from "lucide-react";
import { getJobs, getSignedPhotoUrl } from "@/lib/data";
import { JOB_STATUSES, JOB_STATUS_LABELS, type JobStatus } from "@/lib/types";
import { StatusBadge, STATUS_ACCENT } from "@/components/StatusBadge";
import { buttonPrimary, buttonSecondary, card, input } from "@/lib/ui";

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

  const jobs = await getJobs({
    plate: plate || undefined,
    clientName: clientName || undefined,
    status: status || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  });

  const thumbnails = await Promise.all(
    jobs.map(async (job) => {
      const firstPhoto = job.photos[0];
      if (!firstPhoto) return null;
      try {
        return await getSignedPhotoUrl(firstPhoto.storage_path, 600);
      } catch {
        return null;
      }
    })
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
          Ingresos
        </h1>
        <p className="text-sm text-neutral-500">
          {jobs.length} resultado{jobs.length === 1 ? "" : "s"}
        </p>
      </div>

      <form className={`${card} space-y-4`}>
        <div className="flex items-center gap-2 text-sm font-semibold text-neutral-700">
          <SlidersHorizontal className="h-4 w-4 text-orange-600" />
          Filtros
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="relative col-span-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              name="plate"
              defaultValue={plate}
              placeholder="Patente"
              className={`${input} pl-9`}
            />
          </div>
          <div className="relative col-span-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              name="client"
              defaultValue={clientName}
              placeholder="Cliente"
              className={`${input} pl-9`}
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
              className={`${input} px-2`}
            />
            <input
              type="date"
              name="to"
              defaultValue={dateTo}
              className={`${input} px-2`}
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
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
            <Car className="h-6 w-6 text-orange-500" />
          </div>
          <p className="font-medium text-neutral-700">
            {hasFilters ? "No hay ingresos que coincidan" : "Todavía no hay ingresos"}
          </p>
          <p className="text-sm text-neutral-500">
            {hasFilters
              ? "Probá ajustar los filtros de búsqueda."
              : "Registrá el primer vehículo que entra al taller."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job, i) => (
            <Link
              key={job.id}
              href={`/trabajo/${job.id}`}
              className={`group flex gap-3 rounded-2xl border border-l-4 border-neutral-200 bg-white p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg ${STATUS_ACCENT[job.status]}`}
            >
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                {thumbnails[i] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumbnails[i]!}
                    alt={job.vehicle.plate}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-neutral-300">
                    <Car className="h-7 w-7" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-bold text-neutral-900">
                    {job.vehicle.plate}
                  </span>
                  <StatusBadge status={job.status} />
                </div>
                <p className="truncate text-sm text-neutral-600">
                  {job.vehicle.brand} {job.vehicle.model}
                </p>
                <p className="truncate text-sm text-neutral-500">
                  {job.vehicle.client.name}
                </p>
                <p className="text-xs text-neutral-400">
                  {new Date(job.entry_date).toLocaleDateString("es-AR")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
