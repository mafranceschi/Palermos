-- Bucket privado para las fotos de los trabajos. Se sube y se lee siempre
-- desde el servidor (service role), generando URLs firmadas de corta duración
-- para mostrarlas en el navegador.
insert into storage.buckets (id, name, public)
values ('job-photos', 'job-photos', false)
on conflict (id) do nothing;
