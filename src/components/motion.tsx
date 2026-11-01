"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  MotionConfig,
  useInView,
  useMotionValue,
  useTransform,
  type Variants,
} from "framer-motion";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

// Respeta "reducir movimiento" del sistema en todas las animaciones de framer.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT } },
};

// Contenedor que hace aparecer a sus hijos <StaggerItem> en cascada.
export function Stagger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  );
}

// Número que cuenta desde 0 hasta el valor la primera vez que se ve.
export function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toString());

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, value, { duration: 0.9, ease: EASE_OUT });
    return () => controls.stop();
  }, [inView, value, count]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}
