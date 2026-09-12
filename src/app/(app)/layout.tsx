import Link from "next/link";
import { Plus, LogOut } from "lucide-react";
import { logout } from "@/app/logout/actions";
import { BrandMark } from "@/components/BrandMark";
import { NavLinks } from "./NavLinks";
import { buttonPrimary } from "@/lib/ui";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950">
      <header className="sticky top-0 z-20 bg-neutral-950 shadow-lg shadow-black/10">
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-40">
          <div className="absolute -left-20 -top-20 h-48 w-48 rounded-full bg-orange-600/30 blur-3xl" />
          <div className="absolute right-0 top-0 h-48 w-64 rounded-full bg-red-600/20 blur-3xl" />
        </div>
        <div className="relative mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="flex items-center gap-2.5">
            <BrandMark size="sm" />
            <span className="text-base font-extrabold tracking-tight text-white">
              Palermos
            </span>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2">
            <NavLinks />
            <Link href="/nuevo" className={`ml-1 ${buttonPrimary}`}>
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              <span className="hidden sm:inline">Nuevo ingreso</span>
            </Link>
            <form action={logout}>
              <button
                type="submit"
                title="Salir"
                className="inline-flex items-center justify-center rounded-full p-2.5 text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <LogOut className="h-4 w-4" strokeWidth={2.25} />
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
