import Link from "next/link";
import { notFound } from "next/navigation";
import { Car, ClipboardList, Mail, Phone, User } from "lucide-react";
import { getClientById, getClientHistory } from "@/lib/data";
import { StatusBadge, STATUS_ACCENT } from "@/components/StatusBadge";
import { card, sectionLabel } from "@/lib/ui";

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
      <div className={`flex items-start gap-3 ${card}`}>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-700">
          <User className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900">
            {client.name}
          </h1>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-500">
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
          {client.notes && (
            <p className="mt-2 text-sm text-neutral-500">{client.notes}</p>
          )}
        </div>
      </div>

      <section className={`space-y-3 ${card}`}>
        <h2 className={sectionLabel}>
          <Car className="h-4 w-4 text-orange-600" />
          Vehículos ({vehicles.length})
        </h2>
        {vehicles.length === 0 ? (
          <p className="text-sm text-neutral-500">Sin vehículos registrados.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {vehicles.map((v) => (
              <span
                key={v.id}
                className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-sm text-neutral-700"
              >
                <span className="font-semibold text-neutral-900">{v.plate}</span>
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
          <p className="text-sm text-neutral-500">
            Todavía no hay ingresos registrados.
          </p>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {jobs.map((job) => (
              <li key={job.id}>
                <Link
                  href={`/trabajo/${job.id}`}
                  className={`-mx-2 flex items-center justify-between gap-3 rounded-xl border-l-4 px-2 py-3 transition-colors hover:bg-neutral-50 ${STATUS_ACCENT[job.status]}`}
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-neutral-900">
                      {job.vehicle.plate}
                    </p>
                    <p className="truncate text-sm text-neutral-500">
                      {job.work_description || job.client_request || "Sin descripción"}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {new Date(job.entry_date).toLocaleDateString("es-AR")}
                    </p>
                  </div>
                  <StatusBadge status={job.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
