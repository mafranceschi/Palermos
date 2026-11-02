import Link from "next/link";
import { BackButton } from "@/components/BackButton";
import { notFound } from "next/navigation";
import { Calendar, CarFront, ClipboardList, FileText, Images, User, Wallet } from "lucide-react";
import { getJobById, getJobPricing, getPainterNames, getSignedPhotoUrls } from "@/lib/data";
import { StatusBadge, STATUS_TOP_ACCENT } from "@/components/StatusBadge";
import { card, pageHero, sectionIcon, sectionLabel } from "@/lib/ui";
import { HeroDecor } from "@/components/HeroDecor";
import { StatusForm } from "./StatusForm";
import { DetailsForm } from "./DetailsForm";
import { AddPhotosForm } from "./AddPhotosForm";
import { PhotoGallery } from "./PhotoGallery";
import { PricingForm } from "./PricingForm";
import { deleteJobAction } from "./actions";
import { isAdmin } from "@/lib/auth";
import { DeleteButton } from "@/components/DeleteButton";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getJobById(id);
  if (!job) notFound();

  const [photos, admin] = await Promise.all([getSignedPhotoUrls(job.photos), isAdmin()]);
  // Los costos solo se leen de la base para admin: a un viewer ni le llegan.
  const [pricing, painterOptions] = admin
    ? await Promise.all([getJobPricing(job.id), getPainterNames()])
    : [null, []];

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <BackButton fallbackHref={"/"} />
      </div>
      <div className={pageHero}>
        <HeroDecor icon={CarFront} />
        <div
          className={`absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b ${STATUS_TOP_ACCENT[job.status]}`}
        />
        <div className="relative flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-orange-400">
              Trabajo
            </p>
            <h1 className="mt-1 inline-block rounded-xl bg-white px-3 py-1 font-mono text-2xl font-bold tracking-wider text-navy-900 shadow-lg ring-2 ring-navy-950/20 sm:text-3xl">
              {job.vehicle.plate}
            </h1>
            <p className="mt-2 text-sm text-navy-100/90">
              {[job.vehicle.brand, job.vehicle.model, job.vehicle.color, job.vehicle.year]
                .filter(Boolean)
                .join(" · ")}
            </p>
            <Link
              href={`/clientes/${job.vehicle.client.id}`}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-sm font-semibold ring-1 ring-inset ring-white/15 backdrop-blur-sm transition-colors hover:bg-orange-500 hover:ring-orange-400"
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
          <span className={sectionIcon}>
            <ClipboardList />
          </span>
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
        <h2 className={sectionLabel}>
          <span className={sectionIcon}>
            <FileText />
          </span>
          Detalle
        </h2>
        <DetailsForm job={job} />
      </section>

      {pricing && (
        <section className={`space-y-3 ${card}`}>
          <h2 className={sectionLabel}>
            <span className={sectionIcon}>
              <Wallet />
            </span>
            Costos de pintura
          </h2>
          <PricingForm jobId={job.id} pricing={pricing} painterOptions={painterOptions} />
        </section>
      )}

      <section className={`space-y-3 ${card}`}>
        <h2 className={sectionLabel}>
          <span className={sectionIcon}>
            <Images />
          </span>
          Fotos ({photos.length})
        </h2>
        <PhotoGallery photos={photos} />
        <AddPhotosForm jobId={job.id} />
      </section>

      {admin && (
        <div className="flex justify-end pt-2">
          <DeleteButton
            action={deleteJobAction.bind(null, job.id)}
            label="Eliminar trabajo"
            confirmTitle={`¿Eliminar el trabajo de ${job.vehicle.plate}?`}
            confirmText={
              <p>
                Se borra el trabajo
                {photos.length === 0
                  ? ""
                  : photos.length === 1
                    ? " y su foto"
                    : ` y sus ${photos.length} fotos`}{" "}
                de forma permanente. El vehículo y el cliente se mantienen.
              </p>
            }
          />
        </div>
      )}
    </div>
  );
}
