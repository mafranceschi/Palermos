"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Car, ChevronRight } from "lucide-react";
import { StatusBadge, STATUS_TOP_ACCENT } from "@/components/StatusBadge";
import type { JobWithRelations } from "@/lib/types";

type JobCard = JobWithRelations & { thumbnailUrl: string | null };

export function JobCards({ jobs }: { jobs: JobCard[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {jobs.map((job, i) => (
        <motion.div
          key={job.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: Math.min(i * 0.05, 0.4), ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            href={`/trabajo/${job.id}`}
            className="group block overflow-hidden rounded-3xl border border-neutral-200/80 bg-white shadow-[0_1px_2px_rgb(21_38_74/0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-navy-900/10 dark:border-white/5 dark:bg-neutral-900 dark:hover:border-orange-500/30"
          >
            <div className={`h-1 bg-gradient-to-r ${STATUS_TOP_ACCENT[job.status]}`} />
            <div className="flex gap-3 p-3">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800">
                {job.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={job.thumbnailUrl}
                    alt={job.vehicle.plate}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-navy-50 to-navy-100 text-navy-300 dark:from-navy-900 dark:to-navy-950 dark:text-navy-600">
                    <Car className="h-7 w-7" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-mono text-lg font-bold tracking-wide text-navy-900 dark:text-white">
                    {job.vehicle.plate}
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 -translate-x-1 text-orange-500 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
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
