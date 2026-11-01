"use client";

import { useActionState } from "react";
import { Check, UserPlus } from "lucide-react";
import { createUserAction, type UserActionState } from "./actions";
import { buttonPrimary, input } from "@/lib/ui";

const initialState: UserActionState = {};

export function NewUserForm() {
  const [state, formAction, pending] = useActionState(createUserAction, initialState);

  return (
    <form action={formAction} className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <input
          type="text"
          name="username"
          placeholder="Usuario"
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          required
          className={input}
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña (mín. 8)"
          autoComplete="new-password"
          required
          className={input}
        />
        <select name="role" defaultValue="viewer" className={input}>
          <option value="viewer">Solo lectura</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className={buttonPrimary}>
          <UserPlus className="h-4 w-4" />
          {pending ? "Creando..." : "Crear usuario"}
        </button>
        {state.error ? (
          <span className="text-sm text-red-600 dark:text-red-400">{state.error}</span>
        ) : (
          state.savedAt && (
            <span
              key={state.savedAt}
              className="inline-flex animate-flash-out items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400"
            >
              <Check className="h-4 w-4" strokeWidth={2.5} />
              Usuario creado
            </span>
          )
        )}
      </div>
    </form>
  );
}
