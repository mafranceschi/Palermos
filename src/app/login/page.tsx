"use client";

import { useActionState } from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock } from "lucide-react";
import { login, type LoginState } from "./actions";
import { BrandMark } from "@/components/BrandMark";
import { buttonPrimary, input } from "@/lib/ui";

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 px-4">
      <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 animate-drift rounded-full bg-orange-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 animate-drift-slow rounded-full bg-navy-400/25 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.06)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

      <motion.form
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        action={formAction}
        className="relative w-full max-w-sm space-y-5 overflow-hidden rounded-3xl bg-white p-7 pt-8 shadow-2xl shadow-navy-950/50 ring-1 ring-white/10"
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-navy-700 via-orange-500 to-navy-700" />
        <div className="flex flex-col items-center gap-3 text-center">
          <motion.div
            initial={{ rotate: -12, scale: 0.8, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
          >
            <BrandMark size="lg" />
          </motion.div>
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
          Ingresá la contraseña del taller para continuar.
        </p>

        <div className="relative">
          <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Contraseña"
            required
            autoFocus
            className={`${input} pl-10 pr-10`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>

        {state.error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.error}
          </p>
        )}

        <button type="submit" disabled={pending} className={`${buttonPrimary} w-full`}>
          {pending ? "Ingresando..." : "Ingresar"}
        </button>
      </motion.form>
    </div>
  );
}
