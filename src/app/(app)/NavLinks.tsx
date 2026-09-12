"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Users } from "lucide-react";

const links = [
  { href: "/", label: "Ingresos", icon: LayoutGrid },
  { href: "/clientes", label: "Clientes", icon: Users },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map(({ href, label, icon: Icon }) => {
        const active =
          href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-2 text-sm font-semibold transition-colors sm:px-3.5 ${
              active
                ? "bg-white/15 text-white"
                : "text-neutral-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4" strokeWidth={2.25} />
            <span className="hidden sm:inline">{label}</span>
          </Link>
        );
      })}
    </>
  );
}
