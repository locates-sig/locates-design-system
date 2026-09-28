import * as React from "react";
import { cn } from "@/lib/utils";

export interface MapTooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Primary label or title displayed inside the tooltip */
  label?: React.ReactNode;
  /** Optional sublabel or value text */
  sublabel?: React.ReactNode;
  /** Pointer arrow tip position when attached to map elements */
  tipPosition?: "top" | "bottom" | "left" | "right" | "none";
  /** Optional status or indicator dot color */
  dotColor?: string;
}

const tipClasses: Record<NonNullable<MapTooltipProps["tipPosition"]>, string> = {
  bottom:
    "after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-black/80",
  top:
    "after:content-[''] after:absolute after:bottom-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-b-black/80",
  left:
    "after:content-[''] after:absolute after:right-full after:top-1/2 after:-translate-y-1/2 after:border-4 after:border-transparent after:border-r-black/80",
  right:
    "after:content-[''] after:absolute after:left-full after:top-1/2 after:-translate-y-1/2 after:border-4 after:border-transparent after:border-l-black/80",
  none: "",
};

export const MapTooltip = React.forwardRef<HTMLDivElement, MapTooltipProps>(
  (
    {
      className,
      label,
      sublabel,
      tipPosition = "none",
      dotColor,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center gap-1.5 px-2.5 py-1 text-white font-sans text-micro-11 font-medium leading-none rounded-xs shadow-md select-none pointer-events-none w-max max-w-[220px] text-center z-50",
          "bg-black/80 backdrop-blur-xs border border-white/10",
          tipClasses[tipPosition],
          className
        )}
        {...props}
      >
        {dotColor && (
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ backgroundColor: dotColor }}
            aria-hidden="true"
          />
        )}
        {children || (
          <span className="truncate">
            {label}
            {sublabel && (
              <span className="opacity-75 font-normal ml-1 font-mono">
                ({sublabel})
              </span>
            )}
          </span>
        )}
      </div>
    );
  }
);

MapTooltip.displayName = "MapTooltip";