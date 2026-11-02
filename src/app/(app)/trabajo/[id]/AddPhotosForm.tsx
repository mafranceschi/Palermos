"use client";

import { startTransition, useActionState, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { compressImage } from "@/lib/image-compression";
import { uploadPhotos } from "@/lib/photo-upload";
import { getErrorMessage } from "@/lib/errors";
import { addPhotosAction, type ActionState } from "./actions";
import { buttonSecondary } from "@/lib/ui";

const initialState: ActionState = {};

// Al elegir fotos se comprimen, se suben directo a Storage y se guardan en el
// trabajo, todo de una (sin un segundo botón).
export function AddPhotosForm({ jobId }: { jobId: string }) {
  const [state, formAction, pending] = useActionState(
    addPhotosAction.bind(null, jobId),
    initialState
  );
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const busy = uploading || pending;

  async function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;

    setUploading(true);
    setUploadError(null);
    try {
      const compressed = await Promise.all(files.map(compressImage));
      const paths = await uploadPhotos(compressed);
      const formData = new FormData();
      paths.forEach((path) => formData.append("photo_paths", path));
      startTransition(() => formAction(formData));
    } catch (err) {
      setUploadError(getErrorMessage(err));
    } finally {
      setUploading(false);
    }
  }

  const error = uploadError ?? state.error;

  return (
    <div className="flex flex-wrap items-center gap-2 pt-1">
      <label
        className={`${buttonSecondary} ${busy ? "pointer-events-none opacity-60" : "cursor-pointer"}`}
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
        {uploading ? "Subiendo..." : pending ? "Guardando..." : "Agregar fotos"}
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={busy}
          onChange={handleFilesChange}
          className="hidden"
        />
      </label>
      {error && <span className="text-sm text-red-600 dark:text-red-400">{error}</span>}
    </div>
  );
}
