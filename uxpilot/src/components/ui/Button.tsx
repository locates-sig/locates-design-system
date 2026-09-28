import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive" | "link";
  /** Size scale */
  size?: "xs" | "sm" | "default" | "lg" | "icon";
  /** Whether the button takes up the full width of its container */
  fullWidth?: boolean;
  /** Shows a spinning loading state and disables interactions */
  isLoading?: boolean;
  /** Optional element rendered before children */
  leftIcon?: React.ReactNode;
  /** Optional element rendered after children */
  rightIcon?: React.ReactNode;
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default:
    "bg-primary text-primary-foreground hover:bg-primary-dark shadow-sm active:bg-primary-dark",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-lilac-highlight shadow-sm active:bg-lilac-highlight",
  outline:
    "border border-border bg-card text-foreground hover:bg-muted hover:text-foreground active:bg-muted/80",
  ghost:
    "bg-transparent text-foreground hover:bg-muted hover:text-foreground active:bg-muted/80",
  destructive:
    "bg-destructive-soft text-destructive hover:bg-destructive/20 active:bg-destructive/30",
  link:
    "bg-transparent text-primary underline-offset-4 hover:underline p-0 h-auto font-medium",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  xs: "h-6 px-2 text-xs rounded-md gap-1",
  sm: "h-7 px-2.5 text-xs rounded-md gap-1",
  default: "h-8 px-3 text-sm rounded-lg gap-1.5",
  lg: "h-9 px-4 text-sm rounded-lg gap-2",
  icon: "h-8 w-8 p-0 rounded-lg shrink-0 justify-center",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      fullWidth = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    const isIconOnly = size === "icon";

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 active:translate-y-px shrink-0 select-none",
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-4 w-4 shrink-0"
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
        ) : (
          leftIcon
        )}
        {!isIconOnly && children && <span>{children}</span>}
        {isIconOnly && !isLoading ? children : null}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";