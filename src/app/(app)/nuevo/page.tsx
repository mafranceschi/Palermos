import { ClipboardPlus } from "lucide-react";
import { pageHero } from "@/lib/ui";
import { NewJobForm } from "./NewJobForm";

export default function NuevoIngresoPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className={pageHero}>
        <div className="pointer-events-none absolute -right-6 -top-6 opacity-20">
          <ClipboardPlus className="h-32 w-32" strokeWidth={1} />
        </div>
        <div className="relative">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Nuevo ingreso
          </h1>
          <p className="mt-1 text-sm text-white/90 sm:text-base">
            Registrá el vehículo, el cliente y las fotos del estado inicial.
          </p>
        </div>
      </div>
      <NewJobForm />
    </div>
  );
}
