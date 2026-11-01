import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { hashPassword } from "@/lib/password";

export type Role = "admin" | "viewer";

export const ROLES: Role[] = ["admin", "viewer"];

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Admin",
  viewer: "Solo lectura",
};

export type AppUser = {
  id: string;
  username: string;
  role: Role;
  created_at: string;
};

const PUBLIC_COLUMNS = "id, username, role, created_at";

export function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

export async function countUsers(): Promise<number> {
  const supabase = getSupabaseAdmin();
  const { count, error } = await supabase
    .from("app_users")
    .select("id", { count: "exact", head: true });
  if (error) throw error;
  return count ?? 0;
}

export async function getUserById(id: string): Promise<AppUser | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("app_users")
    .select(PUBLIC_COLUMNS)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as AppUser | null;
}

// Incluye el hash: solo para el login.
export async function getUserForLogin(
  username: string
): Promise<(AppUser & { password_hash: string }) | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("app_users")
    .select(`${PUBLIC_COLUMNS}, password_hash`)
    .eq("username", normalizeUsername(username))
    .maybeSingle();
  if (error) throw error;
  return data as (AppUser & { password_hash: string }) | null;
}

export async function listUsers(): Promise<AppUser[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("app_users")
    .select(PUBLIC_COLUMNS)
    .order("created_at");
  if (error) throw error;
  return data as AppUser[];
}

export async function createUser(
  username: string,
  password: string,
  role: Role
): Promise<AppUser> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("app_users")
    .insert({
      username: normalizeUsername(username),
      password_hash: await hashPassword(password),
      role,
    })
    .select(PUBLIC_COLUMNS)
    .single();
  if (error) throw error;
  return data as AppUser;
}

export async function updateUserPassword(id: string, password: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("app_users")
    .update({ password_hash: await hashPassword(password) })
    .eq("id", id);
  if (error) throw error;
}

export async function updateUserRole(id: string, role: Role): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("app_users").update({ role }).eq("id", id);
  if (error) throw error;
}

export async function deleteUser(id: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("app_users").delete().eq("id", id);
  if (error) throw error;
}

export async function countAdmins(): Promise<number> {
  const supabase = getSupabaseAdmin();
  const { count, error } = await supabase
    .from("app_users")
    .select("id", { count: "exact", head: true })
    .eq("role", "admin");
  if (error) throw error;
  return count ?? 0;
}
