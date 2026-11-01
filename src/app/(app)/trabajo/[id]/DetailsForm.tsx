"use client";

import { useActionState } from "react";
import { updateDetailsAction, type ActionState } from "./actions";
import type { Job } from "@/lib/types";
import { buttonSecondary, input } from "@/lib/ui";

const initialState: ActionState = {};

export function DetailsForm({ job }: { job: Job }) {
  const [state, formAction, pending] = useActionState(
    updateDetailsAction.bind(null, job.id),
    initialState
  );

  return (
    <form action={formAction} className="space-y-3">
      <div>
        <label htmlFor="client_request" className="text-xs font-bold uppercase tracking-wide text-navy-700 dark:text-navy-200">
          Chapa
        </label>
        <textarea
          id="client_request"
          name="client_request"
          defaultValue={job.client_request ?? ""}
          rows={3}
          className={`mt-1 ${input}`}
        />
      </div>
      <div>
        <label htmlFor="work_description" className="text-xs font-bold uppercase tracking-wide text-orange-600 dark:text-orange-400">
          Pintura
        </label>
        <textarea
          id="work_description"
          name="work_description"
          defaultValue={job.work_description ?? ""}
          rows={3}
          className={`mt-1 ${input}`}
        />
      </div>
      <div>
        <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
          Notas internas
        </label>
        <textarea
          name="notes"
          defaultValue={job.notes ?? ""}
          rows={2}
          className={`mt-1 ${input}`}
        />
      </div>
      {state.error && <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>}
      <button type="submit" disabled={pending} className={buttonSecondary}>
        {pending ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}
