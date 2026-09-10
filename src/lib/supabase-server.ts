import "server-only";
import { createClient } from "@supabase/supabase-js";

// Cliente con service role: solo se importa desde código de servidor
// (server actions, route handlers, server components). El login de la app
// es un password compartido a nivel de aplicación, no Supabase Auth, y las
// tablas tienen RLS activado sin políticas, así que todo el acceso a datos
// pasa por este cliente.
export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Faltan las variables de entorno SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

export const PHOTOS_BUCKET = "job-photos";
