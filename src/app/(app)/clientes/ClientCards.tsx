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
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.4) }}
        >
          <Link
            href={`/clientes/${client.id}`}
            className="group flex items-start gap-3 rounded-3xl border border-neutral-200/70 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900"
          >
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-extrabold text-white shadow-sm ${getAvatarGradient(client.name)}`}
            >
              {getInitials(client.name)}
            </span>
            <div className="min-w-0 flex-1 space-y-1">
              <p className="truncate font-bold text-neutral-900 dark:text-neutral-100">
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
