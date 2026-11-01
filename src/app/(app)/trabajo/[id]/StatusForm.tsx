"use client";

import { useActionState } from "react";
import { Check, Loader2 } from "lucide-react";
import { updateStatusAction, type ActionState } from "./actions";
import { JOB_STATUSES, JOB_STATUS_LABELS, type JobStatus } from "@/lib/types";
import { inputBase } from "@/lib/ui";

const initialState: ActionState = {};

// El estado se guarda apenas se elige en el selector, sin botón.
export function StatusForm({
  jobId,
  currentStatus,
}: {
  jobId: string;
  currentStatus: JobStatus;
}) {
  const [state, formAction, pending] = useActionState(
    updateStatusAction.bind(null, jobId),
    initialState
  );

  return (
    <form action={formAction} className="flex flex-wrap items-center gap-3">
      {/* key: React resetea el form al terminar la acción; al cambiar el
          estado guardado se vuelve a montar el select con el valor nuevo. */}
      <select
        key={currentStatus}
        name="status"
        defaultValue={currentStatus}
        disabled={pending}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className={`w-auto py-2.5 pl-4 pr-9 font-semibold disabled:opacity-60 ${inputBase}`}
      >
        {JOB_STATUSES.map((s) => (
          <option key={s} value={s}>
            {JOB_STATUS_LABELS[s]}
          </option>
        ))}
      </select>
      {pending ? (
        <span className="inline-flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          Guardando...
        </span>
      ) : state.error ? (
        <span className="text-sm text-red-600 dark:text-red-400">{state.error}</span>
      ) : (
        state.savedAt && (
          // key: cada guardado vuelve a montar el aviso y repite la animación.
          <span
            key={state.savedAt}
            className="inline-flex animate-flash-out items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400"
          >
            <Check className="h-4 w-4" strokeWidth={2.5} />
            Guardado
          </span>
        )
      )}
    </form>
  );
}
