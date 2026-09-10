import { Wrench } from "lucide-react";

export function BrandMark({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dims = { sm: "h-7 w-7", md: "h-9 w-9", lg: "h-12 w-12" }[size];
  const iconDims = { sm: "h-3.5 w-3.5", md: "h-4 w-4", lg: "h-6 w-6" }[size];

  return (
    <span
      className={`inline-flex ${dims} shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-sm`}
    >
      <Wrench className={iconDims} strokeWidth={2.25} />
    </span>
  );
}
