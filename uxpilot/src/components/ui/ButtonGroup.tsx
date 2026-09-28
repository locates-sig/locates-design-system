import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual group style variant */
  variant?: "attached" | "segmented" | "spaced";
  /** Layout orientation */
  orientation?: "horizontal" | "vertical";
  /** Size passed to buttons inside the group when using context */
  size?: "xs" | "sm" | "default" | "lg";
  /** Children elements (buttons or custom components) */
  children: React.ReactNode;
}

const variantLayoutClasses = {
  attached: {
    horizontal:
      "inline-flex items-center -space-x-px rounded-lg shadow-sm [&>button:not(:first-child):not(:last-child)]:rounded-none [&>button:first-child]:rounded-r-none [&>button:last-child]:rounded-l-none [&>button]:focus-visible:z-10 [&>button]:hover:z-10",
    vertical:
      "inline-flex flex-col -space-y-px rounded-lg shadow-sm [&>button:not(:first-child):not(:last-child)]:rounded-none [&>button:first-child]:rounded-b-none [&>button:last-child]:rounded-t-none [&>button]:focus-visible:z-10 [&>button]:hover:z-10",
  },
  segmented: {
    horizontal: "inline-flex items-center p-1 bg-muted rounded-lg gap-1",
    vertical: "inline-flex flex-col p-1 bg-muted rounded-lg gap-1",
  },
  spaced: {
    horizontal: "inline-flex items-center gap-2",
    vertical: "inline-flex flex-col gap-2",
  },
};

export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  (
    {
      variant = "attached",
      orientation = "horizontal",
      size,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        role="group"
        className={cn(
          variantLayoutClasses[variant][orientation],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ButtonGroup.displayName = "ButtonGroup";