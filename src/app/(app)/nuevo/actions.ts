"use server";

import { redirect } from "next/navigation";
import {
  addPhoto,
  createClient,
  createJob,
  createVehicle,
  findVehicleByPlate,
  isValidPhotoUploadPath,
  saveJobPricing,
} from "@/lib/data";
import { isAdmin } from "@/lib/auth";
import { hasPricing, pricingFromForm } from "@/lib/pricing";
import { getErrorMessage } from "@/lib/errors";
import { normalizePlate } from "@/lib/plates";

export type CreateJobState = { error?: string };

function str(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function createJobAction(
  _prevState: CreateJobState,
  formData: FormData
): Promise<CreateJobState> {
  const plate = normalizePlate(str(formData, "plate"));
  if (!plate) {
    return { error: "La patente es obligatoria." };
  }

  const clientRequest = str(formData, "client_request");
  const workDescription = str(formData, "work_description");
  const parts = str(formData, "parts");

  let jobId: string;

  try {
    let vehicleId: string;

    const existingVehicle = await findVehicleByPlate(plate);

    if (existingVehicle) {
      vehicleId = existingVehicle.id;
    } else {
      const existingClientId = str(formData, "client_id");
      let clientId = existingClientId || undefined;

      if (!clientId) {
        const name = str(formData, "client_name");
        if (!name) {
          return {
            error:
              "Este vehículo es nuevo: completá el nombre del cliente (o seleccioná uno existente).",
          };
        }
        const client = await createClient({
          name,
          phone: str(formData, "client_phone"),
          email: str(formData, "client_email"),
        });
        clientId = client.id;
      }

      const yearRaw = str(formData, "year");
      const vehicle = await createVehicle({
        client_id: clientId,
        plate,
        brand: str(formData, "brand"),
        model: str(formData, "model"),
        color: str(formData, "color"),
        year: yearRaw ? Number(yearRaw) : undefined,
      });
      vehicleId = vehicle.id;
    }

    const job = await createJob({
      vehicle_id: vehicleId,
      client_request: clientRequest,
      work_description: workDescription,
      parts,
    });
    jobId = job.id;

    // Las fotos ya se subieron directo a Storage desde el navegador; acá solo
    // llegan sus rutas.
    const photoPaths = formData
      .getAll("photo_paths")
      .filter((p): p is string => typeof p === "string" && isValidPhotoUploadPath(p));

    for (const path of photoPaths) {
      await addPhoto(jobId, path);
    }

    // Costos de pintura: solo si quien carga es admin (un viewer ni ve los campos).
    const pricing = pricingFromForm(formData);
    if (hasPricing(pricing) && (await isAdmin())) {
      await saveJobPricing(jobId, pricing);
    }
  } catch (err) {
    return {
      error: `No se pudo guardar el ingreso: ${getErrorMessage(err)}`,
    };
  }

  redirect(`/trabajo/${jobId}`);
}
