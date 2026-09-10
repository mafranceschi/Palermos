# Taller — Chapa y Pintura

Web app (PWA) para registrar el ingreso de vehículos al taller: fotos, descripción
del trabajo, cliente asociado, estado de la reparación (Ingresado → En
reparación → Listo → Entregado) y búsqueda/filtro de ingresos.

## Stack

- **Next.js** (App Router) + TypeScript + Tailwind CSS
- **Supabase**: base de datos Postgres + Storage para las fotos
- Login simple compartido (una sola contraseña de taller), sin gestión de
  usuarios individuales
- Las fotos se comprimen y convierten a WebP en el navegador antes de subirse,
  para no consumir espacio de storage innecesariamente

## 1. Crear el proyecto de Supabase

1. Entrá a [supabase.com](https://supabase.com) y creá un proyecto nuevo (el
   plan gratuito alcanza de sobra para este uso).
2. Andá a **SQL Editor** y ejecutá, en orden, el contenido de:
   - `supabase/migrations/0001_init.sql`
   - `supabase/migrations/0002_storage.sql`
   Esto crea las tablas (`clients`, `vehicles`, `jobs`, `photos`) y el bucket
   privado de Storage `job-photos` donde se guardan las fotos.
3. Andá a **Project Settings → API** y copiá:
   - **Project URL** → variable `SUPABASE_URL`
   - **service_role key** (no la `anon` key) → variable
     `SUPABASE_SERVICE_ROLE_KEY`

   > La `service_role key` tiene acceso total a la base de datos: nunca se
   > expone al navegador, solo se usa en el servidor (por eso las tablas
   > tienen Row Level Security activado sin políticas: solo el backend, con
   > esta clave, puede leer/escribir).

## 2. Configurar variables de entorno

Copiá `.env.example` a `.env.local` y completá:

```bash
cp .env.example .env.local
```

```
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
APP_PASSWORD=la-contraseña-que-va-a-usar-el-taller
SESSION_SECRET=un-string-random-largo (podés generarlo con: openssl rand -hex 32)
```

## 3. Correr en local

```bash
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) — te va a pedir la
contraseña definida en `APP_PASSWORD`.

## 4. Deploy en Vercel

1. Importá el repositorio en [vercel.com](https://vercel.com/new).
2. Cargá las mismas variables de entorno (`SUPABASE_URL`,
   `SUPABASE_SERVICE_ROLE_KEY`, `APP_PASSWORD`, `SESSION_SECRET`) en
   **Project Settings → Environment Variables**.
3. Deploy. Cada push a la rama principal despliega automáticamente.
4. Desde el celular, abrí la URL en el navegador y usá "Agregar a pantalla de
   inicio" para instalarla como app (PWA).

## Estructura del proyecto

```
src/app/(app)/          páginas protegidas por login (listado, nuevo ingreso, detalle, cliente)
src/app/login/          página y server action de login
src/app/api/            endpoints usados por los formularios (búsqueda de clientes, lookup de patente)
src/lib/data.ts         acceso a datos (Supabase): clientes, vehículos, trabajos, fotos
src/lib/image-compression.ts  compresión de fotos en el navegador (resize + WebP)
src/lib/session.ts      firma/verificación de la cookie de sesión
supabase/migrations/    esquema SQL de la base de datos
```

## Próximos pasos posibles

- Reemplazar el login compartido por usuarios individuales (Supabase Auth) si
  el taller quiere saber quién cargó cada ingreso.
- Generar los tipos de la base de datos con `supabase gen types typescript`
  para tipar el cliente de Supabase en vez de castear manualmente.
- Agregar presupuesto/costo por trabajo si se necesita un registro económico.
- Notificar al cliente (WhatsApp/email) cuando el estado cambia a "Listo".
