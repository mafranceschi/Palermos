-- Fija el search_path de set_updated_at para que no dependa del rol que la
-- ejecuta (aviso "Function Search Path Mutable" del linter de Supabase).
-- now() vive en pg_catalog, que siempre está disponible.
alter function public.set_updated_at() set search_path = '';
