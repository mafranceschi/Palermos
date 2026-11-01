"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
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
            className={`relative flex items-center gap-1.5 rounded-full px-2.5 py-2 text-sm font-semibold transition-colors sm:px-3.5 ${
              active ? "text-white" : "text-navy-200 hover:text-white"
            }`}
          >
            {/* La "píldora" activa se desliza de un link al otro al navegar. */}
            {active && (
              <motion.span
                layoutId="nav-active-pill"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
                className="absolute inset-0 rounded-full bg-white/12 ring-1 ring-inset ring-white/15"
              >
                <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-orange-400" />
              </motion.span>
            )}
            <Icon className="relative h-4 w-4" strokeWidth={2.25} />
            <span className="relative hidden sm:inline">{label}</span>
          </Link>
        );
      })}
    </>
  );
}
