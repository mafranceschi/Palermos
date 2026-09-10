import { NewJobForm } from "./NewJobForm";

export default function NuevoIngresoPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-lg font-semibold">Nuevo ingreso</h1>
      <NewJobForm />
    </div>
  );
}
