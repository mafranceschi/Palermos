-- Costos de pintura por trabajo: lo que cobra el pintor (valor del paño ×
-- cantidad de paños) y lo que se le cobra al cliente. La ganancia se calcula
-- en la app. Va en una tabla aparte de jobs a propósito: la app solo la lee
-- para usuarios admin, así estos números nunca llegan a un viewer.
create table public.job_pricing (
  job_id uuid primary key references public.jobs(id) on delete cascade,
  panels integer check (panels is null or panels >= 0),
  panel_price numeric(14, 2) check (panel_price is null or panel_price >= 0),
  client_price numeric(14, 2) check (client_price is null or client_price >= 0),
  updated_at timestamptz not null default now()
);

-- Igual que el resto: RLS sin políticas, solo el servidor (service role).
alter table public.job_pricing enable row level security;
