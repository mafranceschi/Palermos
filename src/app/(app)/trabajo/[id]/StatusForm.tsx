"use client";

import { useActionState } from "react";
import { updateStatusAction, type ActionState } from "./actions";
import { JOB_STATUSES, JOB_STATUS_LABELS, type JobStatus } from "@/lib/types";
import { buttonPrimary, inputBase } from "@/lib/ui";

const initialState: ActionState = {};

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
    <form action={formAction} className="flex flex-wrap items-center gap-2">
      <select name="status" defaultValue={currentStatus} className={`w-auto ${inputBase}`}>
        {JOB_STATUSES.map((s) => (
          <option key={s} value={s}>
            {JOB_STATUS_LABELS[s]}
          </option>
        ))}
      </select>
      <button type="submit" disabled={pending} className={buttonPrimary}>
        {pending ? "Actualizando..." : "Actualizar estado"}
      </button>
      {state.error && <span className="text-sm text-red-600 dark:text-red-400">{state.error}</span>}
    </form>
  );
}
