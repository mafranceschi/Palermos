"use client";

import { useActionState } from "react";
import { Check } from "lucide-react";
import { savePricingAction, type ActionState } from "./actions";
import { PricingFields } from "@/components/PricingFields";
import type { JobPricing } from "@/lib/pricing";
import { buttonPrimary } from "@/lib/ui";

const initialState: ActionState = {};

export function PricingForm({ jobId, pricing }: { jobId: string; pricing: JobPricing }) {
  const [state, formAction, pending] = useActionState(
    savePricingAction.bind(null, jobId),
    initialState
  );

  return (
    <form action={formAction} className="space-y-3">
      {/* key: React resetea el form al terminar de guardar; se vuelve a montar
          con los valores guardados. */}
      <PricingFields key={state.savedAt ?? 0} initial={pricing} />
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className={buttonPrimary}>
          {pending ? "Guardando..." : "Guardar costos"}
        </button>
        {state.error ? (
          <span className="text-sm text-red-600 dark:text-red-400">{state.error}</span>
        ) : (
          state.savedAt && (
            <span
              key={state.savedAt}
              className="inline-flex animate-flash-out items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400"
            >
              <Check className="h-4 w-4" strokeWidth={2.5} />
              Guardado
            </span>
          )
        )}
      </div>
    </form>
  );
}
