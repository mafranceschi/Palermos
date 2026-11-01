import { Search, Users } from "lucide-react";
import { getClients } from "@/lib/data";
import { card, inputBase, pageHero } from "@/lib/ui";
import { HeroDecor } from "@/components/HeroDecor";
import { HeroHeading } from "@/components/HeroHeading";
import { ClientCards } from "./ClientCards";

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
      <div className={pageHero}>
        <HeroDecor icon={Users} />
        <div className="relative">
          <HeroHeading
            eyebrow="Taller Palermo"
            title="Clientes"
            subtitle={`${clients.length} cliente${clients.length === 1 ? "" : "s"} registrado${
              clients.length === 1 ? "" : "s"
            } en el taller.`}
          />
        </div>
      </div>

      <form className={`${card} flex gap-2`}>
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Buscar cliente por nombre..."
            className={`w-full py-2.5 pl-10 pr-4 ${inputBase}`}
          />
        </div>
      </form>

      {clients.length === 0 ? (
        <div className={`${card} flex flex-col items-center gap-2 border-dashed py-14 text-center`}>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-600 to-navy-900 text-orange-400 shadow-lg shadow-navy-900/25">
            <Users className="h-7 w-7" />
          </div>
          <p className="font-bold text-navy-900 dark:text-neutral-100">
            {q ? "No hay clientes que coincidan" : "Todavía no hay clientes"}
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {q
              ? "Probá con otro nombre."
              : "Los clientes se crean al registrar un nuevo ingreso."}
          </p>
        </div>
      ) : (
        <ClientCards clients={clients} />
      )}
    </div>
  );
}
