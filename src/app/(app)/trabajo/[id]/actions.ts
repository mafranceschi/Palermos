"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { addPhoto, deleteJob, updateJob, uploadJobPhoto } from "@/lib/data";
import { isAdmin } from "@/lib/auth";
import { getErrorMessage } from "@/lib/errors";
import { JOB_STATUSES, type JobStatus } from "@/lib/types";

// savedAt: marca de tiempo del último guardado OK, para mostrar "Guardado".
export type ActionState = { error?: string; savedAt?: number };

function str(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function updateStatusAction(
  jobId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const status = str(formData, "status") as JobStatus;
  if (!JOB_STATUSES.includes(status)) {
    return { error: "Estado inválido." };
  }

  try {
    await updateJob(jobId, {
      status,
      exit_date: status === "entregado" ? new Date().toISOString() : null,
    });
  } catch (err) {
    return { error: `No se pudo actualizar el estado: ${getErrorMessage(err)}` };
  }

  revalidatePath(`/trabajo/${jobId}`);
  revalidatePath("/");
  return { savedAt: Date.now() };
}

export async function updateDetailsAction(
  jobId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    await updateJob(jobId, {
      client_request: str(formData, "client_request"),
      work_description: str(formData, "work_description"),
      notes: str(formData, "notes"),
    });
  } catch (err) {
    return { error: `No se pudo guardar: ${getErrorMessage(err)}` };
  }

  revalidatePath(`/trabajo/${jobId}`);
  return {};
}

export async function addPhotosAction(
  jobId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const photos = formData.getAll("photos").filter(
    (item): item is File => item instanceof File && item.size > 0
  );

  try {
    for (const photo of photos) {
      const path = await uploadJobPhoto(jobId, photo);
      await addPhoto(jobId, path);
    }
  } catch (err) {
    return { error: `No se pudieron subir las fotos: ${getErrorMessage(err)}` };
  }

  revalidatePath(`/trabajo/${jobId}`);
  return {};
}

export async function deleteJobAction(jobId: string): Promise<ActionState> {
  if (!(await isAdmin())) {
    return { error: "Solo un admin puede eliminar trabajos." };
  }

  try {
    await deleteJob(jobId);
  } catch (err) {
    return { error: `No se pudo eliminar el trabajo: ${getErrorMessage(err)}` };
  }

  revalidatePath("/");
  revalidatePath("/clientes", "layout");
  redirect("/");
}
