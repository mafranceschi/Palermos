import { JOB_STATUS_LABELS, type JobStatus } from "@/lib/types";

const STATUS_BADGE: Record<JobStatus, string> = {
  ingresado:
    "bg-navy-50 text-navy-700 ring-navy-200 dark:bg-navy-500/15 dark:text-navy-200 dark:ring-navy-400/30",
  en_reparacion:
    "bg-orange-50 text-orange-700 ring-orange-200 dark:bg-orange-500/15 dark:text-orange-300 dark:ring-orange-400/30",
  listo:
    "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-400/30",
  entregado:
    "bg-neutral-100 text-neutral-600 ring-neutral-200 dark:bg-white/5 dark:text-neutral-300 dark:ring-white/10",
};

const STATUS_DOT: Record<JobStatus, string> = {
  ingresado: "bg-navy-500 dark:bg-navy-300",
  en_reparacion: "bg-orange-500",
  listo: "bg-emerald-500",
  entregado: "bg-neutral-400",
};

// Franja de color por estado (borde superior de las tarjetas, barra lateral
// del historial, banner del detalle).
export const STATUS_TOP_ACCENT: Record<JobStatus, string> = {
  ingresado: "from-navy-400 to-navy-700",
  en_reparacion: "from-orange-400 to-orange-600",
  listo: "from-emerald-400 to-teal-600",
  entregado: "from-neutral-300 to-neutral-500",
};

export function StatusBadge({ status }: { status: JobStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${STATUS_BADGE[status]}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        {/* Solo los autos en reparación "laten": se nota qué está en curso. */}
        {status === "en_reparacion" && (
          <span
            className={`absolute inline-flex h-full w-full animate-soft-ping rounded-full ${STATUS_DOT[status]}`}
          />
        )}
        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${STATUS_DOT[status]}`} />
      </span>
      {JOB_STATUS_LABELS[status]}
    </span>
  );
}
