import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  selected?: boolean;
};

export function Chip({ selected, className, children, ...props }: ChipProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2",
        selected
          ? "border-orange-500 bg-orange-50 text-orange-900"
          : "border-slate-200 bg-white text-slate-700 hover:bg-amber-50",
        className,
      )}
      aria-pressed={selected}
      {...props}
    >
      {children}
    </button>
  );
}

