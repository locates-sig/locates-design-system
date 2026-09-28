import * as React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual fill and shape preset variant */
  variant?: "default" | "subtle" | "circle" | "card" | "text";
  /** Custom inline width (e.g. 100, "100%", "20rem") */
  width?: string | number;
  /** Custom inline height (e.g. 40, "2.5rem") */
  height?: string | number;
}

const variantClasses: Record<NonNullable<SkeletonProps["variant"]>, string> = {
  default: "bg-muted/80 rounded-md",
  subtle: "bg-gray-100 rounded-md",
  circle: "bg-muted/80 rounded-full shrink-0",
  card: "bg-muted/60 rounded-xl",
  text: "bg-muted/80 rounded h-4 w-full",
};

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      className,
      variant = "default",
      width,
      height,
      style,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(
          "animate-pulse",
          variantClasses[variant],
          className
        )}
        style={{
          width: typeof width === "number" ? `${width}px` : width,
          height: typeof height === "number" ? `${height}px` : height,
          ...style,
        }}
        {...props}
      />
    );
  }
);

Skeleton.displayName = "Skeleton";