import * as React from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  /** Unique value identifier for the tab */
  id: string;
  /** Display label */
  label: React.ReactNode;
  /** Optional icon displayed before label */
  icon?: React.ReactNode;
  /** Optional badge content (e.g. counter) */
  badge?: React.ReactNode;
  /** Disables tab interaction */
  disabled?: boolean;
  /** Panel content rendered when tab is active */
  content?: React.ReactNode;
}

export interface TabsProps {
  /** List of tab items (alternative to compound components) */
  items?: TabItem[];
  /** Controlled active tab value */
  value?: string;
  /** Default active tab value when uncontrolled */
  defaultValue?: string;
  /** Callback fired when selected tab changes */
  onValueChange?: (value: string) => void;
  /** Visual presentation style */
  variant?: "line" | "pill" | "segmented";
  /** Size scale for tab triggers */
  size?: "sm" | "default" | "lg";
  /** Stretches tabs to fill container width */
  fullWidth?: boolean;
  /** Additional container classes */
  className?: string;
  /** Custom compound children (TabsList, TabsContent) */
  children?: React.ReactNode;
}

interface TabsContextValue {
  value: string;
  onValueChange: (val: string) => void;
  variant: "line" | "pill" | "segmented";
  size: "sm" | "default" | "lg";
  fullWidth: boolean;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

export const Tabs: React.FC<TabsProps> = ({
  items,
  value: controlledValue,
  defaultValue,
  onValueChange,
  variant = "line",
  size = "default",
  fullWidth = false,
  className,
  children,
}) => {
  const initialValue = defaultValue || (items && items.length > 0 ? items[0].id : "");
  const [uncontrolledValue, setUncontrolledValue] = React.useState(initialValue);

  const isControlled = controlledValue !== undefined;
  const activeValue = isControlled ? controlledValue : uncontrolledValue;

  const handleSelect = (val: string) => {
    if (!isControlled) {
      setUncontrolledValue(val);
    }
    onValueChange?.(val);
  };

  const contextValue = React.useMemo(
    () => ({
      value: activeValue,
      onValueChange: handleSelect,
      variant,
      size,
      fullWidth,
    }),
    [activeValue, variant, size, fullWidth]
  );

  const activeItem = items?.find((item) => item.id === activeValue);

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={cn("w-full space-y-3", className)}>
        {children ? (
          children
        ) : items ? (
          <>
            <TabsList variant={variant} size={size} fullWidth={fullWidth}>
              {items.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  disabled={tab.disabled}
                  icon={tab.icon}
                  badge={tab.badge}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {activeItem?.content && (
              <div role="tabpanel" tabIndex={0} className="pt-2 outline-none">
                {activeItem.content}
              </div>
            )}
          </>
        ) : null}
      </div>
    </TabsContext.Provider>
  );
};

/* Compound Components */

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "line" | "pill" | "segmented";
  size?: "sm" | "default" | "lg";
  fullWidth?: boolean;
}

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, variant: propVariant, size: propSize, fullWidth: propFullWidth, children, ...props }, ref) => {
    const ctx = React.useContext(TabsContext);
    const variant = propVariant || ctx?.variant || "line";
    const fullWidth = propFullWidth ?? ctx?.fullWidth ?? false;

    const listContainerClasses = {
      line: "flex items-center gap-2 border-b border-border overflow-x-auto custom-scrollbar",
      pill: "inline-flex items-center gap-1 p-1 rounded-xl bg-muted/60 overflow-x-auto custom-scrollbar",
      segmented: "inline-flex items-center gap-1 p-1 rounded-xl bg-gray-100 overflow-x-auto custom-scrollbar",
    };

    return (
      <div
        ref={ref}
        role="tablist"
        className={cn(
          listContainerClasses[variant],
          fullWidth && "w-full justify-stretch",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabsList.displayName = "TabsList";

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, disabled, icon, badge, children, onClick, ...props }, ref) => {
    const ctx = React.useContext(TabsContext);
    const isSelected = ctx?.value === value;
    const variant = ctx?.variant || "line";
    const size = ctx?.size || "default";
    const fullWidth = ctx?.fullWidth || false;

    const sizeClasses = {
      sm: "text-xs px-2.5 py-1 gap-1.5",
      default: "text-sm px-3.5 py-1.5 gap-2",
      lg: "text-base px-4 py-2 gap-2.5",
    };

    const variantStyles = {
      line: cn(
        "border-b-2 font-medium transition-colors duration-150 -mb-px select-none",
        isSelected
          ? "border-primary text-primary font-semibold"
          : "border-transparent text-gray-secondary hover:text-foreground hover:border-gray-300"
      ),
      pill: cn(
        "rounded-lg font-medium transition-all duration-150 select-none",
        isSelected
          ? "bg-primary text-primary-foreground font-semibold shadow-sm"
          : "text-gray-secondary hover:text-foreground hover:bg-lilac-50"
      ),
      segmented: cn(
        "rounded-lg font-medium transition-all duration-150 select-none",
        isSelected
          ? "bg-card text-foreground font-semibold shadow-sm"
          : "text-gray-secondary hover:text-foreground"
      ),
    };

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={isSelected}
        disabled={disabled}
        onClick={(e) => {
          if (disabled) return;
          ctx?.onValueChange(value);
          onClick?.(e);
        }}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed",
          sizeClasses[size],
          variantStyles[variant],
          fullWidth && "flex-1",
          className
        )}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        <span>{children}</span>
        {badge && (
          <span
            className={cn(
              "ml-1 px-1.5 py-0.5 text-xs rounded-full font-semibold shrink-0",
              isSelected && variant === "pill"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-primary/10 text-primary"
            )}
          >
            {badge}
          </span>
        )}
      </button>
    );
  }
);
TabsTrigger.displayName = "TabsTrigger";

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, children, ...props }, ref) => {
    const ctx = React.useContext(TabsContext);
    const isSelected = ctx?.value === value;

    if (!isSelected) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        tabIndex={0}
        className={cn("pt-2 outline-none animate-in fade-in-50 duration-150", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabsContent.displayName = "TabsContent";