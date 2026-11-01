"use client";

import { useEffect, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";

// Botón de borrado con ventana de confirmación. `action` es una server action
// ya atada al id (ej. deleteJobAction.bind(null, id)); si sale bien puede
// redirigir desde el servidor (o simplemente se cierra la ventana), si falla
// devuelve { error }. `compact` muestra solo el ícono (para listas).
export function DeleteButton({
  action,
  label,
  confirmTitle,
  confirmText,
  compact = false,
}: {
  action: () => Promise<{ error?: string }>;
  label: string;
  confirmTitle: string;
  confirmText: React.ReactNode;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !pending) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, pending]);

  function confirm() {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (result?.error) setError(result.error);
      else setOpen(false);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError(null);
          setOpen(true);
        }}
        title={label}
        aria-label={label}
        className={`inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-white text-sm font-semibold text-red-600 transition-colors hover:border-red-300 hover:bg-red-50 active:scale-[0.97] dark:border-red-500/30 dark:bg-transparent dark:text-red-400 dark:hover:bg-red-500/10 ${
          compact ? "h-9 w-9" : "px-5 py-2.5"
        }`}
      >
        <Trash2 className="h-4 w-4" />
        {!compact && label}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-navy-950/60 p-4 backdrop-blur-sm sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !pending && setOpen(false)}
          >
            <motion.div
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="delete-title"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md space-y-4 rounded-3xl bg-white p-6 shadow-2xl dark:bg-neutral-900 dark:ring-1 dark:ring-white/10"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400">
                  <AlertTriangle className="h-5 w-5" />
                </span>
                <div className="space-y-1">
                  <h2
                    id="delete-title"
                    className="text-lg font-bold text-navy-900 dark:text-white"
                  >
                    {confirmTitle}
                  </h2>
                  <div className="text-sm text-neutral-600 dark:text-neutral-300">
                    {confirmText}
                  </div>
                </div>
              </div>

              {error && (
                <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">
                  {error}
                </p>
              )}

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  disabled={pending}
                  autoFocus
                  className="inline-flex items-center justify-center rounded-full border border-neutral-200 px-5 py-2.5 text-sm font-semibold text-navy-800 transition-colors hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={confirm}
                  disabled={pending}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-red-600/25 transition-colors hover:bg-red-700 disabled:opacity-60"
                >
                  {pending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  {pending ? "Eliminando..." : "Sí, eliminar"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
