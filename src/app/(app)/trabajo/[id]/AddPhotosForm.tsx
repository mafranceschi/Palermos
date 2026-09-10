"use client";

import { useActionState, useRef, useState } from "react";
import { compressImage } from "@/lib/image-compression";
import { addPhotosAction, type ActionState } from "./actions";

const initialState: ActionState = {};

export function AddPhotosForm({ jobId }: { jobId: string }) {
  const [state, formAction, pending] = useActionState(
    addPhotosAction.bind(null, jobId),
    initialState
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [compressing, setCompressing] = useState(false);

  async function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setCompressing(true);
    try {
      const compressed = await Promise.all(files.map(compressImage));
      const dataTransfer = new DataTransfer();
      compressed.forEach((file) => dataTransfer.items.add(file));
      if (fileInputRef.current) {
        fileInputRef.current.files = dataTransfer.files;
      }
    } finally {
      setCompressing(false);
    }
  }

  return (
    <form action={formAction} className="flex flex-wrap items-center gap-2">
      <input
        ref={fileInputRef}
        type="file"
        name="photos"
        accept="image/*"
        multiple
        onChange={handleFilesChange}
        className="text-sm"
      />
      <button
        type="submit"
        disabled={pending || compressing}
        className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {compressing ? "Optimizando..." : pending ? "Subiendo..." : "Agregar fotos"}
      </button>
      {state.error && <span className="text-sm text-red-600">{state.error}</span>}
    </form>
  );
}
