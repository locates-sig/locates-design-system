import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Visual color variant */
  variant?:
    | "primary"
    | "secondary"
    | "positive"
    | "warning"
    | "lilac"
    | "outline"
    | "destructive";
  /** Size scale */
  size?: "sm" | "default" | "lg";
  /** Optional status indicator dot before label */
  dot?: boolean;
  /** Element rendered before the badge content */
  leftIcon?: React.ReactNode;
  /** Element rendered after the badge content */
  rightIcon?: React.ReactNode;
}

const variantClasses: Record<NonNullable<BadgeProps["variant"]>, string> = {
  primary: "bg-primary text-primary-foreground shadow-xs",
  secondary: "bg-secondary text-secondary-foreground hover:bg-lilac-highlight/50",
  positive: "bg-green-50 text-green-700 border border-green-200/60",
  warning: "bg-amber-100 text-amber-800 border border-amber-400/30",
  lilac: "bg-lilac-50 text-primary border border-primary/20",
  outline: "bg-card text-foreground border border-border",
  destructive: "bg-destructive/10 text-destructive border border-destructive/20",
};

const sizeClasses: Record<NonNullable<BadgeProps["size"]>, string> = {
  sm: "h-5 px-1.5 text-[10px] rounded-xs gap-1 font-semibold",
  default: "h-6 px-2.5 text-xs rounded-md gap-1.5 font-medium",
  lg: "h-7 px-3 text-xs rounded-lg gap-1.5 font-medium",
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = "primary",
      size = "default",
      dot = false,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-sans leading-none shrink-0 select-none transition-colors duration-150",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full shrink-0",
              variant === "positive"
                ? "bg-green-600"
                : variant === "warning"
                ? "bg-amber-600"
                : variant === "destructive"
                ? "bg-destructive"
                : "bg-current opacity-80"
            )}
            aria-hidden="true"
          />
        )}
        {leftIcon}
        {children && <span>{children}</span>}
        {rightIcon}
      </span>
    );
  }
);

Badge.displayName = "Badge";