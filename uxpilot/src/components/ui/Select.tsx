import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  /** Unique value identifier */
  value: string;
  /** Display label for the option */
  label: string;
  /** Disables option interaction */
  disabled?: boolean;
  /** Applies red destructive text & soft red hover styling */
  destructive?: boolean;
}

export interface SelectProps {
  /** Array of selectable option objects */
  options: SelectOption[];
  /** Selected value when controlled */
  value?: string;
  /** Initial selected value when uncontrolled */
  defaultValue?: string;
  /** Callback fired when a new value is selected */
  onValueChange?: (value: string) => void;
  /** Placeholder text when no option is chosen */
  placeholder?: string;
  /** Disables the dropdown trigger */
  disabled?: boolean;
  /** Displays red error border */
  error?: boolean;
  /** Select height scale */
  size?: "sm" | "default" | "lg";
  /** Additional container styles */
  className?: string;
  /** Element ID */
  id?: string;
}

const sizeClasses: Record<NonNullable<SelectProps["size"]>, string> = {
  sm: "h-7 px-2.5 text-xs rounded-md",
  default: "h-8 px-3 text-sm rounded-md",
  lg: "h-9 px-3.5 text-sm rounded-lg",
};

export const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      options = [],
      value: controlledValue,
      defaultValue,
      onValueChange,
      placeholder = "Selecione uma opção...",
      disabled = false,
      error = false,
      size = "default",
      className,
      id,
    },
    ref
  ) => {
    const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue || "");
    const [isOpen, setIsOpen] = React.useState(false);
    const [highlightedIndex, setHighlightedIndex] = React.useState<number>(-1);

    const isControlled = controlledValue !== undefined;
    const selectedValue = isControlled ? controlledValue : uncontrolledValue;

    const containerRef = React.useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === selectedValue);

    React.useEffect(() => {
      const handleOutsideClick = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleOutsideClick);
      return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    const handleSelect = (option: SelectOption) => {
      if (option.disabled) return;
      if (!isControlled) {
        setUncontrolledValue(option.value);
      }
      onValueChange?.(option.value);
      setIsOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setHighlightedIndex(0);
        } else {
          setHighlightedIndex((prev) => (prev + 1) % options.length);
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setHighlightedIndex(options.length - 1);
        } else {
          setHighlightedIndex((prev) => (prev - 1 + options.length) % options.length);
        }
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else if (highlightedIndex >= 0 && highlightedIndex < options.length) {
          handleSelect(options[highlightedIndex]);
        }
      } else if (e.key === "Escape" || e.key === "Tab") {
        setIsOpen(false);
      }
    };

    return (
      <div ref={containerRef} className={cn("relative w-full", className)}>
        <button
          ref={ref}
          id={id}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
          onKeyDown={handleKeyDown}
          className={cn(
            "flex items-center justify-between w-full border bg-card text-foreground font-sans transition-colors duration-150 select-none",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100",
            error
              ? "border-destructive focus-visible:ring-destructive/50"
              : "border-input",
            sizeClasses[size]
          )}
        >
          <span
            className={cn(
              "truncate",
              !selectedOption && "text-gray-secondary font-normal"
            )}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg
            className={cn(
              "w-4 h-4 text-gray-secondary shrink-0 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div
            role="listbox"
            tabIndex={-1}
            className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover text-popover-foreground shadow-md p-1 max-h-60 overflow-y-auto custom-scrollbar"
          >
            {options.length === 0 ? (
              <div className="px-3 py-2 text-xs text-gray-secondary text-center">
                Nenhuma opção disponível
              </div>
            ) : (
              options.map((option, idx) => {
                const isSelected = option.value === selectedValue;
                const isHighlighted = idx === highlightedIndex;

                return (
                  <div
                    key={option.value}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(option)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={cn(
                      "flex items-center justify-between px-2.5 py-1.5 text-sm rounded-md cursor-pointer transition-colors duration-150 select-none",
                      option.disabled && "opacity-50 cursor-not-allowed pointer-events-none",
                      option.destructive &&
                        "text-destructive hover:bg-destructive-soft hover:text-destructive",
                      !option.destructive &&
                        isSelected &&
                        "bg-primary-light text-primary font-semibold",
                      !option.destructive &&
                        !isSelected &&
                        isHighlighted &&
                        "bg-lilac-highlight text-foreground",
                      !option.destructive &&
                        !isSelected &&
                        !isHighlighted &&
                        "text-foreground hover:bg-lilac-50"
                    )}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected && (
                      <svg
                        className="w-4 h-4 text-primary shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";