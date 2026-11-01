-- Usuarios de la app: login con usuario y contraseña guardados en la base.
-- No usa Supabase Auth: la sesión la maneja la app (cookie firmada) y todo el
-- acceso pasa por el servidor con la service role, como el resto de tablas.
create table public.app_users (
  id uuid primary key default gen_random_uuid(),
  -- Siempre en minúsculas, así "Juan" y "juan" son el mismo usuario.
  username text not null unique check (username = lower(username) and length(username) >= 3),
  -- Hash scrypt con sal propia (formato "scrypt$<sal>$<hash>"), nunca la contraseña.
  password_hash text not null,
  role text not null check (role in ('admin', 'viewer')),
  created_at timestamptz not null default now()
);

-- RLS activado y sin políticas: la clave pública (anon) no puede leer ni
-- escribir usuarios; solo el servidor con la service role.
alter table public.app_users enable row level security;
