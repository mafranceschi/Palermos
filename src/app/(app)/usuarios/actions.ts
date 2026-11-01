"use server";

import { revalidatePath } from "next/cache";
import { getSessionUser } from "@/lib/auth";
import {
  countAdmins,
  createUser,
  deleteUser,
  getUserById,
  normalizeUsername,
  ROLES,
  updateUserPassword,
  updateUserRole,
  type Role,
} from "@/lib/users";
import { MIN_PASSWORD_LENGTH } from "@/lib/password";
import { getErrorMessage } from "@/lib/errors";

export type UserActionState = { error?: string; savedAt?: number };

function field(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function passwordError(password: string): string | null {
  return password.length < MIN_PASSWORD_LENGTH
    ? `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`
    : null;
}

// Todas las acciones de esta pantalla son solo para admin: se valida en el
// servidor además de ocultar la pantalla.
async function requireAdmin() {
  const me = await getSessionUser();
  return me?.role === "admin" ? me : null;
}

// Nunca dejar el sistema sin ningún admin.
async function isLastAdmin(userId: string): Promise<boolean> {
  const user = await getUserById(userId);
  return user?.role === "admin" && (await countAdmins()) <= 1;
}

export async function createUserAction(
  _prev: UserActionState,
  formData: FormData
): Promise<UserActionState> {
  if (!(await requireAdmin())) return { error: "Solo un admin puede crear usuarios." };

  const username = normalizeUsername(field(formData, "username"));
  const password = field(formData, "password");
  const role = field(formData, "role") as Role;

  if (username.length < 3) return { error: "El usuario debe tener al menos 3 caracteres." };
  if (!/^[a-z0-9._-]+$/.test(username)) {
    return { error: "El usuario solo puede tener letras, números, punto, guion o guion bajo." };
  }
  const pwError = passwordError(password);
  if (pwError) return { error: pwError };
  if (!ROLES.includes(role)) return { error: "Rol inválido." };

  try {
    await createUser(username, password, role);
  } catch (err) {
    const message = getErrorMessage(err);
    if (message.includes("duplicate") || message.includes("unique")) {
      return { error: `Ya existe un usuario "${username}".` };
    }
    return { error: `No se pudo crear el usuario: ${message}` };
  }

  revalidatePath("/usuarios");
  return { savedAt: Date.now() };
}

export async function changeRoleAction(
  userId: string,
  _prev: UserActionState,
  formData: FormData
): Promise<UserActionState> {
  const me = await requireAdmin();
  if (!me) return { error: "Solo un admin puede cambiar roles." };

  const role = field(formData, "role") as Role;
  if (!ROLES.includes(role)) return { error: "Rol inválido." };
  if (userId === me.id) return { error: "No podés cambiar tu propio rol." };

  try {
    if (role !== "admin" && (await isLastAdmin(userId))) {
      return { error: "Tiene que quedar al menos un admin." };
    }
    await updateUserRole(userId, role);
  } catch (err) {
    return { error: `No se pudo cambiar el rol: ${getErrorMessage(err)}` };
  }

  revalidatePath("/usuarios");
  return { savedAt: Date.now() };
}

export async function resetPasswordAction(
  userId: string,
  _prev: UserActionState,
  formData: FormData
): Promise<UserActionState> {
  if (!(await requireAdmin())) return { error: "Solo un admin puede cambiar contraseñas." };

  const password = field(formData, "password");
  const pwError = passwordError(password);
  if (pwError) return { error: pwError };

  try {
    await updateUserPassword(userId, password);
  } catch (err) {
    return { error: `No se pudo cambiar la contraseña: ${getErrorMessage(err)}` };
  }

  return { savedAt: Date.now() };
}

export async function deleteUserAction(userId: string): Promise<{ error?: string }> {
  const me = await requireAdmin();
  if (!me) return { error: "Solo un admin puede borrar usuarios." };
  if (userId === me.id) return { error: "No podés borrar tu propio usuario." };

  try {
    if (await isLastAdmin(userId)) return { error: "Tiene que quedar al menos un admin." };
    await deleteUser(userId);
  } catch (err) {
    return { error: `No se pudo borrar el usuario: ${getErrorMessage(err)}` };
  }

  revalidatePath("/usuarios");
  return {};
}
