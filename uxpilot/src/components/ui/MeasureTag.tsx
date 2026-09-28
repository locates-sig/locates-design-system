import * as React from "react";
import { cn } from "@/lib/utils";

export interface MeasureTagProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The measured metric value (e.g. "1.248 m²" or "42,5 m") */
  value?: React.ReactNode;
  /** Variant type: "area" for surface measurements, "edge" for line distance measurements */
  variant?: "area" | "edge";
  /** Size scale */
  size?: "sm" | "default";
  /** Optional measurement tool icon or prefix */
  icon?: React.ReactNode;
}

export const MeasureTag = React.forwardRef<HTMLDivElement, MeasureTagProps>(
  (
    {
      className,
      value,
      variant = "area",
      size = "default",
      icon,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 font-mono font-semibold tabular-nums text-white rounded-xs border shadow-sm select-none shrink-0 tracking-tight leading-none",
          variant === "area"
            ? "bg-primary/95 border-white/20"
            : "bg-primary/90 border-white/15",
          size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-1 text-xs",
          className
        )}
        {...props}
      >
        {icon || (
          <span className="opacity-80 shrink-0" aria-hidden="true">
            {variant === "area" ? (
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4h16v16H4z"
                />
              </svg>
            ) : (
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 12h16"
                />
              </svg>
            )}
          </span>
        )}
        <span>{children || value}</span>
      </div>
    );
  }
);

MeasureTag.displayName = "MeasureTag";