import * as React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  /** Checked state when controlled */
  checked?: boolean;
  /** Initial checked state when uncontrolled */
  defaultChecked?: boolean;
  /** Callback fired when switch state toggles */
  onCheckedChange?: (checked: boolean) => void;
  /** Switch size scale */
  size?: "sm" | "default";
  /** Track fill style when active: primary purple or soft lilac */
  activeColor?: "primary" | "lilac";
  /** Clickable label rendered next to the switch */
  label?: React.ReactNode;
  /** Supporting text rendered below the label */
  description?: React.ReactNode;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      className,
      checked: controlledChecked,
      defaultChecked = false,
      onCheckedChange,
      size = "default",
      activeColor = "primary",
      label,
      description,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const switchId = id || generatedId;

    const [uncontrolledChecked, setUncontrolledChecked] = React.useState(defaultChecked);
    const isControlled = controlledChecked !== undefined;
    const isChecked = isControlled ? controlledChecked : uncontrolledChecked;

    const handleToggle = () => {
      if (disabled) return;
      const nextChecked = !isChecked;
      if (!isControlled) {
        setUncontrolledChecked(nextChecked);
      }
      onCheckedChange?.(nextChecked);
    };

    const isSmall = size === "sm";

    return (
      <div
        className={cn(
          "inline-flex items-start gap-2.5 select-none",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        <button
          ref={ref}
          type="button"
          role="switch"
          id={switchId}
          aria-checked={isChecked}
          disabled={disabled}
          onClick={handleToggle}
          className={cn(
            "relative inline-flex shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-1",
            "disabled:cursor-not-allowed",
            isSmall ? "h-4 w-7" : "h-5 w-9",
            isChecked
              ? activeColor === "primary"
                ? "bg-primary"
                : "bg-lilac-50 border border-primary/30"
              : "bg-gray-200"
          )}
          {...props}
        >
          <span
            className={cn(
              "pointer-events-none inline-block rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out transform",
              isSmall ? "h-3 w-3" : "h-4 w-4",
              isChecked
                ? isSmall
                  ? "translate-x-3"
                  : "translate-x-4"
                : "translate-x-0"
            )}
          />
        </button>

        {(label || description) && (
          <label
            htmlFor={switchId}
            className="flex flex-col text-xs leading-tight cursor-pointer"
          >
            {label && <span className="font-medium text-foreground">{label}</span>}
            {description && (
              <span className="text-gray-secondary mt-0.5">{description}</span>
            )}
          </label>
        )}
      </div>
    );
  }
);

Switch.displayName = "Switch";