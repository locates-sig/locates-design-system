import * as React from "react";
import { cn } from "@/lib/utils";

export interface KeyValueItem {
  /** Metric label name */
  label: string;
  /** Metric value */
  value: React.ReactNode;
  /** Optional custom text color utility class for value (e.g. "text-green-700") */
  valueColor?: string;
}

export interface MapPopupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Visual variant type */
  variant?: "default" | "tooltip" | "measure" | "zoning";
  /** Optional micro label displayed above the popup title */
  eyebrow?: string;
  /** Main title heading of the map popup */
  title?: React.ReactNode;
  /** Structured array of key-value metrics */
  items?: KeyValueItem[];
  /** Optional callback fired when clicking the top-right close icon */
  onClose?: () => void;
  /** Pointer arrow tip position */
  tipPosition?: "bottom" | "top" | "left" | "right" | "none";
  /** Sub-type for measure variant */
  measureType?: "area" | "edge";
}

const tipClasses: Record<NonNullable<MapPopupProps["tipPosition"]>, string> = {
  bottom:
    "after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-8 after:border-transparent after:border-t-card",
  top:
    "after:content-[''] after:absolute after:bottom-full after:left-1/2 after:-translate-x-1/2 after:border-8 after:border-transparent after:border-b-card",
  left:
    "after:content-[''] after:absolute after:right-full after:top-1/2 after:-translate-y-1/2 after:border-8 after:border-transparent after:border-r-card",
  right:
    "after:content-[''] after:absolute after:left-full after:top-1/2 after:-translate-y-1/2 after:border-8 after:border-transparent after:border-l-card",
  none: "",
};

export const MapPopup = React.forwardRef<HTMLDivElement, MapPopupProps>(
  (
    {
      className,
      variant = "default",
      eyebrow,
      title,
      items,
      onClose,
      tipPosition = "bottom",
      measureType = "area",
      children,
      ...props
    },
    ref
  ) => {
    // 1. Tooltip variant
    if (variant === "tooltip") {
      return (
        <div
          ref={ref}
          className={cn(
            "bg-navy-950/90 text-white border border-white/10 rounded-xs px-2.5 py-1 text-micro-11 font-medium font-sans shadow-md w-max max-w-[200px] text-center select-none",
            className
          )}
          {...props}
        >
          {children || title}
        </div>
      );
    }

    // 2. Measure variant
    if (variant === "measure") {
      return (
        <div
          ref={ref}
          className={cn(
            "inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-semibold font-mono text-white shadow-sm border border-white/15 tabular-nums select-none",
            measureType === "area" ? "bg-navy-900" : "bg-navy-950/85",
            className
          )}
          {...props}
        >
          {children || title}
        </div>
      );
    }

    // 3. Zoning / Custom container variant
    if (variant === "zoning") {
      return (
        <div
          ref={ref}
          className={cn(
            "bg-card text-foreground rounded-md shadow-popup border border-border min-w-[288px] max-w-[379px] relative overflow-hidden font-sans",
            tipPosition !== "none" && tipClasses[tipPosition],
            className
          )}
          {...props}
        >
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="absolute top-2 right-2 z-10 p-1 text-gray-secondary hover:text-foreground rounded-md transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
          {children}
        </div>
      );
    }

    // 4. Default Mapbox click popup variant
    return (
      <div
        ref={ref}
        className={cn(
          "bg-card text-foreground rounded-md shadow-popup border border-border p-4 w-[320px] min-w-[288px] max-w-[379px] relative font-sans",
          tipPosition !== "none" && tipClasses[tipPosition],
          className
        )}
        {...props}
      >
        {/* Close Button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="absolute top-3 right-3 p-1 text-gray-secondary hover:text-foreground rounded transition-colors"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        {/* Header section */}
        {(eyebrow || title) && (
          <div className="mb-3 pr-6">
            {eyebrow && (
              <span className="block text-micro-10 font-semibold uppercase tracking-wider text-gray-secondary">
                {eyebrow}
              </span>
            )}
            {title && (
              <h4 className="text-sm font-semibold text-foreground tracking-tight">
                {title}
              </h4>
            )}
          </div>
        )}

        {/* Key-Value Pair metrics list */}
        {items && items.length > 0 && (
          <div className="space-y-1.5 pt-1 border-t border-border">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs font-sans py-0.5"
              >
                <span className="text-gray-secondary">{item.label}</span>
                <span
                  className={cn(
                    "font-mono font-semibold tabular-nums text-foreground",
                    item.valueColor
                  )}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Supplementary custom children */}
        {children && <div className="mt-2">{children}</div>}
      </div>
    );
  }
);

MapPopup.displayName = "MapPopup";