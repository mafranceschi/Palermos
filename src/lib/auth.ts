import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session";
import { getUserById, type AppUser } from "@/lib/users";

// Usuario de quien hace el request, leído de la base (rol actualizado). El
// proxy solo valida la firma de la cookie; esto además confirma que el usuario
// sigue existiendo. `cache` evita repetir la consulta dentro del mismo render.
export const getSessionUser = cache(async (): Promise<AppUser | null> => {
  const cookieStore = await cookies();
  const userId = await verifySessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  if (!userId) return null;
  return getUserById(userId);
});

export async function isAdmin(): Promise<boolean> {
  return (await getSessionUser())?.role === "admin";
}
