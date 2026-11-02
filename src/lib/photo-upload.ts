import { requestPhotoUploads } from "@/app/(app)/photo-actions";

// Sube fotos (ya comprimidas) directo a Supabase Storage con permisos firmados
// que da el servidor. Devuelve la ruta de cada foto en el mismo orden.
export async function uploadPhotos(files: File[]): Promise<string[]> {
  if (files.length === 0) return [];

  const { slots, error } = await requestPhotoUploads(files.length);
  if (error || !slots) throw new Error(error ?? "No se pudo preparar la subida.");

  return Promise.all(
    files.map(async (file, i) => {
      const body = new FormData();
      body.append("cacheControl", "3600");
      body.append("", file);
      const res = await fetch(slots[i].signedUrl, { method: "PUT", body });
      if (!res.ok) {
        throw new Error(`No se pudo subir la foto ${file.name} (error ${res.status}).`);
      }
      return slots[i].path;
    })
  );
}
