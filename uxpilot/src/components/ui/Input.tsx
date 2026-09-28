import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Size scale for dense vs relaxed form layouts */
  size?: "sm" | "default" | "lg";
  /** Icon or visual element rendered inside the left edge */
  leftIcon?: React.ReactNode;
  /** Icon or visual element rendered inside the right edge */
  rightIcon?: React.ReactNode;
  /** Set true or pass error message to apply red error styling */
  error?: boolean | string;
}

const sizeClasses: Record<NonNullable<InputProps["size"]>, string> = {
  sm: "h-7 px-2.5 text-xs rounded-md",
  default: "h-8 px-3 text-sm rounded-md",
  lg: "h-9 px-3.5 text-sm rounded-lg",
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      size = "default",
      leftIcon,
      rightIcon,
      error,
      disabled,
      type = "text",
      ...props
    },
    ref
  ) => {
    const hasError = Boolean(error);

    return (
      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="absolute left-2.5 text-gray-secondary pointer-events-none flex items-center justify-center shrink-0">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          disabled={disabled}
          className={cn(
            "w-full border bg-card text-foreground font-sans placeholder:text-gray-secondary transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100",
            hasError
              ? "border-destructive focus-visible:ring-destructive/50 focus-visible:border-destructive"
              : "border-input",
            sizeClasses[size],
            leftIcon && (size === "sm" ? "pl-7" : size === "lg" ? "pl-9" : "pl-8"),
            rightIcon && (size === "sm" ? "pr-7" : size === "lg" ? "pr-9" : "pr-8"),
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-2.5 text-gray-secondary flex items-center justify-center shrink-0">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";