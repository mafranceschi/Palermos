"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/session";
import { countUsers, createUser, getUserForLogin, normalizeUsername } from "@/lib/users";
import { MIN_PASSWORD_LENGTH, verifyPassword } from "@/lib/password";
import { getErrorMessage } from "@/lib/errors";

export type LoginState = { error?: string };

// Hash válido de una contraseña cualquiera: si el usuario no existe se
// verifica igual contra esto, para que la respuesta tarde lo mismo y no se
// pueda adivinar qué usuarios existen midiendo el tiempo.
const DUMMY_HASH =
  "scrypt$00000000000000000000000000000000$" + "0".repeat(128);

function field(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

async function startSession(userId: string) {
  const token = await createSessionToken(userId);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const username = field(formData, "username");
  const password = field(formData, "password");
  if (!username || !password) {
    return { error: "Completá usuario y contraseña." };
  }

  let userId: string;
  try {
    const user = await getUserForLogin(username);
    const ok = await verifyPassword(password, user?.password_hash ?? DUMMY_HASH);
    if (!user || !ok) {
      return { error: "Usuario o contraseña incorrectos." };
    }
    userId = user.id;
  } catch (err) {
    return { error: `No se pudo iniciar sesión: ${getErrorMessage(err)}` };
  }

  await startSession(userId);
  redirect("/");
}

// Alta del primer admin. Solo funciona mientras no exista ningún usuario;
// después, los usuarios se crean desde la pantalla Usuarios.
export async function setupFirstAdmin(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const username = normalizeUsername(field(formData, "username"));
  const password = field(formData, "password");
  const confirm = field(formData, "confirm");

  if (username.length < 3) return { error: "El usuario debe tener al menos 3 caracteres." };
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { error: `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.` };
  }
  if (password !== confirm) return { error: "Las contraseñas no coinciden." };

  let userId: string;
  try {
    if ((await countUsers()) > 0) {
      return { error: "Ya hay usuarios creados. Iniciá sesión." };
    }
    userId = (await createUser(username, password, "admin")).id;
  } catch (err) {
    return { error: `No se pudo crear el usuario: ${getErrorMessage(err)}` };
  }

  await startSession(userId);
  redirect("/");
}
