import * as React from "react";
import { cn } from "@/lib/utils";

export interface HeaderNavItem {
  /** Unique key or identifier */
  id: string;
  /** Navigation item label */
  label: string;
  /** Link URL or route */
  href?: string;
  /** Icon rendered before the label */
  icon?: React.ReactNode;
  /** Whether this item is currently active */
  active?: boolean;
  /** Optional badge content (e.g. counter or status tag) */
  badge?: React.ReactNode;
  /** Click callback */
  onClick?: () => void;
}

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  /** Logo slot or custom element rendered on the left */
  logo?: React.ReactNode;
  /** Navigation links rendered in the center section */
  navItems?: HeaderNavItem[];
  /** Controlled active navigation item ID */
  activeId?: string;
  /** Callback fired when a navigation link is clicked */
  onNavSelect?: (item: HeaderNavItem) => void;
  /** Action elements rendered on the right side before user menu */
  actions?: React.ReactNode;
  /** User menu slot or user profile details */
  user?: {
    name: string;
    role?: string;
    avatarUrl?: string;
    onClick?: () => void;
  } | React.ReactNode;
  /** Additional container styling */
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  logo,
  navItems = [],
  activeId,
  onNavSelect,
  actions,
  user,
  className,
  children,
  ...props
}) => {
  const defaultLogo = (
    <div className="flex items-center gap-2.5 font-bold text-lg text-primary tracking-tight select-none">
      <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-base shadow-sm ring-2 ring-green-500/30">
        L
      </div>
      <span className="font-sans text-foreground">Locates</span>
    </div>
  );

  return (
    <header
      className={cn(
        "h-[72px] bg-card border-b border-border text-foreground px-4 md:px-6 flex items-center justify-between sticky top-0 z-40 w-full shrink-0 select-none",
        className
      )}
      {...props}
    >
      {/* Left section: Logo */}
      <div className="flex items-center gap-6 shrink-0">
        {logo ?? defaultLogo}
      </div>

      {/* Middle section: Main Navigation or custom children */}
      {children ? (
        <div className="flex items-center gap-2 mx-4 overflow-x-auto custom-scrollbar">
          {children}
        </div>
      ) : navItems.length > 0 ? (
        <nav className="hidden md:flex items-center gap-1 mx-4 overflow-x-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = activeId !== undefined ? activeId === item.id : item.active;
            return (
              <a
                key={item.id}
                href={item.href || "#"}
                onClick={(e) => {
                  if (item.onClick) {
                    e.preventDefault();
                    item.onClick();
                  } else if (onNavSelect) {
                    e.preventDefault();
                    onNavSelect(item);
                  }
                }}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 whitespace-nowrap",
                  isActive
                    ? "bg-lilac-50 text-primary font-semibold"
                    : "text-gray-secondary hover:text-foreground hover:bg-lilac-50"
                )}
              >
                {item.icon && <span className="shrink-0">{item.icon}</span>}
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-primary/10 text-primary font-semibold">
                    {item.badge}
                  </span>
                )}
              </a>
            );
          })}
        </nav>
      ) : null}

      {/* Right section: Extra Actions & User Menu */}
      <div className="flex items-center gap-3 shrink-0 ml-auto">
        {actions && <div className="flex items-center gap-2">{actions}</div>}

        {user && (
          <div className="flex items-center pl-2 border-l border-border">
            {React.isValidElement(user) ? (
              user
            ) : typeof user === "object" && "name" in user ? (
              <button
                type="button"
                onClick={user.onClick}
                className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-lilac-50 transition-colors duration-150 text-left outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-border shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-secondary text-primary font-semibold flex items-center justify-center text-xs shrink-0 border border-border">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="hidden lg:block text-xs">
                  <p className="font-semibold text-foreground leading-tight">{user.name}</p>
                  {user.role && <p className="text-gray-secondary text-[11px]">{user.role}</p>}
                </div>
              </button>
            ) : null}
          </div>
        )}
      </div>
    </header>
  );
};