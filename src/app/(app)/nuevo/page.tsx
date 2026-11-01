import { ClipboardPlus } from "lucide-react";
import { pageHero } from "@/lib/ui";
import { HeroDecor } from "@/components/HeroDecor";
import { HeroHeading } from "@/components/HeroHeading";
import { NewJobForm } from "./NewJobForm";

export default function NuevoIngresoPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className={pageHero}>
        <HeroDecor icon={ClipboardPlus} />
        <div className="relative">
          <HeroHeading
            eyebrow="Taller Palermo"
            title="Nuevo ingreso"
            subtitle="Registrá el vehículo, el cliente y las fotos del estado inicial."
          />
        </div>
      </div>
      <NewJobForm />
    </div>
  );
}
