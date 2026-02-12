import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn(
        "rounded-3xl border border-slate-100 bg-white/80 p-6 shadow-sm ring-1 ring-slate-100/60 backdrop-blur-sm",
        "dark:border-slate-800 dark:bg-slate-900/80 dark:ring-slate-800/60",
        className,
      )}
      {...props}
    />
  );
}

