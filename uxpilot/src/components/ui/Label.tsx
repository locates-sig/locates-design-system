import * as React from "react";
import { cn } from "@/lib/utils";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** Size scale ranging from micro uppercase labels to standard text */
  size?: "micro" | "xs" | "sm" | "default" | "lg";
  /** Renders a red required asterisk next to label text */
  required?: boolean;
}

const sizeClasses: Record<NonNullable<LabelProps["size"]>, string> = {
  micro: "text-micro-10 font-semibold tracking-wider uppercase text-gray-secondary",
  xs: "text-xs font-medium text-foreground",
  sm: "text-xs font-medium text-foreground",
  default: "text-sm font-medium text-foreground",
  lg: "text-base font-medium text-foreground",
};

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, size = "default", required = false, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "select-none leading-none inline-flex items-center",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
        {required && (
          <span className="text-destructive ml-0.5" aria-hidden="true">
            *
          </span>
        )}
      </label>
    );
  }
);

Label.displayName = "Label";