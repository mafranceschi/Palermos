"use client";

import { useActionState, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, KeyRound, Loader2, X } from "lucide-react";
import {
  changeRoleAction,
  deleteUserAction,
  resetPasswordAction,
  type UserActionState,
} from "./actions";
import { DeleteButton } from "@/components/DeleteButton";
import { buttonPrimary, getAvatarGradient, getInitials, input, inputBase } from "@/lib/ui";
import type { AppUser } from "@/lib/users";

const initialState: UserActionState = {};

export function UserRow({ user, isMe }: { user: AppUser; isMe: boolean }) {
  const [roleState, roleAction, rolePending] = useActionState(
    changeRoleAction.bind(null, user.id),
    initialState
  );
  const [pwOpen, setPwOpen] = useState(false);

  return (
    <li className="flex flex-wrap items-center gap-3 rounded-2xl border border-neutral-200/80 p-3 dark:border-white/5">
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-extrabold text-white ${getAvatarGradient(user.username)}`}
      >
        {getInitials(user.username)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-bold text-navy-900 dark:text-white">
          {user.username}
          {isMe && (
            <span className="ml-2 rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-bold text-orange-700 dark:bg-orange-500/15 dark:text-orange-300">
              vos
            </span>
          )}
        </p>
        <p className="text-xs text-neutral-400 dark:text-neutral-500">
          Creado el {new Date(user.created_at).toLocaleDateString("es-AR")}
        </p>
        {roleState.error && (
          <p className="text-xs text-red-600 dark:text-red-400">{roleState.error}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <form action={roleAction} className="flex items-center gap-2">
          {rolePending && <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />}
          {/* Se guarda al cambiar, como el estado de los trabajos. */}
          <select
            key={user.role}
            name="role"
            defaultValue={user.role}
            disabled={isMe || rolePending}
            title={isMe ? "No podés cambiar tu propio rol" : "Rol"}
            onChange={(e) => e.currentTarget.form?.requestSubmit()}
            className={`w-auto py-2 pl-3 pr-8 font-semibold disabled:opacity-60 ${inputBase}`}
          >
            <option value="viewer">Solo lectura</option>
            <option value="admin">Admin</option>
          </select>
        </form>

        <button
          type="button"
          onClick={() => setPwOpen(true)}
          title="Cambiar contraseña"
          aria-label="Cambiar contraseña"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-navy-700 transition-colors hover:border-orange-300 hover:text-orange-600 dark:border-white/10 dark:text-neutral-200 dark:hover:border-orange-500/40 dark:hover:text-orange-400"
        >
          <KeyRound className="h-4 w-4" />
        </button>

        {!isMe && (
          <DeleteButton
            compact
            action={deleteUserAction.bind(null, user.id)}
            label={`Borrar usuario ${user.username}`}
            confirmTitle={`¿Borrar el usuario ${user.username}?`}
            confirmText={<p>Ya no va a poder entrar a la app. Los trabajos y clientes no se tocan.</p>}
          />
        )}
      </div>

      <AnimatePresence>
        {pwOpen && <PasswordDialog user={user} onClose={() => setPwOpen(false)} />}
      </AnimatePresence>
    </li>
  );
}

function PasswordDialog({ user, onClose }: { user: AppUser; onClose: () => void }) {
  const [state, formAction, pending] = useActionState(
    resetPasswordAction.bind(null, user.id),
    initialState
  );

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-navy-950/60 p-4 backdrop-blur-sm sm:items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => !pending && onClose()}
    >
      <motion.form
        action={formAction}
        role="dialog"
        aria-modal="true"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 380, damping: 32 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md space-y-4 rounded-3xl bg-white p-6 shadow-2xl dark:bg-neutral-900 dark:ring-1 dark:ring-white/10"
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-bold text-navy-900 dark:text-white">
            Nueva contraseña para {user.username}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {state.savedAt ? (
          <p className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3.5 py-2.5 text-sm font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
            <Check className="h-4 w-4" strokeWidth={2.5} />
            Contraseña actualizada.
          </p>
        ) : (
          <input
            type="password"
            name="password"
            placeholder="Nueva contraseña (mín. 8)"
            autoComplete="new-password"
            required
            autoFocus
            className={input}
          />
        )}

        {state.error && (
          <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">
            {state.error}
          </p>
        )}

        <div className="flex justify-end">
          {state.savedAt ? (
            <button type="button" onClick={onClose} className={buttonPrimary}>
              Listo
            </button>
          ) : (
            <button type="submit" disabled={pending} className={buttonPrimary}>
              {pending ? "Guardando..." : "Guardar contraseña"}
            </button>
          )}
        </div>
      </motion.form>
    </motion.div>
  );
}
