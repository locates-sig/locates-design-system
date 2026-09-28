import * as React from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  /** Checked state when controlled */
  checked?: boolean;
  /** Initial checked state when uncontrolled */
  defaultChecked?: boolean;
  /** Callback fired when checked state changes */
  onCheckedChange?: (checked: boolean) => void;
  /** Indeterminate state for parent multi-select options */
  indeterminate?: boolean;
  /** Clickable label text or custom node */
  label?: React.ReactNode;
  /** Supporting description text displayed below the label */
  description?: React.ReactNode;
  /** Highlights border in red for validation errors */
  error?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      checked: controlledChecked,
      defaultChecked = false,
      onCheckedChange,
      indeterminate = false,
      label,
      description,
      error = false,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const checkboxId = id || generatedId;

    const [uncontrolledChecked, setUncontrolledChecked] = React.useState(defaultChecked);
    const isControlled = controlledChecked !== undefined;
    const isChecked = isControlled ? controlledChecked : uncontrolledChecked;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      const nextChecked = e.target.checked;
      if (!isControlled) {
        setUncontrolledChecked(nextChecked);
      }
      onCheckedChange?.(nextChecked);
    };

    return (
      <label
        htmlFor={checkboxId}
        className={cn(
          "inline-flex items-start gap-2 select-none cursor-pointer group",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
      >
        <div className="relative flex items-center justify-center shrink-0 mt-0.5">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            checked={isChecked}
            disabled={disabled}
            onChange={handleChange}
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              "h-4 w-4 rounded-xs border transition-all duration-150 flex items-center justify-center bg-card text-primary-foreground",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-primary/50 peer-focus-visible:ring-offset-1",
              error ? "border-destructive" : "border-input group-hover:border-primary/60",
              (isChecked || indeterminate) &&
                "bg-primary border-primary group-hover:bg-primary-dark group-hover:border-primary-dark"
            )}
          >
            {indeterminate ? (
              <svg
                className="w-3 h-3 stroke-[3]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
              </svg>
            ) : isChecked ? (
              <svg
                className="w-3 h-3 stroke-[3]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" />
              </svg>
            ) : null}
          </div>
        </div>
        {(label || description) && (
          <div className="flex flex-col text-xs leading-tight">
            {label && (
              <span
                className={cn(
                  "font-medium text-foreground transition-colors",
                  error && "text-destructive"
                )}
              >
                {label}
              </span>
            )}
            {description && (
              <span className="text-gray-secondary mt-0.5">{description}</span>
            )}
          </div>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";