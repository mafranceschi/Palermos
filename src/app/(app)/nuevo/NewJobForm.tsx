"use client";

import { useActionState, useRef, useState, useTransition } from "react";
import { compressImage } from "@/lib/image-compression";
import { createJobAction, type CreateJobState } from "./actions";
import type { Client, Vehicle } from "@/lib/types";

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
  const [previews, setPreviews] = useState<string[]>([]);
  const [compressing, setCompressing] = useState(false);

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

      setPreviews((prev) => {
        prev.forEach((url) => URL.revokeObjectURL(url));
        return compressed.map((file) => URL.createObjectURL(file));
      });
    } finally {
      setCompressing(false);
    }
  }

  const vehicleKnown = vehicleStatus === "found";

  return (
    <form action={formAction} className="space-y-6">
      <section className="space-y-3 rounded-lg border border-neutral-200 bg-white p-4">
        <h2 className="font-medium">Vehículo</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <input
            type="text"
            name="plate"
            placeholder="Patente *"
            required
            onBlur={handlePlateBlur}
            className="col-span-2 rounded-md border border-neutral-300 px-3 py-2 text-sm uppercase sm:col-span-1"
          />
          <input
            type="text"
            name="brand"
            placeholder="Marca"
            disabled={vehicleKnown}
            defaultValue={foundVehicle?.brand ?? ""}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm disabled:bg-neutral-100"
          />
          <input
            type="text"
            name="model"
            placeholder="Modelo"
            disabled={vehicleKnown}
            defaultValue={foundVehicle?.model ?? ""}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm disabled:bg-neutral-100"
          />
          <input
            type="text"
            name="color"
            placeholder="Color"
            disabled={vehicleKnown}
            defaultValue={foundVehicle?.color ?? ""}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm disabled:bg-neutral-100"
          />
        </div>

        {vehicleStatus === "found" && foundVehicle && (
          <p className="rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-800">
            Vehículo existente de <strong>{foundVehicle.client.name}</strong>.
            Se va a agregar este ingreso a ese vehículo.
          </p>
        )}
      </section>

      {vehicleStatus !== "found" && (
        <section className="space-y-3 rounded-lg border border-neutral-200 bg-white p-4">
          <h2 className="font-medium">Cliente</h2>
          <p className="text-xs text-neutral-500">
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
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm disabled:bg-neutral-100"
            />
            {clientResults.length > 0 && !selectedClient && (
              <ul className="absolute z-10 mt-1 w-full rounded-md border border-neutral-200 bg-white shadow-lg">
                {clientResults.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedClient(c);
                        setClientResults([]);
                      }}
                      className="block w-full px-3 py-2 text-left text-sm hover:bg-neutral-50"
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
            <div className="flex items-center justify-between rounded-md bg-green-50 px-3 py-2 text-sm text-green-800">
              <span>
                Cliente existente seleccionado: {selectedClient.name}
              </span>
              <button
                type="button"
                onClick={() => setSelectedClient(null)}
                className="text-green-700 underline"
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
                className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
              />
              <input
                type="email"
                name="client_email"
                placeholder="Email"
                className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
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

      <section className="space-y-3 rounded-lg border border-neutral-200 bg-white p-4">
        <h2 className="font-medium">Trabajo</h2>
        <textarea
          name="client_request"
          placeholder="¿Qué pidió el cliente?"
          rows={2}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
        <textarea
          name="work_description"
          placeholder="Descripción del trabajo / daño detectado"
          rows={3}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </section>

      <section className="space-y-3 rounded-lg border border-neutral-200 bg-white p-4">
        <h2 className="font-medium">Fotos</h2>
        <input
          ref={fileInputRef}
          type="file"
          name="photos"
          accept="image/*"
          multiple
          onChange={handleFilesChange}
          className="block w-full text-sm"
        />
        {compressing && (
          <p className="text-sm text-neutral-500">Optimizando fotos…</p>
        )}
        {previews.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {previews.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={src}
                alt=""
                className="h-20 w-20 rounded-md object-cover"
              />
            ))}
          </div>
        )}
      </section>

      {state.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || compressing}
        className="w-full rounded-md bg-neutral-900 px-4 py-3 font-medium text-white disabled:opacity-50"
      >
        {pending ? "Guardando..." : "Guardar ingreso"}
      </button>
    </form>
  );
}
