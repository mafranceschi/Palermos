import { JOB_STATUS_LABELS, type JobStatus } from "@/lib/types";

const STATUS_STYLES: Record<JobStatus, string> = {
  ingresado: "bg-blue-100 text-blue-800",
  en_reparacion: "bg-amber-100 text-amber-800",
  listo: "bg-green-100 text-green-800",
  entregado: "bg-neutral-200 text-neutral-700",
};

export function StatusBadge({ status }: { status: JobStatus }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {JOB_STATUS_LABELS[status]}
    </span>
  );
}
