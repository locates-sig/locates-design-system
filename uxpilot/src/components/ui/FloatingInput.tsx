import * as React from "react";
import { cn } from "@/lib/utils";

export interface FloatingInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Field label that floats above the input when focused or populated */
  label: string;
  /** Error message displayed below the 2px underline track */
  error?: string;
  /** Optional action or icon element rendered on the right side */
  rightElement?: React.ReactNode;
}

export const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  (
    {
      className,
      id,
      label,
      error,
      rightElement,
      type = "text",
      value,
      defaultValue,
      onChange,
      placeholder = " ",
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const [showPassword, setShowPassword] = React.useState(false);

    const isPassword = type === "password";
    const actualType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className={cn("flex flex-col w-full group", className)}>
        <div className="relative flex items-center gap-2 h-12 w-full">
          <input
            ref={ref}
            id={inputId}
            type={actualType}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder || " "}
            className={cn(
              "peer w-full h-full border-0 bg-transparent pt-5 pb-1 text-sm font-sans text-foreground placeholder-transparent focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            )}
            {...props}
          />
          <label
            htmlFor={inputId}
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 font-sans text-sm font-medium text-gray-secondary pointer-events-none transition-all duration-150",
              "peer-focus:top-1 peer-focus:translate-y-0 peer-focus:text-micro-11 peer-focus:leading-none",
              "peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-micro-11 peer-[:not(:placeholder-shown)]:leading-none",
              "xl:peer-focus:text-xs xl:peer-[:not(:placeholder-shown)]:text-xs"
            )}
          >
            {label}
          </label>
          {isPassword ? (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              className="p-1 text-gray-secondary hover:text-primary transition-colors focus:outline-none shrink-0"
            >
              {showPassword ? (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          ) : rightElement ? (
            <div className="shrink-0 text-gray-secondary">{rightElement}</div>
          ) : null}
        </div>
        <div
          className={cn(
            "h-[2px] w-full transition-colors duration-150",
            error
              ? "bg-destructive"
              : "bg-gray-border group-focus-within:bg-primary"
          )}
        />
        {error && <span className="mt-1.5 text-xs text-destructive">{error}</span>}
      </div>
    );
  }
);

FloatingInput.displayName = "FloatingInput";