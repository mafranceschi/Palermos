import Link from "next/link";
import { notFound } from "next/navigation";
import { Car, ClipboardList, Mail, Phone } from "lucide-react";
import { getClientById, getClientHistory } from "@/lib/data";
import { StatusBadge, STATUS_TOP_ACCENT } from "@/components/StatusBadge";
import { card, getAvatarGradient, getInitials, sectionLabel } from "@/lib/ui";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await getClientById(id);
  if (!client) notFound();

  const { vehicles, jobs } = await getClientHistory(id);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br p-6 text-white shadow-lg sm:p-8 ${getAvatarGradient(client.name)}`}
      >
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/20 text-2xl font-extrabold backdrop-blur-sm">
            {getInitials(client.name)}
          </span>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              {client.name}
            </h1>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/90">
              {client.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" />
                  {client.phone}
                </span>
              )}
              {client.email && (
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  {client.email}
                </span>
              )}
              {!client.phone && !client.email && <span>Sin datos de contacto</span>}
            </div>
          </div>
        </div>
        {client.notes && (
          <p className="mt-4 text-sm text-white/90">{client.notes}</p>
        )}
      </div>

      <section className={`space-y-3 ${card}`}>
        <h2 className={sectionLabel}>
          <Car className="h-4 w-4 text-orange-600" />
          Vehículos ({vehicles.length})
        </h2>
        {vehicles.length === 0 ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Sin vehículos registrados.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {vehicles.map((v) => (
              <span
                key={v.id}
                className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-sm text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
              >
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">{v.plate}</span>
                {(v.brand || v.model) && (
                  <span className="text-neutral-400">
                    · {[v.brand, v.model].filter(Boolean).join(" ")}
                  </span>
                )}
              </span>
            ))}
          </div>
        )}
      </section>

      <section className={`space-y-3 ${card}`}>
        <h2 className={sectionLabel}>
          <ClipboardList className="h-4 w-4 text-orange-600" />
          Historial de trabajos ({jobs.length})
        </h2>
        {jobs.length === 0 ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Todavía no hay ingresos registrados.
          </p>
        ) : (
          <ul className="space-y-2">
            {jobs.map((job) => (
              <li key={job.id}>
                <Link
                  href={`/trabajo/${job.id}`}
                  className="flex items-center justify-between gap-3 overflow-hidden rounded-2xl border border-neutral-200/70 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800"
                >
                  <div
                    className={`h-full w-1.5 self-stretch bg-gradient-to-b ${STATUS_TOP_ACCENT[job.status]}`}
                  />
                  <div className="min-w-0 flex-1 py-2.5 pr-3">
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {job.vehicle.plate}
                    </p>
                    <p className="truncate text-sm text-neutral-500 dark:text-neutral-400">
                      {job.work_description || job.client_request || "Sin descripción"}
                    </p>
                    <p className="text-xs text-neutral-400 dark:text-neutral-500">
                      {new Date(job.entry_date).toLocaleDateString("es-AR")}
                    </p>
                  </div>
                  <div className="pr-3">
                    <StatusBadge status={job.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
