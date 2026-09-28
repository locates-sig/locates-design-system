import * as React from "react";
import { cn } from "@/lib/utils";

export type AlertVariant = "info" | "success" | "warning" | "destructive" | "error" | "primary";

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Visual variant theme */
  variant?: AlertVariant;
  /** Primary title of the alert banner */
  title?: React.ReactNode;
  /** Detailed message content */
  description?: React.ReactNode;
  /** Custom icon element or boolean flag to toggle default icon */
  icon?: React.ReactNode | boolean;
  /** Callback fired when dismiss button is clicked */
  onClose?: () => void;
  /** Optional action element rendered on the right side */
  action?: React.ReactNode;
}

const variantClasses: Record<AlertVariant, string> = {
  info: "bg-blue-50 border-blue-200 text-blue-800",
  success: "bg-green-50 border-green-200 text-green-800",
  warning: "bg-amber-100 border-amber-300 text-amber-800",
  destructive: "bg-destructive-soft border-destructive/20 text-destructive",
  error: "bg-destructive-soft border-destructive/20 text-destructive",
  primary: "bg-lilac-50 border-primary/20 text-primary",
};

const variantIconColor: Record<AlertVariant, string> = {
  info: "text-blue-700",
  success: "text-green-700",
  warning: "text-amber-700",
  destructive: "text-destructive",
  error: "text-destructive",
  primary: "text-primary",
};

function getDefaultIcon(variant: AlertVariant) {
  const iconColor = variantIconColor[variant];
  switch (variant) {
    case "success":
      return (
        <svg className={cn("h-5 w-5 shrink-0", iconColor)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "warning":
      return (
        <svg className={cn("h-5 w-5 shrink-0", iconColor)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    case "destructive":
    case "error":
      return (
        <svg className={cn("h-5 w-5 shrink-0", iconColor)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      );
    case "primary":
      return (
        <svg className={cn("h-5 w-5 shrink-0", iconColor)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4m0-4h.01" />
        </svg>
      );
    case "info":
    default:
      return (
        <svg className={cn("h-5 w-5 shrink-0", iconColor)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      );
  }
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant = "info",
      title,
      description,
      icon = true,
      onClose,
      action,
      children,
      ...props
    },
    ref
  ) => {
    const renderedIcon =
      typeof icon === "boolean"
        ? icon
          ? getDefaultIcon(variant)
          : null
        : icon;

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "relative flex w-full items-start gap-3 rounded-lg border p-3.5 text-xs transition-colors duration-150",
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {renderedIcon}
        <div className="flex-1 min-w-0">
          {title && <AlertTitle>{title}</AlertTitle>}
          {description && <AlertDescription>{description}</AlertDescription>}
          {children}
        </div>
        {action && <div className="shrink-0 flex items-center gap-2">{action}</div>}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-md p-0.5 opacity-70 hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Fechar alerta"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = "Alert";

export const AlertTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("font-semibold text-sm leading-tight mb-0.5 tracking-tight", className)}
    {...props}
  >
    {children}
  </h5>
));

AlertTitle.displayName = "AlertTitle";

export const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-xs leading-relaxed opacity-90", className)}
    {...props}
  >
    {children}
  </div>
));

AlertDescription.displayName = "AlertDescription";