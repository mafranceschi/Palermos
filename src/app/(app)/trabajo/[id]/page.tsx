import Link from "next/link";
import { notFound } from "next/navigation";
import { getJobById, getSignedPhotoUrls } from "@/lib/data";
import { StatusBadge } from "@/components/StatusBadge";
import { StatusForm } from "./StatusForm";
import { DetailsForm } from "./DetailsForm";
import { AddPhotosForm } from "./AddPhotosForm";

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
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">{job.vehicle.plate}</h1>
          <p className="text-sm text-neutral-500">
            {job.vehicle.brand} {job.vehicle.model} {job.vehicle.color}{" "}
            {job.vehicle.year ?? ""}
          </p>
          <Link
            href={`/clientes/${job.vehicle.client.id}`}
            className="text-sm text-blue-600 hover:underline"
          >
            {job.vehicle.client.name}
          </Link>
        </div>
        <StatusBadge status={job.status} />
      </div>

      <section className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 font-medium">Estado del trabajo</h2>
        <StatusForm jobId={job.id} currentStatus={job.status} />
        <p className="mt-2 text-xs text-neutral-400">
          Ingresó el {new Date(job.entry_date).toLocaleString("es-AR")}
          {job.exit_date &&
            ` — Entregado el ${new Date(job.exit_date).toLocaleString("es-AR")}`}
        </p>
      </section>

      <section className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 font-medium">Detalle</h2>
        <DetailsForm job={job} />
      </section>

      <section className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 font-medium">Fotos ({photos.length})</h2>
        {photos.length > 0 && (
          <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {photos.map((photo) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={photo.id}
                src={photo.url}
                alt={photo.caption ?? ""}
                className="aspect-square w-full rounded-md object-cover"
              />
            ))}
          </div>
        )}
        <AddPhotosForm jobId={job.id} />
      </section>
    </div>
  );
}
