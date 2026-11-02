-- Las patentes se guardan sin espacios, guiones ni puntos y en mayúsculas
-- (ver src/lib/plates.ts). Normaliza las que ya estaban cargadas.
update public.vehicles
set plate = regexp_replace(upper(plate), '[^A-Z0-9]', '', 'g')
where plate <> regexp_replace(upper(plate), '[^A-Z0-9]', '', 'g');
