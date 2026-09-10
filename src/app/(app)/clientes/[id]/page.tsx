import Link from "next/link";
import { notFound } from "next/navigation";
import { getClientById, getClientHistory } from "@/lib/data";
import { StatusBadge } from "@/components/StatusBadge";

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
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold">{client.name}</h1>
        <p className="text-sm text-neutral-500">
          {[client.phone, client.email].filter(Boolean).join(" · ") ||
            "Sin datos de contacto"}
        </p>
        {client.notes && (
          <p className="mt-1 text-sm text-neutral-500">{client.notes}</p>
        )}
      </div>

      <section className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 font-medium">
          Vehículos ({vehicles.length})
        </h2>
        {vehicles.length === 0 ? (
          <p className="text-sm text-neutral-500">Sin vehículos registrados.</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {vehicles.map((v) => (
              <li key={v.id}>
                <span className="font-medium">{v.plate}</span> — {v.brand}{" "}
                {v.model} {v.color}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 font-medium">
          Historial de trabajos ({jobs.length})
        </h2>
        {jobs.length === 0 ? (
          <p className="text-sm text-neutral-500">
            Todavía no hay ingresos registrados.
          </p>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {jobs.map((job) => (
              <li key={job.id} className="py-3">
                <Link
                  href={`/trabajo/${job.id}`}
                  className="flex items-center justify-between gap-3 hover:underline"
                >
                  <div>
                    <p className="font-medium">{job.vehicle.plate}</p>
                    <p className="text-sm text-neutral-500">
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
