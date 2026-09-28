import * as React from "react";
import { cn } from "@/lib/utils";

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Visual color theme variant */
  variant?: "primary" | "white" | "muted" | "secondary";
  /** Size scale */
  size?: "xs" | "sm" | "default" | "lg" | "xl";
  /** Screen reader label for accessibility */
  label?: string;
}

const variantClasses: Record<NonNullable<SpinnerProps["variant"]>, string> = {
  primary: "text-primary",
  white: "text-white",
  muted: "text-muted-foreground",
  secondary: "text-secondary-foreground",
};

const sizeClasses: Record<NonNullable<SpinnerProps["size"]>, string> = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  default: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-10 w-10",
};

export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  (
    {
      className,
      variant = "primary",
      size = "default",
      label = "Carregando...",
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        role="status"
        aria-label={label}
        className={cn(
          "inline-flex items-center justify-center shrink-0",
          className
        )}
        {...props}
      >
        <svg
          className={cn(
            "animate-spin",
            variantClasses[variant],
            sizeClasses[size]
          )}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <span className="sr-only">{label}</span>
      </span>
    );
  }
);

Spinner.displayName = "Spinner";