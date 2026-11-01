-- Borrado de trabajos y clientes en una sola transacción.
-- Las FK de vehicles/jobs son "on delete restrict" a propósito (evitan borrar
-- en cascada por error), así que el borrado va por estas funciones, que lo
-- hacen en orden y devuelven las rutas de las fotos para que la app las borre
-- del bucket de Storage (Postgres no puede borrar archivos de Storage).

-- Borra un trabajo y sus fotos (las filas de photos caen por cascade).
-- El vehículo y el cliente se mantienen.
create or replace function public.delete_job(p_job_id uuid)
returns setof text
language plpgsql
set search_path = ''
as $$
begin
  return query
    select p.storage_path from public.photos p where p.job_id = p_job_id;

  delete from public.jobs where id = p_job_id;
end;
$$;

-- Borra un cliente con todos sus vehículos, trabajos y fotos.
create or replace function public.delete_client(p_client_id uuid)
returns setof text
language plpgsql
set search_path = ''
as $$
begin
  return query
    select p.storage_path
    from public.photos p
    join public.jobs j on j.id = p.job_id
    join public.vehicles v on v.id = j.vehicle_id
    where v.client_id = p_client_id;

  delete from public.jobs j
    using public.vehicles v
    where j.vehicle_id = v.id and v.client_id = p_client_id;
  delete from public.vehicles where client_id = p_client_id;
  delete from public.clients where id = p_client_id;
end;
$$;

-- Por defecto Postgres deja ejecutar funciones a cualquiera (incluida la
-- clave pública anon). Solo el servidor de la app (service role) puede borrar.
revoke execute on function public.delete_job(uuid) from public, anon, authenticated;
revoke execute on function public.delete_client(uuid) from public, anon, authenticated;
grant execute on function public.delete_job(uuid) to service_role;
grant execute on function public.delete_client(uuid) to service_role;
