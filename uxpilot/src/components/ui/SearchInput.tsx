import * as React from "react";
import { cn } from "@/lib/utils";

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Size scale for search input height and padding */
  size?: "sm" | "default" | "lg";
  /** Callback fired when the clear (X) button is clicked */
  onClear?: () => void;
  /** Shows a spinning loading indicator in place of the magnifying glass */
  isLoading?: boolean;
}

const sizeClasses: Record<NonNullable<SearchInputProps["size"]>, string> = {
  sm: "h-7 pl-7 pr-7 text-xs rounded-md",
  default: "h-8 pl-8 pr-8 text-sm rounded-md",
  lg: "h-9 pl-9 pr-9 text-sm rounded-lg",
};

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      className,
      size = "default",
      value: controlledValue,
      defaultValue,
      onChange,
      onClear,
      isLoading = false,
      placeholder = "Buscar...",
      disabled,
      ...props
    },
    ref
  ) => {
    const [uncontrolledValue, setUncontrolledValue] = React.useState(
      defaultValue || ""
    );
    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? controlledValue : uncontrolledValue;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setUncontrolledValue(e.target.value);
      }
      onChange?.(e);
    };

    const handleClear = () => {
      if (!isControlled) {
        setUncontrolledValue("");
      }
      onClear?.();
    };

    const hasValue = String(currentValue ?? "").length > 0;

    return (
      <div className="relative flex items-center w-full">
        <div className="absolute left-2.5 text-gray-secondary pointer-events-none flex items-center justify-center shrink-0">
          {isLoading ? (
            <svg
              className="animate-spin h-3.5 w-3.5 text-primary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
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
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          )}
        </div>

        <input
          ref={ref}
          type="text"
          value={currentValue}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder}
          className={cn(
            "w-full border border-input bg-card text-foreground font-sans placeholder:text-gray-secondary transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100",
            sizeClasses[size],
            className
          )}
          {...props}
        />

        {hasValue && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Limpar busca"
            className="absolute right-2 text-gray-secondary hover:text-foreground transition-colors p-0.5 rounded-xs focus:outline-none shrink-0"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";