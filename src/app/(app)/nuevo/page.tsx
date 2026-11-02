import { ClipboardPlus } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { pageHero } from "@/lib/ui";
import { HeroDecor } from "@/components/HeroDecor";
import { HeroHeading } from "@/components/HeroHeading";
import { NewJobForm } from "./NewJobForm";
import { isAdmin } from "@/lib/auth";
import { getPainterNames } from "@/lib/data";

export default async function NuevoIngresoPage() {
  const admin = await isAdmin();
  // Sugerencias de pintores: solo hacen falta (y solo se leen) para admin.
  const painterOptions = admin ? await getPainterNames() : [];
  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <BackButton fallbackHref={"/"} />
      </div>
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
      <NewJobForm isAdmin={admin} painterOptions={painterOptions} />
    </div>
  );
}
