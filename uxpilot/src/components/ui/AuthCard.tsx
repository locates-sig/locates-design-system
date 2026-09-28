import * as React from "react";
import { cn } from "@/lib/utils";

export interface AuthCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Optional logo element or image rendered above the form title */
  logo?: React.ReactNode;
  /** Card title heading (e.g., "Seja bem-vindo(a)") */
  title?: React.ReactNode;
  /** Card subtitle text (e.g., "Insira suas informações de acesso") */
  subtitle?: React.ReactNode;
  /** Hero image URL for the branded left panel on large displays */
  imageSrc?: string;
  /** Institutional quote or text shown on the branded left panel */
  imageQuote?: React.ReactNode;
  /** Footer content displayed below the card main form body */
  footer?: React.ReactNode;
  /** Optional custom class for the outer split container */
  containerClassName?: string;
  /** Optional custom class for the left branded image panel */
  imagePanelClassName?: string;
}

export const AuthCard = React.forwardRef<HTMLDivElement, AuthCardProps>(
  (
    {
      className,
      containerClassName,
      imagePanelClassName,
      logo,
      title = "Seja bem-vindo(a)",
      subtitle = "Insira suas informações de acesso",
      imageSrc,
      imageQuote = "A Locates é para você que desenvolve, projeta ou investe em real estate",
      footer,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={cn(
          "min-h-screen w-full flex flex-col lg:flex-row bg-background",
          containerClassName
        )}
      >
        {/* Left Branded Art Panel (Visible lg+) */}
        <div
          className={cn(
            "hidden lg:flex lg:w-[35%] xl:w-[40%] bg-navy-950 text-white relative flex-col justify-end p-10 xl:p-14 overflow-hidden bg-cover bg-center",
            imagePanelClassName
          )}
          style={{
            backgroundImage: imageSrc ? `url(${imageSrc})` : undefined,
          }}
        >
          {/* Subtle gradient overlay if background image is present or default fallback */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/60 to-transparent pointer-events-none" />

          {/* Slogan / Quote */}
          {imageQuote && (
            <div className="relative z-10 max-w-[435px]">
              <p className="font-sans font-light text-[28px] xl:text-[30px] leading-[1.25] text-white tracking-tight">
                {imageQuote}
              </p>
            </div>
          )}
        </div>

        {/* Right Main Form Section */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12">
          <div
            ref={ref}
            className={cn(
              "w-full max-w-[565px] bg-card rounded-2xl p-6 sm:p-10 border border-border shadow-xl flex flex-col",
              className
            )}
            {...props}
          >
            {/* Header: Logo, Title & Subtitle */}
            {(logo || title || subtitle) && (
              <div className="mb-6 flex flex-col items-start">
                {logo && <div className="mb-6">{logo}</div>}
                {title && (
                  <h1 className="text-2xl font-bold text-primary tracking-tight font-sans">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="mt-1 text-sm text-gray-secondary font-sans">
                    {subtitle}
                  </p>
                )}
              </div>
            )}

            {/* Main Form Content */}
            <div className="w-full flex-1 flex flex-col gap-5">{children}</div>

            {/* Optional Card Footer */}
            {footer && <div className="mt-6 pt-4 border-t border-border">{footer}</div>}
          </div>
        </div>
      </div>
    );
  }
);

AuthCard.displayName = "AuthCard";