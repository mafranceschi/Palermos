"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { buttonGhost } from "@/lib/ui";

// Vuelve a la pantalla anterior dentro de la app (ej. del trabajo a la ficha
// del cliente). Si se abrió el link directo y no hay a dónde volver, va a
// `fallbackHref`. Pensado sobre todo para la app instalada en el celular, que
// no tiene botón "atrás" del navegador.
export function BackButton({ fallbackHref }: { fallbackHref: string }) {
  const router = useRouter();

  function goBack() {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  }

  return (
    <button type="button" onClick={goBack} className={`group -ml-2 ${buttonGhost}`}>
      <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
      Volver
    </button>
  );
}
