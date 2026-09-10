import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, ClipboardList, Images, User } from "lucide-react";
import { getJobById, getSignedPhotoUrls } from "@/lib/data";
import { StatusBadge, STATUS_ACCENT } from "@/components/StatusBadge";
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
        className={`flex flex-wrap items-start justify-between gap-3 border-l-4 ${STATUS_ACCENT[job.status]} ${card}`}
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            {job.vehicle.plate}
          </h1>
          <p className="text-sm text-neutral-500">
            {[job.vehicle.brand, job.vehicle.model, job.vehicle.color, job.vehicle.year]
              .filter(Boolean)
              .join(" · ")}
          </p>
          <Link
            href={`/clientes/${job.vehicle.client.id}`}
            className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-orange-600 hover:text-orange-700 hover:underline"
          >
            <User className="h-3.5 w-3.5" />
            {job.vehicle.client.name}
          </Link>
        </div>
        <StatusBadge status={job.status} />
      </div>

      <section className={`space-y-3 ${card}`}>
        <h2 className={sectionLabel}>
          <ClipboardList className="h-4 w-4 text-orange-600" />
          Estado del trabajo
        </h2>
        <StatusForm jobId={job.id} currentStatus={job.status} />
        <p className="flex items-center gap-1.5 text-xs text-neutral-400">
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
