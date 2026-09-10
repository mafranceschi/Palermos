import Link from "next/link";
import { getJobs, getSignedPhotoUrl } from "@/lib/data";
import { JOB_STATUSES, JOB_STATUS_LABELS, type JobStatus } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";

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
        <h1 className="text-lg font-semibold">Ingresos</h1>
        <p className="text-sm text-neutral-500">
          {jobs.length} resultado{jobs.length === 1 ? "" : "s"}
        </p>
      </div>

      <form className="grid grid-cols-2 gap-3 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm sm:grid-cols-4">
        <input
          type="text"
          name="plate"
          defaultValue={plate}
          placeholder="Patente"
          className="col-span-1 rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
        <input
          type="text"
          name="client"
          defaultValue={clientName}
          placeholder="Cliente"
          className="col-span-1 rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
        <select
          name="status"
          defaultValue={status}
          className="col-span-1 rounded-md border border-neutral-300 px-3 py-2 text-sm"
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
            className="w-full rounded-md border border-neutral-300 px-2 py-2 text-sm"
          />
          <input
            type="date"
            name="to"
            defaultValue={dateTo}
            className="w-full rounded-md border border-neutral-300 px-2 py-2 text-sm"
          />
        </div>
        <div className="col-span-2 flex gap-2 sm:col-span-4">
          <button
            type="submit"
            className="rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-700"
          >
            Filtrar
          </button>
          <Link
            href="/"
            className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-600"
          >
            Limpiar
          </Link>
        </div>
      </form>

      {jobs.length === 0 ? (
        <p className="rounded-lg border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500">
          No hay ingresos que coincidan con la búsqueda.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job, i) => (
            <Link
              key={job.id}
              href={`/trabajo/${job.id}`}
              className="flex gap-3 rounded-lg border border-neutral-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-neutral-100">
                {thumbnails[i] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumbnails[i]!}
                    alt={job.vehicle.plate}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
                    Sin foto
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-semibold">
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
