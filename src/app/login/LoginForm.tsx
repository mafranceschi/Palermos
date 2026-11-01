"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { login, setupFirstAdmin, type LoginState } from "./actions";
import { BrandMark } from "@/components/BrandMark";
import { buttonPrimary } from "@/lib/ui";

const initialState: LoginState = {};

// La tarjeta del login es siempre blanca, así que los campos usan estilos
// claros fijos (sin variantes dark:).
const field =
  "w-full rounded-2xl border border-neutral-200 bg-neutral-50 py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 transition-[box-shadow,border-color,background-color] focus:bg-white";

export function LoginForm({ mode }: { mode: "login" | "setup" }) {
  const setup = mode === "setup";
  const [state, formAction, pending] = useActionState(
    setup ? setupFirstAdmin : login,
    initialState
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 px-4">
      <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 animate-drift rounded-full bg-orange-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 animate-drift-slow rounded-full bg-navy-400/25 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.06)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

      {/* Animaciones en CSS: el formulario se ve aunque el JS tarde en cargar. */}
      <form
        action={formAction}
        className="relative w-full animate-fade-up max-w-sm space-y-5 overflow-hidden rounded-3xl bg-white p-7 pt-8 shadow-2xl shadow-navy-950/50 ring-1 ring-white/10"
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-navy-700 via-orange-500 to-navy-700" />
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="animate-pop-in [animation-delay:100ms]">
            <BrandMark size="lg" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-orange-500">
              Taller
            </p>
            <h1 className="text-2xl font-extrabold uppercase tracking-tight text-navy-800">
              Palermo
            </h1>
            <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-neutral-400">
              Chapa y Pintura
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-neutral-500">
          {setup
            ? "Primera vez: creá el usuario administrador del taller."
            : "Ingresá con tu usuario y contraseña."}
        </p>

        <div className="space-y-3">
          <div className="relative">
            <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              name="username"
              placeholder="Usuario"
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              required
              autoFocus
              className={field}
            />
          </div>

          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Contraseña"
              autoComplete={setup ? "new-password" : "current-password"}
              required
              className={`${field} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              tabIndex={-1}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {setup && (
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="confirm"
                placeholder="Repetir contraseña"
                autoComplete="new-password"
                required
                className={field}
              />
            </div>
          )}
        </div>

        {state.error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
        )}

        <button type="submit" disabled={pending} className={`${buttonPrimary} w-full`}>
          {setup
            ? pending
              ? "Creando..."
              : "Crear administrador"
            : pending
              ? "Ingresando..."
              : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
