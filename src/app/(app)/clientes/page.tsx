import Link from "next/link";
import { Car, Mail, Phone, Search, User, Users } from "lucide-react";
import { getClients } from "@/lib/data";
import { card, input } from "@/lib/ui";

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";

  const clients = await getClients(q || undefined);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          Clientes
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {clients.length} cliente{clients.length === 1 ? "" : "s"}
        </p>
      </div>

      <form className={`${card} flex gap-2`}>
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Buscar cliente por nombre..."
            className={`${input} pl-9`}
          />
        </div>
      </form>

      {clients.length === 0 ? (
        <div className={`${card} flex flex-col items-center gap-2 border-dashed py-14 text-center`}>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 dark:bg-orange-500/10">
            <Users className="h-6 w-6 text-orange-500" />
          </div>
          <p className="font-medium text-neutral-700 dark:text-neutral-200">
            {q ? "No hay clientes que coincidan" : "Todavía no hay clientes"}
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {q
              ? "Probá con otro nombre."
              : "Los clientes se crean al registrar un nuevo ingreso."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <Link
              key={client.id}
              href={`/clientes/${client.id}`}
              className="group flex items-start gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400">
                <User className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1 space-y-1">
                <p className="truncate font-semibold text-neutral-900 dark:text-neutral-100">
                  {client.name}
                </p>
                {client.phone && (
                  <p className="flex items-center gap-1.5 truncate text-sm text-neutral-500 dark:text-neutral-400">
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    {client.phone}
                  </p>
                )}
                {client.email && (
                  <p className="flex items-center gap-1.5 truncate text-sm text-neutral-500 dark:text-neutral-400">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    {client.email}
                  </p>
                )}
                <p className="flex items-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-500">
                  <Car className="h-3.5 w-3.5" />
                  {client.vehicleCount} vehículo{client.vehicleCount === 1 ? "" : "s"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
