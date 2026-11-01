import Link from "next/link";
import { BackButton } from "@/components/BackButton";
import { notFound } from "next/navigation";
import { Car, ClipboardList, Mail, Phone } from "lucide-react";
import { getClientById, getClientHistory } from "@/lib/data";
import { StatusBadge, STATUS_TOP_ACCENT } from "@/components/StatusBadge";
import { card, getAvatarGradient, getInitials, pageHero, sectionIcon, sectionLabel } from "@/lib/ui";
import { HeroDecor } from "@/components/HeroDecor";
import { DeleteButton } from "@/components/DeleteButton";
import { isAdmin } from "@/lib/auth";
import { deleteClientAction } from "./actions";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await getClientById(id);
  if (!client) notFound();

  const [{ vehicles, jobs }, admin] = await Promise.all([getClientHistory(id), isAdmin()]);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <BackButton fallbackHref={"/clientes"} />
      </div>
      <div className={pageHero}>
        <HeroDecor />
        <div className="relative flex items-center gap-4">
          <span
            className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl font-extrabold shadow-lg ring-2 ring-white/20 ${getAvatarGradient(client.name)}`}
          >
            {getInitials(client.name)}
          </span>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              {client.name}
            </h1>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-navy-100/90">
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
          <p className="relative mt-4 text-sm text-navy-100/90">{client.notes}</p>
        )}
      </div>

      <section className={`space-y-3 ${card}`}>
        <h2 className={sectionLabel}>
          <span className={sectionIcon}>
            <Car />
          </span>
          Vehículos ({vehicles.length})
        </h2>
        {vehicles.length === 0 ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Sin vehículos registrados.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {vehicles.map((v) => (
              <span
                key={v.id}
                className="inline-flex items-center gap-1.5 rounded-full bg-navy-50 px-3 py-1.5 text-sm text-neutral-700 ring-1 ring-inset ring-navy-100 dark:bg-navy-500/10 dark:text-neutral-300 dark:ring-navy-400/20"
              >
                <span className="font-mono font-bold tracking-wide text-navy-800 dark:text-white">{v.plate}</span>
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
          <span className={sectionIcon}>
            <ClipboardList />
          </span>
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
                  className="group flex items-center justify-between gap-3 overflow-hidden rounded-2xl border border-neutral-200/80 transition-all duration-300 hover:translate-x-1 hover:border-orange-200 hover:bg-orange-50/40 dark:border-white/5 dark:hover:border-orange-500/30 dark:hover:bg-white/5"
                >
                  <div
                    className={`h-full w-1.5 self-stretch bg-gradient-to-b ${STATUS_TOP_ACCENT[job.status]}`}
                  />
                  <div className="min-w-0 flex-1 py-2.5 pr-3">
                    <p className="font-mono font-bold tracking-wide text-navy-900 dark:text-white">
                      {job.vehicle.plate}
                    </p>
                    <p className="truncate text-sm text-neutral-500 dark:text-neutral-400">
                      {[
                        job.client_request && `Chapa: ${job.client_request}`,
                        job.work_description && `Pintura: ${job.work_description}`,
                      ]
                        .filter(Boolean)
                        .join(" · ") || "Sin descripción"}
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

      {admin && (
        <div className="flex justify-end pt-2">
          <DeleteButton
            action={deleteClientAction.bind(null, client.id)}
            label="Eliminar cliente"
            confirmTitle={`¿Eliminar a ${client.name}?`}
            confirmText={
              <p>
                Se borra el cliente junto con{" "}
                <strong>
                  {vehicles.length} vehículo{vehicles.length === 1 ? "" : "s"}
                </strong>{" "}
                y{" "}
                <strong>
                  {jobs.length} trabajo{jobs.length === 1 ? "" : "s"}
                </strong>{" "}
                con todas sus fotos. No se puede deshacer.
              </p>
            }
          />
        </div>
      )}
    </div>
  );
}
