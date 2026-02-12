import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  iconLeft?: ReactNode;
  fullWidth?: boolean;
};

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors";

const sizeStyles: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-7 text-base",
};

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-orange-600 text-white hover:bg-orange-700 focus-visible:ring-orange-600 shadow-sm",
  secondary:
    "bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-100 focus-visible:ring-orange-600",
  ghost:
    "bg-transparent text-amber-900 hover:bg-amber-50 focus-visible:ring-orange-600",
};

export function Button({
  variant = "primary",
  size = "md",
  iconLeft,
  fullWidth,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {iconLeft && <span aria-hidden="true">{iconLeft}</span>}
      <span>{children}</span>
    </button>
  );
}

