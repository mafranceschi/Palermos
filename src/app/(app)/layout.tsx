import Link from "next/link";
import { logout } from "@/app/logout/actions";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/" className="font-semibold text-neutral-900">
            Taller — Chapa y Pintura
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/" className="text-neutral-600 hover:text-neutral-900">
              Ingresos
            </Link>
            <Link
              href="/nuevo"
              className="rounded-md bg-neutral-900 px-3 py-1.5 font-medium text-white hover:bg-neutral-700"
            >
              + Nuevo ingreso
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="text-neutral-500 hover:text-neutral-900"
              >
                Salir
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        {children}
      </main>
    </div>
  );
}
