import * as React from "react";
import { cn } from "@/lib/utils";

export interface SidePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Controls open visibility state */
  isOpen?: boolean;
  /** Callback fired when clicking the close button */
  onClose?: () => void;
  /** Panel theme mode */
  theme?: "light" | "dark";
  /** Preset positioning on the screen */
  position?: "left" | "right" | "floating" | "none";
  /** Show close button in header */
  showCloseButton?: boolean;
}

const themeClasses: Record<NonNullable<SidePanelProps["theme"]>, string> = {
  light: "bg-card text-card-foreground border-border",
  dark: "bg-navy-950 text-white border-navy-800",
};

const positionClasses: Record<NonNullable<SidePanelProps["position"]>, string> = {
  left: "fixed top-4 left-4 z-40 max-h-[calc(100vh-2rem)]",
  right: "fixed top-4 right-4 z-40 max-h-[calc(100vh-2rem)]",
  floating: "relative max-h-full",
  none: "",
};

export const SidePanel = React.forwardRef<HTMLDivElement, SidePanelProps>(
  (
    {
      className,
      isOpen = true,
      onClose,
      theme = "light",
      position = "floating",
      showCloseButton = true,
      children,
      ...props
    },
    ref
  ) => {
    if (!isOpen) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "w-[484px] max-w-[calc(100vw-2rem)] rounded-panel border shadow-float flex flex-col overflow-hidden transition-all duration-200 font-sans",
          themeClasses[theme],
          positionClasses[position],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SidePanel.displayName = "SidePanel";

export interface SidePanelHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  onClose?: () => void;
  showCloseButton?: boolean;
}

export const SidePanelHeader = React.forwardRef<
  HTMLDivElement,
  SidePanelHeaderProps
>(({ className, onClose, showCloseButton = true, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-between p-5 pb-4 border-b border-inherit",
      className
    )}
    {...props}
  >
    <div className="flex-1 pr-4">{children}</div>
    {showCloseButton && onClose && (
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar painel"
        className="p-1.5 rounded-lg text-gray-secondary hover:text-foreground hover:bg-muted transition-colors shrink-0"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    )}
  </div>
));
SidePanelHeader.displayName = "SidePanelHeader";

export interface SidePanelTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

export const SidePanelTitle = React.forwardRef<
  HTMLHeadingElement,
  SidePanelTitleProps
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "font-sans text-lg font-bold leading-tight tracking-tight text-inherit",
      className
    )}
    {...props}
  />
));
SidePanelTitle.displayName = "SidePanelTitle";

export interface SidePanelDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export const SidePanelDescription = React.forwardRef<
  HTMLParagraphElement,
  SidePanelDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("font-sans text-xs text-gray-secondary mt-1", className)}
    {...props}
  />
));
SidePanelDescription.displayName = "SidePanelDescription";

export interface SidePanelContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const SidePanelContent = React.forwardRef<
  HTMLDivElement,
  SidePanelContentProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-5 overflow-y-auto flex-1 space-y-4", className)}
    {...props}
  />
));
SidePanelContent.displayName = "SidePanelContent";

export interface SidePanelFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const SidePanelFooter = React.forwardRef<
  HTMLDivElement,
  SidePanelFooterProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-end gap-2 p-5 pt-4 border-t border-inherit mt-auto",
      className
    )}
    {...props}
  />
));
SidePanelFooter.displayName = "SidePanelFooter";