export type JobStatus = "ingresado" | "en_reparacion" | "listo" | "entregado";

export const JOB_STATUSES: JobStatus[] = [
  "ingresado",
  "en_reparacion",
  "listo",
  "entregado",
];

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  ingresado: "Ingresado",
  en_reparacion: "En reparación",
  listo: "Listo",
  entregado: "Entregado",
};

export type Client = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  notes: string | null;
  created_at: string;
};

export type Vehicle = {
  id: string;
  client_id: string;
  plate: string;
  brand: string | null;
  model: string | null;
  year: number | null;
  color: string | null;
  created_at: string;
};

export type Job = {
  id: string;
  vehicle_id: string;
  client_request: string | null;
  work_description: string | null;
  status: JobStatus;
  entry_date: string;
  exit_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Photo = {
  id: string;
  job_id: string;
  storage_path: string;
  caption: string | null;
  created_at: string;
};

export type JobWithRelations = Job & {
  vehicle: Vehicle & { client: Client };
  photos: Photo[];
};
