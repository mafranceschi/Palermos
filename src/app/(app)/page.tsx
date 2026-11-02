import Link from "next/link";
import { CarFront, CheckCircle2, PackageCheck, Wrench } from "lucide-react";
import { getJobPricingMap, getJobs, getJobStatusCounts, getSignedPhotoUrl } from "@/lib/data";
import { isAdmin } from "@/lib/auth";
import { summarizePricing } from "@/lib/pricing";
import type { JobStatus } from "@/lib/types";
import { StatCard } from "@/components/StatCard";
import { HeroDecor } from "@/components/HeroDecor";
import { HeroHeading } from "@/components/HeroHeading";
import { Stagger, StaggerItem } from "@/components/motion";
import { card, pageHero } from "@/lib/ui";
import { JobCards } from "./JobCards";
import { JobFilters } from "./JobFilters";

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

  // Ganancia por trabajo, solo para admin. A las tarjetas (componente de
  // cliente) solo les llega el número de ganancia, no los costos.
  const admin = await isAdmin();
  const pricingMap = admin ? await getJobPricingMap(jobs.map((j) => j.id)) : {};

  const jobsWithThumbnails = await Promise.all(
    jobs.map(async (job) => {
      const firstPhoto = job.photos[0];
      const pricing = pricingMap[job.id];
      const profit = pricing ? summarizePricing(pricing).profit : null;
      if (!firstPhoto) return { ...job, thumbnailUrl: null, profit };
      try {
        return { ...job, thumbnailUrl: await getSignedPhotoUrl(firstPhoto.storage_path, 600), profit };
      } catch {
        return { ...job, thumbnailUrl: null, profit };
      }
    })
  );

  return (
    <div className="space-y-6">
      <div className={pageHero}>
        <HeroDecor icon={CarFront} />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <HeroHeading
            eyebrow="Taller Palermo"
            title="Ingresos"
            subtitle="Todo lo que entró al taller, en un solo lugar."
          />
          <Link
            href="/nuevo"
            className="shine hidden items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-navy-800 shadow-lg shadow-navy-950/30 transition-all hover:-translate-y-0.5 hover:text-orange-600 sm:inline-flex"
          >
            + Nuevo ingreso
          </Link>
        </div>
      </div>

      <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StaggerItem>
          <StatCard icon={CarFront} label="Ingresados" value={counts.ingresado} tone="navy" />
        </StaggerItem>
        <StaggerItem>
          <StatCard icon={Wrench} label="En reparación" value={counts.en_reparacion} tone="orange" />
        </StaggerItem>
        <StaggerItem>
          <StatCard icon={CheckCircle2} label="Listos" value={counts.listo} tone="emerald" />
        </StaggerItem>
        <StaggerItem>
          <StatCard icon={PackageCheck} label="Entregados" value={counts.entregado} tone="neutral" />
        </StaggerItem>
      </Stagger>

      <JobFilters
        initial={{ plate, client: clientName, status, from: dateFrom, to: dateTo }}
      />

      {jobs.length === 0 ? (
        <div className={`${card} flex flex-col items-center gap-2 border-dashed py-14 text-center`}>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-600 to-navy-900 text-orange-400 shadow-lg shadow-navy-900/25">
            <CarFront className="h-7 w-7" />
          </div>
          <p className="font-bold text-navy-900 dark:text-neutral-100">
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
