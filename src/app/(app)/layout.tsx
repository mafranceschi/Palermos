import Link from "next/link";
import { Plus, LogOut } from "lucide-react";
import { logout } from "@/app/logout/actions";
import { BrandMark, BrandWordmark } from "@/components/BrandMark";
import { NavLinks } from "./NavLinks";
import { buttonPrimary } from "@/lib/ui";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="sticky top-0 z-20 bg-navy-900/95 shadow-lg shadow-navy-950/20 backdrop-blur-md supports-[backdrop-filter]:bg-navy-900/85">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-24 -top-24 h-52 w-52 animate-drift rounded-full bg-orange-500/20 blur-3xl" />
          <div className="absolute right-10 -top-16 h-40 w-72 animate-drift-slow rounded-full bg-navy-500/30 blur-3xl" />
        </div>
        <div className="relative mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
              <BrandMark size="sm" />
            </span>
            <BrandWordmark />
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
                className="inline-flex items-center justify-center rounded-full p-2.5 text-navy-200 transition-colors hover:bg-white/10 hover:text-white"
              >
                <LogOut className="h-4 w-4" strokeWidth={2.25} />
              </button>
            </form>
          </nav>
        </div>
        {/* Franja naranja de la marca bajo la navbar */}
        <div className="h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-70" />
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
