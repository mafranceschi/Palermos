import "server-only";
import { getSupabaseAdmin, PHOTOS_BUCKET } from "@/lib/supabase-server";
import type {
  Client,
  Job,
  JobStatus,
  JobWithRelations,
  Photo,
  Vehicle,
} from "@/lib/types";

const JOB_SELECT = "*, vehicle:vehicles(*, client:clients(*)), photos(*)";

export type JobFilters = {
  plate?: string;
  clientName?: string;
  status?: JobStatus;
  dateFrom?: string;
  dateTo?: string;
};

export async function getJobs(
  filters: JobFilters = {}
): Promise<JobWithRelations[]> {
  const supabase = getSupabaseAdmin();

  let vehicleIds: string[] | undefined;

  if (filters.plate) {
    const { data, error } = await supabase
      .from("vehicles")
      .select("id")
      .ilike("plate", `%${filters.plate}%`);
    if (error) throw error;
    vehicleIds = (data ?? []).map((v) => v.id as string);
    if (vehicleIds.length === 0) return [];
  }

  if (filters.clientName) {
    const { data: clients, error: clientsError } = await supabase
      .from("clients")
      .select("id")
      .ilike("name", `%${filters.clientName}%`);
    if (clientsError) throw clientsError;
    const clientIds = (clients ?? []).map((c) => c.id as string);
    if (clientIds.length === 0) return [];

    const { data: vehiclesForClients, error: vehiclesError } = await supabase
      .from("vehicles")
      .select("id")
      .in("client_id", clientIds);
    if (vehiclesError) throw vehiclesError;
    const clientVehicleIds = (vehiclesForClients ?? []).map(
      (v) => v.id as string
    );

    vehicleIds = vehicleIds
      ? vehicleIds.filter((id) => clientVehicleIds.includes(id))
      : clientVehicleIds;
    if (vehicleIds.length === 0) return [];
  }

  let query = supabase
    .from("jobs")
    .select(JOB_SELECT)
    .order("entry_date", { ascending: false });

  if (vehicleIds) query = query.in("vehicle_id", vehicleIds);
  if (filters.status) query = query.eq("status", filters.status);
  if (filters.dateFrom) query = query.gte("entry_date", filters.dateFrom);
  if (filters.dateTo) query = query.lte("entry_date", filters.dateTo);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as unknown as JobWithRelations[];
}

export async function getJobById(
  id: string
): Promise<JobWithRelations | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("jobs")
    .select(JOB_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as unknown as JobWithRelations) ?? null;
}

export async function findVehicleByPlate(
  plate: string
): Promise<(Vehicle & { client: Client }) | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("vehicles")
    .select("*, client:clients(*)")
    .eq("plate", plate.toUpperCase())
    .maybeSingle();
  if (error) throw error;
  return (data as unknown as Vehicle & { client: Client }) ?? null;
}

export async function searchClients(search: string): Promise<Client[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .ilike("name", `%${search}%`)
    .order("name")
    .limit(10);
  if (error) throw error;
  return (data ?? []) as Client[];
}

export async function getClientById(id: string): Promise<Client | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as Client) ?? null;
}

export async function getClientHistory(clientId: string): Promise<{
  vehicles: Vehicle[];
  jobs: JobWithRelations[];
}> {
  const supabase = getSupabaseAdmin();

  const { data: vehicles, error: vehiclesError } = await supabase
    .from("vehicles")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });
  if (vehiclesError) throw vehiclesError;

  const vehicleIds = (vehicles ?? []).map((v) => v.id as string);
  if (vehicleIds.length === 0) {
    return { vehicles: (vehicles ?? []) as Vehicle[], jobs: [] };
  }

  const { data: jobs, error: jobsError } = await supabase
    .from("jobs")
    .select(JOB_SELECT)
    .in("vehicle_id", vehicleIds)
    .order("entry_date", { ascending: false });
  if (jobsError) throw jobsError;

  return {
    vehicles: (vehicles ?? []) as Vehicle[],
    jobs: (jobs ?? []) as unknown as JobWithRelations[],
  };
}

export type NewClientInput = {
  name: string;
  phone?: string;
  email?: string;
  notes?: string;
};

export async function createClient(input: NewClientInput): Promise<Client> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("clients")
    .insert({
      name: input.name,
      phone: input.phone || null,
      email: input.email || null,
      notes: input.notes || null,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as Client;
}

export type NewVehicleInput = {
  client_id: string;
  plate: string;
  brand?: string;
  model?: string;
  year?: number;
  color?: string;
};

export async function createVehicle(
  input: NewVehicleInput
): Promise<Vehicle> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("vehicles")
    .insert({
      client_id: input.client_id,
      plate: input.plate.toUpperCase(),
      brand: input.brand || null,
      model: input.model || null,
      year: input.year ?? null,
      color: input.color || null,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as Vehicle;
}

export type NewJobInput = {
  vehicle_id: string;
  client_request?: string;
  work_description?: string;
  notes?: string;
};

export async function createJob(input: NewJobInput): Promise<Job> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("jobs")
    .insert({
      vehicle_id: input.vehicle_id,
      client_request: input.client_request || null,
      work_description: input.work_description || null,
      notes: input.notes || null,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as Job;
}

export async function updateJob(
  id: string,
  input: Partial<{
    client_request: string;
    work_description: string;
    notes: string;
    status: JobStatus;
    exit_date: string | null;
  }>
): Promise<Job> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("jobs")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as Job;
}

export async function addPhoto(
  jobId: string,
  storagePath: string,
  caption?: string
): Promise<Photo> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("photos")
    .insert({ job_id: jobId, storage_path: storagePath, caption: caption || null })
    .select("*")
    .single();
  if (error) throw error;
  return data as Photo;
}

export async function uploadJobPhoto(
  jobId: string,
  file: File
): Promise<string> {
  const supabase = getSupabaseAdmin();
  const path = `${jobId}/${crypto.randomUUID()}-${file.name}`;
  const { error } = await supabase.storage
    .from(PHOTOS_BUCKET)
    .upload(path, file, { contentType: file.type });
  if (error) throw error;
  return path;
}

export async function getSignedPhotoUrl(
  storagePath: string,
  expiresInSeconds = 3600
): Promise<string> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage
    .from(PHOTOS_BUCKET)
    .createSignedUrl(storagePath, expiresInSeconds);
  if (error) throw error;
  return data.signedUrl;
}

export async function getSignedPhotoUrls(
  photos: Photo[]
): Promise<(Photo & { url: string })[]> {
  return Promise.all(
    photos.map(async (photo) => ({
      ...photo,
      url: await getSignedPhotoUrl(photo.storage_path),
    }))
  );
}
