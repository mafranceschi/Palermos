"use client";

import { useActionState, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Camera, Car, CheckCircle2, User, Wrench, X } from "lucide-react";
import { compressImage } from "@/lib/image-compression";
import { createJobAction, type CreateJobState } from "./actions";
import type { Client, Vehicle } from "@/lib/types";
import { card, input, sectionLabel } from "@/lib/ui";

const initialState: CreateJobState = {};

type FoundVehicle = Vehicle & { client: Client };

export function NewJobForm() {
  const [state, formAction, pending] = useActionState(
    createJobAction,
    initialState
  );

  const [vehicleStatus, setVehicleStatus] = useState<
    "idle" | "loading" | "found" | "not_found"
  >("idle");
  const [foundVehicle, setFoundVehicle] = useState<FoundVehicle | null>(null);

  const [clientResults, setClientResults] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [, startSearchTransition] = useTransition();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [compressing, setCompressing] = useState(false);

  const previews = useMemo(
    () => photoFiles.map((f) => URL.createObjectURL(f)),
    [photoFiles]
  );

  useEffect(() => {
    return () => previews.forEach((u) => URL.revokeObjectURL(u));
  }, [previews]);

  function syncInputFiles(files: File[]) {
    const dataTransfer = new DataTransfer();
    files.forEach((file) => dataTransfer.items.add(file));
    if (fileInputRef.current) {
      fileInputRef.current.files = dataTransfer.files;
    }
  }

  async function handlePlateBlur(e: React.FocusEvent<HTMLInputElement>) {
    const plate = e.target.value.trim();
    if (!plate) {
      setVehicleStatus("idle");
      return;
    }
    setVehicleStatus("loading");
    try {
      const res = await fetch(
        `/api/vehicles/lookup?plate=${encodeURIComponent(plate)}`
      );
      const data = await res.json();
      if (data.vehicle) {
        setFoundVehicle(data.vehicle);
        setVehicleStatus("found");
      } else {
        setFoundVehicle(null);
        setVehicleStatus("not_found");
      }
    } catch {
      setVehicleStatus("idle");
    }
  }

  function handleClientNameChange(value: string) {
    setSelectedClient(null);
    if (value.trim().length < 2) {
      setClientResults([]);
      return;
    }
    startSearchTransition(async () => {
      const res = await fetch(
        `/api/clients/search?q=${encodeURIComponent(value)}`
      );
      const data = await res.json();
      setClientResults(data.clients ?? []);
    });
  }

  async function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newFiles = Array.from(e.target.files ?? []);
    if (newFiles.length === 0) return;

    setCompressing(true);
    try {
      const compressed = await Promise.all(newFiles.map(compressImage));
      setPhotoFiles((prev) => {
        const combined = [...prev, ...compressed];
        syncInputFiles(combined);
        return combined;
      });
    } finally {
      setCompressing(false);
    }
  }

  function removePhoto(index: number) {
    setPhotoFiles((prev) => {
      const next = prev.filter((_, i) => i !== index);
      syncInputFiles(next);
      return next;
    });
  }

  const vehicleKnown = vehicleStatus === "found";

  return (
    <form action={formAction} className="space-y-5">
      <section className={`space-y-3 ${card}`}>
        <h2 className={sectionLabel}>
          <Car className="h-4 w-4 text-orange-600" />
          Vehículo
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <input
            type="text"
            name="plate"
            placeholder="Patente *"
            required
            onBlur={handlePlateBlur}
            className={`col-span-2 uppercase sm:col-span-1 ${input}`}
          />
          <input
            type="text"
            name="brand"
            placeholder="Marca"
            disabled={vehicleKnown}
            defaultValue={foundVehicle?.brand ?? ""}
            className={`${input} disabled:bg-neutral-100 disabled:text-neutral-400 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-500`}
          />
          <input
            type="text"
            name="model"
            placeholder="Modelo"
            disabled={vehicleKnown}
            defaultValue={foundVehicle?.model ?? ""}
            className={`${input} disabled:bg-neutral-100 disabled:text-neutral-400 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-500`}
          />
          <input
            type="text"
            name="color"
            placeholder="Color"
            disabled={vehicleKnown}
            defaultValue={foundVehicle?.color ?? ""}
            className={`${input} disabled:bg-neutral-100 disabled:text-neutral-400 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-500`}
          />
        </div>

        {vehicleStatus === "found" && foundVehicle && (
          <p className="flex items-start gap-2 rounded-xl bg-blue-50 px-3 py-2.5 text-sm text-blue-800 dark:bg-blue-500/10 dark:text-blue-300">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Vehículo existente de <strong>{foundVehicle.client.name}</strong>.
              Se va a agregar este ingreso a ese vehículo.
            </span>
          </p>
        )}
      </section>

      {vehicleStatus !== "found" && (
        <section className={`space-y-3 ${card}`}>
          <h2 className={sectionLabel}>
            <User className="h-4 w-4 text-orange-600" />
            Cliente
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Buscá si ya es cliente del taller, o completá los datos para
            crearlo.
          </p>

          <div className="relative">
            <input
              type="text"
              name="client_name"
              placeholder="Nombre del cliente *"
              defaultValue={selectedClient?.name ?? ""}
              disabled={!!selectedClient}
              onChange={(e) => handleClientNameChange(e.target.value)}
              className={`${input} disabled:bg-neutral-100 disabled:text-neutral-400 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-500`}
            />
            {clientResults.length > 0 && !selectedClient && (
              <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
                {clientResults.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedClient(c);
                        setClientResults([]);
                      }}
                      className="block w-full px-3.5 py-2.5 text-left text-sm hover:bg-orange-50 dark:text-neutral-100 dark:hover:bg-orange-500/10"
                    >
                      {c.name}{" "}
                      {c.phone && (
                        <span className="text-neutral-400">— {c.phone}</span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {selectedClient ? (
            <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Cliente existente: {selectedClient.name}
              </span>
              <button
                type="button"
                onClick={() => setSelectedClient(null)}
                className="font-medium underline underline-offset-2"
              >
                Cambiar
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                name="client_phone"
                placeholder="Teléfono"
                className={input}
              />
              <input
                type="email"
                name="client_email"
                placeholder="Email"
                className={input}
              />
            </div>
          )}
          <input
            type="hidden"
            name="client_id"
            value={selectedClient?.id ?? ""}
          />
        </section>
      )}

      <section className={`space-y-3 ${card}`}>
        <h2 className={sectionLabel}>
          <Wrench className="h-4 w-4 text-orange-600" />
          Trabajo
        </h2>
        <textarea
          name="client_request"
          placeholder="¿Qué pidió el cliente?"
          rows={2}
          className={input}
        />
        <textarea
          name="work_description"
          placeholder="Descripción del trabajo / daño detectado"
          rows={3}
          className={input}
        />
      </section>

      <section className={`space-y-3 ${card}`}>
        <h2 className={sectionLabel}>
          <Camera className="h-4 w-4 text-orange-600" />
          Fotos
        </h2>

        <label className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 px-4 py-6 text-center transition-colors hover:border-orange-400 hover:bg-orange-50/50 dark:border-neutral-700 dark:bg-neutral-800/50 dark:hover:border-orange-500/60 dark:hover:bg-orange-500/5">
          <Camera className="h-6 w-6 text-neutral-400" />
          <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
            {compressing ? "Optimizando fotos…" : "Tocá para sacar o subir fotos"}
          </span>
          <span className="text-xs text-neutral-400 dark:text-neutral-500">
            Se comprimen automáticamente antes de subir
          </span>
          <input
            ref={fileInputRef}
            type="file"
            name="photos"
            accept="image/*"
            multiple
            onChange={handleFilesChange}
            className="hidden"
          />
        </label>

        {previews.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {previews.map((src, i) => (
              <div key={i} className="group relative h-20 w-20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  className="h-full w-full rounded-xl object-cover"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-white shadow-sm transition-transform hover:scale-110"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {state.error && (
        <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || compressing}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 py-3.5 text-base font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl hover:shadow-orange-500/35 hover:brightness-105 active:scale-[0.98] disabled:opacity-50"
      >
        {pending ? "Guardando..." : "Guardar ingreso"}
      </button>
    </form>
  );
}
