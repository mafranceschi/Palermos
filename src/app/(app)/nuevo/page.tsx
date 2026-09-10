import { NewJobForm } from "./NewJobForm";

export default function NuevoIngresoPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
          Nuevo ingreso
        </h1>
        <p className="text-sm text-neutral-500">
          Registrá el vehículo, el cliente y las fotos del estado inicial.
        </p>
      </div>
      <NewJobForm />
    </div>
  );
}
