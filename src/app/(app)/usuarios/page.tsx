import { notFound } from "next/navigation";
import { ShieldCheck, UserPlus, Users } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { listUsers } from "@/lib/users";
import { card, pageHero, sectionIcon, sectionLabel } from "@/lib/ui";
import { HeroDecor } from "@/components/HeroDecor";
import { HeroHeading } from "@/components/HeroHeading";
import { NewUserForm } from "./NewUserForm";
import { UserRow } from "./UserRow";

export default async function UsersPage() {
  const me = await getSessionUser();
  // Pantalla solo para admin: para un viewer directamente no existe.
  if (me?.role !== "admin") notFound();

  const users = await listUsers();

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className={pageHero}>
        <HeroDecor icon={ShieldCheck} />
        <div className="relative">
          <HeroHeading
            eyebrow="Taller Palermo"
            title="Usuarios"
            subtitle="Quién puede entrar a la app y qué puede hacer."
          />
        </div>
      </div>

      <section className={`space-y-3 ${card}`}>
        <h2 className={sectionLabel}>
          <span className={sectionIcon}>
            <UserPlus />
          </span>
          Nuevo usuario
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          <strong className="text-navy-800 dark:text-neutral-200">Admin</strong> puede todo,
          incluido borrar trabajos, clientes y usuarios.{" "}
          <strong className="text-navy-800 dark:text-neutral-200">Solo lectura</strong> puede
          ver, cargar y editar, pero no borrar.
        </p>
        <NewUserForm />
      </section>

      <section className={`space-y-3 ${card}`}>
        <h2 className={sectionLabel}>
          <span className={sectionIcon}>
            <Users />
          </span>
          Usuarios ({users.length})
        </h2>
        <ul className="space-y-2">
          {users.map((user) => (
            <UserRow key={user.id} user={user} isMe={user.id === me.id} />
          ))}
        </ul>
      </section>
    </div>
  );
}
