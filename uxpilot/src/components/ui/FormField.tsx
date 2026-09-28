import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/Label";

export interface FormFieldProps {
  /** Label text rendered above the input control */
  label?: React.ReactNode;
  /** HTML id connecting label to control */
  htmlFor?: string;
  /** Displays a red required asterisk next to label */
  required?: boolean;
  /** Size scale for the field label */
  labelSize?: "micro" | "xs" | "sm" | "default" | "lg";
  /** Validation error message rendered below control */
  error?: string;
  /** Helper text rendered below control when error is absent */
  helperText?: React.ReactNode;
  /** Additional wrapper classes */
  className?: string;
  /** Form control element (Input, Select, Switch, etc.) */
  children: React.ReactNode;
}

export const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  (
    {
      label,
      htmlFor,
      required = false,
      labelSize = "default",
      error,
      helperText,
      className,
      children,
    },
    ref
  ) => {
    return (
      <div ref={ref} className={cn("flex flex-col gap-1.5 w-full", className)}>
        {label && (
          <Label htmlFor={htmlFor} required={required} size={labelSize}>
            {label}
          </Label>
        )}
        {children}
        {error ? (
          <span className="text-xs font-medium text-destructive">{error}</span>
        ) : helperText ? (
          <span className="text-xs text-gray-secondary">{helperText}</span>
        ) : null}
      </div>
    );
  }
);

FormField.displayName = "FormField";