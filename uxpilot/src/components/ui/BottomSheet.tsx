import * as React from "react";
import { cn } from "@/lib/utils";

export interface BottomSheetProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Controls visibility open state */
  isOpen?: boolean;
  /** Callback fired when closing sheet or clicking backdrop */
  onClose?: () => void;
  /** Show dark backdrop overlay behind bottom sheet */
  showOverlay?: boolean;
  /** Whether clicking the backdrop overlay triggers onClose */
  closeOnOverlayClick?: boolean;
  /** Height / Snap point preset */
  snapPoint?: "sm" | "md" | "lg" | "auto" | "full";
}

const snapClasses: Record<NonNullable<BottomSheetProps["snapPoint"]>, string> = {
  sm: "max-h-[30vh]",
  md: "max-h-[50vh]",
  lg: "max-h-[80vh]",
  auto: "max-h-[85vh]",
  full: "h-[92vh]",
};

export const BottomSheet = React.forwardRef<HTMLDivElement, BottomSheetProps>(
  (
    {
      className,
      isOpen = true,
      onClose,
      showOverlay = true,
      closeOnOverlayClick = true,
      snapPoint = "auto",
      children,
      ...props
    },
    ref
  ) => {
    if (!isOpen) return null;

    return (
      <>
        {/* Backdrop overlay */}
        {showOverlay && (
          <div
            className="fixed inset-0 z-40 bg-navy-950/40 backdrop-blur-[1px] transition-opacity duration-200"
            onClick={closeOnOverlayClick ? onClose : undefined}
            aria-hidden="true"
          />
        )}

        {/* Sliding Bottom Sheet Container */}
        <div
          ref={ref}
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 bg-card text-card-foreground rounded-t-2xl border-t border-border shadow-sheet flex flex-col overflow-hidden transition-transform duration-200 ease-out font-sans",
            snapClasses[snapPoint],
            className
          )}
          {...props}
        >
          {/* Drag Handle Indicator */}
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto my-2.5 shrink-0 cursor-grab active:cursor-grabbing" />

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto flex flex-col">{children}</div>
        </div>
      </>
    );
  }
);
BottomSheet.displayName = "BottomSheet";

export interface BottomSheetHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  onClose?: () => void;
  showCloseButton?: boolean;
}

export const BottomSheetHeader = React.forwardRef<
  HTMLDivElement,
  BottomSheetHeaderProps
>(({ className, onClose, showCloseButton = true, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-between px-6 py-2 border-b border-border",
      className
    )}
    {...props}
  >
    <div className="flex-1 pr-4">{children}</div>
    {showCloseButton && onClose && (
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar painel inferior"
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
BottomSheetHeader.displayName = "BottomSheetHeader";

export interface BottomSheetTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

export const BottomSheetTitle = React.forwardRef<
  HTMLHeadingElement,
  BottomSheetTitleProps
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-sans text-base font-bold leading-tight text-foreground tracking-tight",
      className
    )}
    {...props}
  />
));
BottomSheetTitle.displayName = "BottomSheetTitle";

export interface BottomSheetDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export const BottomSheetDescription = React.forwardRef<
  HTMLParagraphElement,
  BottomSheetDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("font-sans text-xs text-gray-secondary mt-0.5", className)}
    {...props}
  />
));
BottomSheetDescription.displayName = "BottomSheetDescription";

export interface BottomSheetContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const BottomSheetContent = React.forwardRef<
  HTMLDivElement,
  BottomSheetContentProps
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 overflow-y-auto space-y-4", className)} {...props} />
));
BottomSheetContent.displayName = "BottomSheetContent";

export interface BottomSheetFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const BottomSheetFooter = React.forwardRef<
  HTMLDivElement,
  BottomSheetFooterProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-end gap-2 px-6 py-4 border-t border-border mt-auto",
      className
    )}
    {...props}
  />
));
BottomSheetFooter.displayName = "BottomSheetFooter";