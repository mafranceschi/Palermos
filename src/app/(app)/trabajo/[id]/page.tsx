import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, CarFront, ClipboardList, Images, User } from "lucide-react";
import { getJobById, getSignedPhotoUrls } from "@/lib/data";
import { StatusBadge, STATUS_TOP_ACCENT } from "@/components/StatusBadge";
import { card, sectionLabel } from "@/lib/ui";
import { StatusForm } from "./StatusForm";
import { DetailsForm } from "./DetailsForm";
import { AddPhotosForm } from "./AddPhotosForm";
import { PhotoGallery } from "./PhotoGallery";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getJobById(id);
  if (!job) notFound();

  const photos = await getSignedPhotoUrls(job.photos);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br p-6 text-white shadow-lg sm:p-8 ${STATUS_TOP_ACCENT[job.status]}`}
      >
        <div className="pointer-events-none absolute -right-6 -top-6 opacity-20">
          <CarFront className="h-32 w-32" strokeWidth={1} />
        </div>
        <div className="relative flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              {job.vehicle.plate}
            </h1>
            <p className="text-sm text-white/90">
              {[job.vehicle.brand, job.vehicle.model, job.vehicle.color, job.vehicle.year]
                .filter(Boolean)
                .join(" · ")}
            </p>
            <Link
              href={`/clientes/${job.vehicle.client.id}`}
              className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-sm font-semibold backdrop-blur-sm transition-colors hover:bg-white/30"
            >
              <User className="h-3.5 w-3.5" />
              {job.vehicle.client.name}
            </Link>
          </div>
          <StatusBadge status={job.status} />
        </div>
      </div>

      <section className={`space-y-3 ${card}`}>
        <h2 className={sectionLabel}>
          <ClipboardList className="h-4 w-4 text-orange-600" />
          Estado del trabajo
        </h2>
        <StatusForm jobId={job.id} currentStatus={job.status} />
        <p className="flex items-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-500">
          <Calendar className="h-3.5 w-3.5" />
          Ingresó el {new Date(job.entry_date).toLocaleString("es-AR")}
          {job.exit_date &&
            ` — Entregado el ${new Date(job.exit_date).toLocaleString("es-AR")}`}
        </p>
      </section>

      <section className={`space-y-3 ${card}`}>
        <h2 className={sectionLabel}>Detalle</h2>
        <DetailsForm job={job} />
      </section>

      <section className={`space-y-3 ${card}`}>
        <h2 className={sectionLabel}>
          <Images className="h-4 w-4 text-orange-600" />
          Fotos ({photos.length})
        </h2>
        <PhotoGallery photos={photos} />
        <AddPhotosForm jobId={job.id} />
      </section>
    </div>
  );
}
