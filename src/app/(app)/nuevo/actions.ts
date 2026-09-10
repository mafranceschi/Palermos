"use server";

import { redirect } from "next/navigation";
import {
  addPhoto,
  createClient,
  createJob,
  createVehicle,
  findVehicleByPlate,
  uploadJobPhoto,
} from "@/lib/data";

export type CreateJobState = { error?: string };

function str(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function createJobAction(
  _prevState: CreateJobState,
  formData: FormData
): Promise<CreateJobState> {
  const plate = str(formData, "plate").toUpperCase();
  if (!plate) {
    return { error: "La patente es obligatoria." };
  }

  const clientRequest = str(formData, "client_request");
  const workDescription = str(formData, "work_description");

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
  });

  const photos = formData.getAll("photos").filter(
    (item): item is File => item instanceof File && item.size > 0
  );

  for (const photo of photos) {
    const path = await uploadJobPhoto(job.id, photo);
    await addPhoto(job.id, path);
  }

  redirect(`/trabajo/${job.id}`);
}
