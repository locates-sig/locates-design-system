import * as React from "react";
import { cn } from "@/lib/utils";

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Metric label or title */
  label: React.ReactNode;
  /** Primary metric value formatted with tabular numbers */
  value: React.ReactNode;
  /** Trend value string (e.g. "+6,2%" or "-3,1%") or custom badge element */
  trend?: React.ReactNode;
  /** Direction of the trend indicator for automated styling and icon rendering */
  trendDirection?: "up" | "down" | "neutral";
  /** Optional contextual footnote or subtitle below the primary metric */
  subtitle?: React.ReactNode;
  /** Optional top-right icon element */
  icon?: React.ReactNode;
  /** Optional top status or category badge */
  badge?: React.ReactNode;
  /** Size scale affecting card paddings and metric typography */
  size?: "sm" | "default" | "lg";
  /** Whether to render with elevated soft shadow */
  elevated?: boolean;
}

export const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  (
    {
      className,
      label,
      value,
      trend,
      trendDirection,
      subtitle,
      icon,
      badge,
      size = "default",
      elevated = false,
      children,
      ...props
    },
    ref
  ) => {
    const inferredDirection =
      trendDirection ||
      (typeof trend === "string"
        ? trend.startsWith("+")
          ? "up"
          : trend.startsWith("-")
          ? "down"
          : "neutral"
        : "neutral");

    return (
      <div
        ref={ref}
        className={cn(
          "bg-card text-card-foreground rounded-lg border border-border transition-shadow duration-150 flex flex-col justify-between font-sans",
          elevated ? "shadow-soft" : "shadow-sm",
          size === "sm" && "p-3 gap-2",
          size === "default" && "p-4 gap-3",
          size === "lg" && "p-5 gap-4",
          className
        )}
        {...props}
      >
        {/* Header row: Label + Icon / Badge */}
        <div className="flex items-start justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-secondary line-clamp-1">
            {label}
          </span>
          {(badge || icon) && (
            <div className="flex items-center gap-1.5 shrink-0">
              {badge}
              {icon && <span className="text-gray-secondary">{icon}</span>}
            </div>
          )}
        </div>

        {/* Metric Value + Trend Badge */}
        <div className="flex items-baseline justify-between gap-2 flex-wrap">
          <div
            className={cn(
              "font-sans font-bold tracking-tight text-foreground tabular-nums",
              size === "sm" && "text-2xl leading-tight",
              size === "default" && "text-[32px] leading-[1.2]",
              size === "lg" && "text-3xl sm:text-4xl leading-none"
            )}
          >
            {value}
          </div>

          {trend && (
            <div
              className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold font-mono tabular-nums shrink-0 select-none",
                inferredDirection === "up" &&
                  "bg-green-50 text-green-700 border border-green-200/60",
                inferredDirection === "down" &&
                  "bg-destructive/10 text-destructive border border-destructive/20",
                inferredDirection === "neutral" &&
                  "bg-muted text-gray-secondary border border-border"
              )}
            >
              {inferredDirection === "up" && (
                <svg
                  className="w-3 h-3 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"
                  />
                </svg>
              )}
              {inferredDirection === "down" && (
                <svg
                  className="w-3 h-3 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
                  />
                </svg>
              )}
              <span>{trend}</span>
            </div>
          )}
        </div>

        {/* Subtitle / Footnote or Children */}
        {(subtitle || children) && (
          <div className="text-xs text-gray-secondary pt-1 border-t border-border/60">
            {subtitle}
            {children}
          </div>
        )}
      </div>
    );
  }
);

MetricCard.displayName = "MetricCard";