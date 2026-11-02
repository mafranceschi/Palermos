-- Pintor que hizo (y le cobró al taller) cada trabajo. Va junto a los costos
-- en job_pricing, así también queda solo para admin.
alter table public.job_pricing add column painter text;
