import { JOB_STATUS_LABELS, type JobStatus } from "@/lib/types";

const STATUS_STYLES: Record<JobStatus, { badge: string; dot: string }> = {
  ingresado: {
    badge:
      "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-500/30",
    dot: "bg-blue-500",
  },
  en_reparacion: {
    badge:
      "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30",
    dot: "bg-amber-500",
  },
  listo: {
    badge:
      "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30",
    dot: "bg-emerald-500",
  },
  entregado: {
    badge:
      "bg-neutral-100 text-neutral-600 ring-1 ring-inset ring-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:ring-neutral-700",
    dot: "bg-neutral-400",
  },
};

export const STATUS_ACCENT: Record<JobStatus, string> = {
  ingresado: "border-l-blue-500",
  en_reparacion: "border-l-amber-500",
  listo: "border-l-emerald-500",
  entregado: "border-l-neutral-300 dark:border-l-neutral-600",
};

export function StatusBadge({ status }: { status: JobStatus }) {
  const style = STATUS_STYLES[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${style.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {JOB_STATUS_LABELS[status]}
    </span>
  );
}
