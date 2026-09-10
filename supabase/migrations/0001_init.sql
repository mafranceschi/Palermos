-- Esquema inicial: clientes, vehículos, trabajos (ingresos) y fotos.
create extension if not exists "pgcrypto";

create type job_status as enum ('ingresado', 'en_reparacion', 'listo', 'entregado');

create table clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  notes text,
  created_at timestamptz not null default now()
);

create table vehicles (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete restrict,
  plate text not null unique,
  brand text,
  model text,
  year integer,
  color text,
  created_at timestamptz not null default now()
);

create table jobs (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references vehicles(id) on delete restrict,
  client_request text,
  work_description text,
  status job_status not null default 'ingresado',
  entry_date timestamptz not null default now(),
  exit_date timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table photos (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id) on delete cascade,
  storage_path text not null,
  caption text,
  created_at timestamptz not null default now()
);

create index vehicles_client_id_idx on vehicles(client_id);
create index vehicles_plate_idx on vehicles(plate);
create index jobs_vehicle_id_idx on jobs(vehicle_id);
create index jobs_status_idx on jobs(status);
create index jobs_entry_date_idx on jobs(entry_date desc);
create index photos_job_id_idx on photos(job_id);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger jobs_set_updated_at
  before update on jobs
  for each row
  execute function set_updated_at();

-- Row Level Security: el proyecto usa un login compartido a nivel de aplicación
-- (no Supabase Auth), por lo que el acceso se hace con la service role key
-- desde el servidor. Se deja RLS activado y sin políticas para que las claves
-- públicas (anon) no puedan leer/escribir directamente.
alter table clients enable row level security;
alter table vehicles enable row level security;
alter table jobs enable row level security;
alter table photos enable row level security;
