"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Car, Mail, Phone } from "lucide-react";
import { getAvatarGradient, getInitials } from "@/lib/ui";
import type { ClientWithVehicleCount } from "@/lib/data";

export function ClientCards({ clients }: { clients: ClientWithVehicleCount[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {clients.map((client, i) => (
        <motion.div
          key={client.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: Math.min(i * 0.05, 0.4), ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            href={`/clientes/${client.id}`}
            className="group flex items-start gap-3 rounded-3xl border border-neutral-200/80 bg-white p-4 shadow-[0_1px_2px_rgb(21_38_74/0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-navy-900/10 dark:border-white/5 dark:bg-neutral-900 dark:hover:border-orange-500/30"
          >
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-sm font-extrabold text-white shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3 ${getAvatarGradient(client.name)}`}
            >
              {getInitials(client.name)}
            </span>
            <div className="min-w-0 flex-1 space-y-1">
              <p className="truncate font-bold text-navy-900 transition-colors group-hover:text-orange-600 dark:text-neutral-100 dark:group-hover:text-orange-400">
                {client.name}
              </p>
              {client.phone && (
                <p className="flex items-center gap-1.5 truncate text-sm text-neutral-500 dark:text-neutral-400">
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  {client.phone}
                </p>
              )}
              {client.email && (
                <p className="flex items-center gap-1.5 truncate text-sm text-neutral-500 dark:text-neutral-400">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  {client.email}
                </p>
              )}
              <p className="flex items-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-500">
                <Car className="h-3.5 w-3.5" />
                {client.vehicleCount} vehículo{client.vehicleCount === 1 ? "" : "s"}
              </p>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
