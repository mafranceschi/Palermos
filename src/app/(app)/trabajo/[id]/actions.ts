"use server";

import { revalidatePath } from "next/cache";
import { addPhoto, updateJob, uploadJobPhoto } from "@/lib/data";
import { getErrorMessage } from "@/lib/errors";
import { JOB_STATUSES, type JobStatus } from "@/lib/types";

export type ActionState = { error?: string };

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
  return {};
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
