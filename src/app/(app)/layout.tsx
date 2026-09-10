import Link from "next/link";
import { Plus, LogOut } from "lucide-react";
import { logout } from "@/app/logout/actions";
import { BrandMark } from "@/components/BrandMark";
import { NavLinks } from "./NavLinks";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-orange-50/40 via-transparent to-transparent dark:from-orange-500/[0.06]">
      <header className="sticky top-0 z-20 border-b border-neutral-200/80 bg-white/85 backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-950/85">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="flex items-center gap-2.5">
            <BrandMark size="sm" />
            <span className="text-base font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Palermos
            </span>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2">
            <NavLinks />
            <Link
              href="/nuevo"
              className="ml-1 inline-flex items-center gap-1.5 rounded-xl bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-orange-700 hover:shadow-md active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              <span className="hidden sm:inline">Nuevo ingreso</span>
            </Link>
            <form action={logout}>
              <button
                type="submit"
                title="Salir"
                className="inline-flex items-center justify-center rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
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
