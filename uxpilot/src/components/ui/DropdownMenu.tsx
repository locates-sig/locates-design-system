import * as React from "react";
import { cn } from "@/lib/utils";

export interface DropdownMenuItemData {
  /** Unique key or identifier for the item */
  id: string;
  /** Display label */
  label: React.ReactNode;
  /** Optional icon rendered before the label */
  icon?: React.ReactNode;
  /** Optional keyboard shortcut hint or subtext */
  shortcut?: string;
  /** Disables click and interaction */
  disabled?: boolean;
  /** Applies destructive styling (red text, danger-soft hover) */
  destructive?: boolean;
  /** Marks the item as selected */
  selected?: boolean;
  /** Callback triggered when item is clicked */
  onClick?: () => void;
}

export interface DropdownMenuProps {
  /** Trigger element that toggles the dropdown */
  trigger: React.ReactNode;
  /** Array of menu items (alternative to compound children) */
  items?: DropdownMenuItemData[];
  /** Controlled open state */
  open?: boolean;
  /** Callback fired when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Alignment of the popover menu relative to trigger */
  align?: "start" | "center" | "end";
  /** Width mode of the menu */
  width?: "auto" | "trigger" | "sm" | "md" | "lg";
  /** Optional custom class name for the menu container */
  className?: string;
  /** Custom content rendered inside the dropdown popover */
  children?: React.ReactNode;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  items,
  open: controlledOpen,
  onOpenChange,
  align = "start",
  width = "auto",
  className,
  children,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const [highlightedIndex, setHighlightedIndex] = React.useState<number>(-1);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  const containerRef = React.useRef<HTMLDivElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const setOpen = (value: boolean) => {
    if (!isControlled) setUncontrolledOpen(value);
    onOpenChange?.(value);
  };

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setOpen(true);
        setHighlightedIndex(0);
      }
      return;
    }

    if (e.key === "Escape" || e.key === "Tab") {
      setOpen(false);
      return;
    }

    if (items && items.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % items.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev - 1 + items.length) % items.length);
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < items.length) {
          const item = items[highlightedIndex];
          if (!item.disabled) {
            item.onClick?.();
            setOpen(false);
          }
        }
      }
    }
  };

  const alignClasses = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  };

  const widthClasses = {
    auto: "min-w-[12rem] w-max",
    trigger: "w-full",
    sm: "w-44",
    md: "w-56",
    lg: "w-64",
  };

  return (
    <div
      ref={containerRef}
      className="relative inline-block text-left"
      onKeyDown={handleKeyDown}
    >
      <div
        role="button"
        tabIndex={0}
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => setOpen(!isOpen)}
        className="inline-flex items-center justify-center cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 rounded-lg"
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          ref={menuRef}
          role="menu"
          tabIndex={-1}
          className={cn(
            "absolute z-50 mt-1 rounded-md border border-border bg-popover text-popover-foreground shadow-md p-1 outline-none animate-in fade-in-80 duration-150",
            alignClasses[align],
            widthClasses[width],
            className
          )}
        >
          {children ? (
            children
          ) : items ? (
            items.map((item, index) => {
              const isHighlighted = index === highlightedIndex;
              return (
                <div
                  key={item.id}
                  role="menuitem"
                  aria-disabled={item.disabled}
                  tabIndex={-1}
                  onClick={() => {
                    if (item.disabled) return;
                    item.onClick?.();
                    setOpen(false);
                  }}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={cn(
                    "flex items-center justify-between gap-2 px-2.5 py-1.5 text-sm rounded-md cursor-pointer transition-colors duration-150 select-none",
                    item.disabled && "opacity-50 cursor-not-allowed pointer-events-none",
                    item.destructive &&
                      "text-destructive hover:bg-destructive-soft hover:text-destructive focus:bg-destructive-soft",
                    !item.destructive && item.selected && "bg-primary-light text-primary font-semibold",
                    !item.destructive && !item.selected && isHighlighted && "bg-lilac-highlight text-foreground",
                    !item.destructive && !item.selected && !isHighlighted && "text-foreground hover:bg-lilac-50"
                  )}
                >
                  <div className="flex items-center gap-2 truncate">
                    {item.icon && <span className="shrink-0 text-gray-secondary">{item.icon}</span>}
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.shortcut && (
                    <span className="text-xs text-gray-secondary font-mono ml-auto shrink-0">
                      {item.shortcut}
                    </span>
                  )}
                </div>
              );
            })
          ) : null}
        </div>
      )}
    </div>
  );
};

/* Compound Components for Custom Layouts */

export interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  destructive?: boolean;
  selected?: boolean;
  icon?: React.ReactNode;
  shortcut?: string;
}

export const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({
  className,
  disabled,
  destructive,
  selected,
  icon,
  shortcut,
  children,
  onClick,
  ...props
}) => {
  return (
    <div
      role="menuitem"
      aria-disabled={disabled}
      onClick={(e) => {
        if (disabled) return;
        onClick?.(e);
      }}
      className={cn(
        "flex items-center justify-between gap-2 px-2.5 py-1.5 text-sm rounded-md cursor-pointer transition-colors duration-150 select-none",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        destructive &&
          "text-destructive hover:bg-destructive-soft hover:text-destructive focus:bg-destructive-soft",
        !destructive && selected && "bg-primary-light text-primary font-semibold",
        !destructive && !selected && "text-foreground hover:bg-lilac-50 focus:bg-lilac-highlight",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2 truncate">
        {icon && <span className="shrink-0 text-gray-secondary">{icon}</span>}
        <span className="truncate">{children}</span>
      </div>
      {shortcut && (
        <span className="text-xs text-gray-secondary font-mono ml-auto shrink-0">
          {shortcut}
        </span>
      )}
    </div>
  );
};

export const DropdownMenuSeparator: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div className={cn("h-px my-1 -mx-1 bg-border", className)} {...props} />
);

export const DropdownMenuHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={cn(
      "px-2.5 py-1 text-xs font-semibold text-gray-secondary uppercase tracking-wider select-none",
      className
    )}
    {...props}
  >
    {children}
  </div>
);