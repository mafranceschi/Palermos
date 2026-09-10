"use client";

import { useActionState } from "react";
import { updateStatusAction, type ActionState } from "./actions";
import { JOB_STATUSES, JOB_STATUS_LABELS, type JobStatus } from "@/lib/types";

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
    <form action={formAction} className="flex items-center gap-2">
      <select
        name="status"
        defaultValue={currentStatus}
        className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
      >
        {JOB_STATUSES.map((s) => (
          <option key={s} value={s}>
            {JOB_STATUS_LABELS[s]}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-orange-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-700 disabled:opacity-50"
      >
        {pending ? "Actualizando..." : "Actualizar estado"}
      </button>
      {state.error && <span className="text-sm text-red-600">{state.error}</span>}
    </form>
  );
}
