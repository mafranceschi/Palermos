"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

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
    <button
      type="button"
      onClick={goBack}
      className="group inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white py-1.5 pl-2.5 pr-3.5 text-sm font-semibold text-navy-800 shadow-sm transition-colors hover:border-orange-300 hover:text-orange-600 active:scale-[0.97] dark:border-white/10 dark:bg-white/5 dark:text-neutral-200 dark:hover:border-orange-500/40 dark:hover:text-orange-400"
    >
      <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
      Volver
    </button>
  );
}
