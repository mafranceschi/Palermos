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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-950 px-4">
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-orange-600/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-amber-500/20 blur-3xl" />

      <motion.form
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        action={formAction}
        className="relative w-full max-w-sm space-y-5 rounded-2xl border border-white/10 bg-white p-7 shadow-2xl"
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <BrandMark size="lg" />
          <div>
            <h1 className="text-lg font-bold tracking-tight text-neutral-900">
              Palermos
            </h1>
            <p className="text-xs font-medium uppercase tracking-wide text-orange-600">
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
