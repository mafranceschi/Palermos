// Compresión de fotos en el navegador antes de subirlas: evita guardar fotos
// de varios MB (como las que sacan los celulares) y en su lugar sube un WebP
// liviano, más que suficiente para documentar el estado de un vehículo.
const MAX_DIMENSION = 1600;
const WEBP_QUALITY = 0.8;

export async function compressImage(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });

  const scale = Math.min(
    1,
    MAX_DIMENSION / Math.max(bitmap.width, bitmap.height)
  );
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("No se pudo procesar la imagen en este navegador.");
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", WEBP_QUALITY)
  );

  if (!blob) {
    throw new Error("No se pudo comprimir la imagen.");
  }

  const newName = file.name.replace(/\.[^.]+$/, "") + ".webp";
  return new File([blob], newName, { type: "image/webp" });
}
