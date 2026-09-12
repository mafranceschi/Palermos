import { JOB_STATUS_LABELS, type JobStatus } from "@/lib/types";

const STATUS_GRADIENTS: Record<JobStatus, string> = {
  ingresado: "from-blue-500 to-indigo-500",
  en_reparacion: "from-amber-500 to-orange-500",
  listo: "from-emerald-500 to-teal-500",
  entregado: "from-neutral-400 to-neutral-500",
};

export const STATUS_TOP_ACCENT: Record<JobStatus, string> = STATUS_GRADIENTS;

export function StatusBadge({ status }: { status: JobStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r px-3 py-1 text-xs font-bold text-white shadow-sm ${STATUS_GRADIENTS[status]}`}
    >
      {JOB_STATUS_LABELS[status]}
    </span>
  );
}
