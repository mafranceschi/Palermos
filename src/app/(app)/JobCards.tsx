"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Car } from "lucide-react";
import { StatusBadge, STATUS_TOP_ACCENT } from "@/components/StatusBadge";
import type { JobWithRelations } from "@/lib/types";

type JobCard = JobWithRelations & { thumbnailUrl: string | null };

export function JobCards({ jobs }: { jobs: JobCard[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {jobs.map((job, i) => (
        <motion.div
          key={job.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.4) }}
        >
          <Link
            href={`/trabajo/${job.id}`}
            className="group block overflow-hidden rounded-3xl border border-neutral-200/70 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div className={`h-1.5 bg-gradient-to-r ${STATUS_TOP_ACCENT[job.status]}`} />
            <div className="flex gap-3 p-3">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800">
                {job.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={job.thumbnailUrl}
                    alt={job.vehicle.plate}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-neutral-300 dark:text-neutral-600">
                    <Car className="h-7 w-7" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-lg font-extrabold text-neutral-900 dark:text-neutral-100">
                    {job.vehicle.plate}
                  </span>
                </div>
                <StatusBadge status={job.status} />
                <p className="truncate text-sm text-neutral-600 dark:text-neutral-300">
                  {job.vehicle.brand} {job.vehicle.model}
                </p>
                <p className="truncate text-sm text-neutral-500 dark:text-neutral-400">
                  {job.vehicle.client.name}
                </p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500">
                  {new Date(job.entry_date).toLocaleDateString("es-AR")}
                </p>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
