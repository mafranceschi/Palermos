"use server";

import { getSessionUser } from "@/lib/auth";
import { createPhotoUploadUrl } from "@/lib/data";
import { getErrorMessage } from "@/lib/errors";

const MAX_PHOTOS_PER_REQUEST = 30;

export type PhotoUploadSlot = { path: string; signedUrl: string };

// Pide permisos firmados para subir `count` fotos directo a Storage.
export async function requestPhotoUploads(
  count: number
): Promise<{ slots?: PhotoUploadSlot[]; error?: string }> {
  if (!(await getSessionUser())) return { error: "La sesión expiró. Volvé a entrar." };
  if (!Number.isInteger(count) || count < 1 || count > MAX_PHOTOS_PER_REQUEST) {
    return { error: `Podés subir hasta ${MAX_PHOTOS_PER_REQUEST} fotos a la vez.` };
  }

  try {
    const slots = await Promise.all(Array.from({ length: count }, () => createPhotoUploadUrl()));
    return { slots };
  } catch (err) {
    return { error: `No se pudo preparar la subida: ${getErrorMessage(err)}` };
  }
}
