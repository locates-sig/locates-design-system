import * as React from "react";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "./Button";

export interface IconButtonProps
  extends Omit<ButtonProps, "leftIcon" | "rightIcon" | "fullWidth" | "size"> {
  /** Accessible label for screen readers */
  label: string;
  /** The icon component or element to render */
  icon?: React.ReactNode;
  /** Size scale corresponding to square dimensions */
  size?: "xs" | "sm" | "default" | "lg";
  /** Shape variant */
  shape?: "square" | "circle";
}

const sizeClasses: Record<NonNullable<IconButtonProps["size"]>, string> = {
  xs: "h-6 w-6 text-xs p-0",
  sm: "h-7 w-7 text-xs p-0",
  default: "h-8 w-8 text-sm p-0",
  lg: "h-9 w-9 text-sm p-0",
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      label,
      icon,
      children,
      variant = "ghost",
      size = "default",
      shape = "square",
      className,
      ...props
    },
    ref
  ) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        size="icon"
        aria-label={label}
        className={cn(
          sizeClasses[size],
          shape === "circle" && "rounded-full",
          className
        )}
        {...props}
      >
        {icon || children}
      </Button>
    );
  }
);

IconButton.displayName = "IconButton";