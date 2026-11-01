const COOKIE_NAME = "palermos_session";
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 días

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("Falta la variable de entorno SESSION_SECRET");
  }
  return secret;
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sign(value: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(value)
  );
  return bufferToHex(signature);
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
export const SESSION_MAX_AGE_SECONDS = SESSION_DURATION_MS / 1000;

// Formato del token: "<id de usuario>:<vencimiento>.<firma>". La firma cubre
// ambos, así que no se puede cambiar de usuario editando la cookie. El rol no
// va en el token: se lee de la base en cada request (ver lib/auth.ts), así un
// cambio de rol o un usuario borrado se aplica al instante.
export async function createSessionToken(userId: string): Promise<string> {
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  const payload = `${userId}:${expiresAt}`;
  const signature = await sign(payload);
  return `${payload}.${signature}`;
}

// Devuelve el id de usuario de una sesión válida, o null.
export async function verifySessionToken(
  token: string | undefined
): Promise<string | null> {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = await sign(payload);
  if (expected !== signature) return null;

  const [userId, expiresRaw] = payload.split(":");
  if (!userId || !expiresRaw) return null;

  const expiresAt = Number(expiresRaw);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return null;

  return userId;
}
