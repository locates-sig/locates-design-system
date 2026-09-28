import * as React from "react";
import { cn } from "@/lib/utils";

export interface SidebarItemData {
  /** Unique item identifier */
  id: string;
  /** Label for the item */
  label: string;
  /** Icon element */
  icon?: React.ReactNode;
  /** Link href */
  href?: string;
  /** Active state */
  active?: boolean;
  /** Optional badge content */
  badge?: React.ReactNode;
  /** Group title or category under which this item falls */
  group?: string;
  /** Click handler */
  onClick?: () => void;
}

export interface SidebarProps extends Omit<React.HTMLAttributes<HTMLElement>, "onSelect"> {
  /** Navigation items list */
  items?: SidebarItemData[];
  /** Controlled active item ID */
  activeId?: string;
  /** Controlled collapsed state */
  collapsed?: boolean;
  /** Default collapsed state for uncontrolled use */
  defaultCollapsed?: boolean;
  /** Callback fired when collapsed state changes */
  onCollapseChange?: (collapsed: boolean) => void;
  /** Custom header element rendered at top */
  header?: React.ReactNode;
  /** Custom footer element rendered at bottom */
  footer?: React.ReactNode;
  /** Callback when an item is selected */
  onSelect?: (item: SidebarItemData) => void;
  /** Container style overrides */
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items = [],
  activeId,
  collapsed: controlledCollapsed,
  defaultCollapsed = false,
  onCollapseChange,
  header,
  footer,
  onSelect,
  className,
  children,
  ...props
}) => {
  const [uncontrolledCollapsed, setUncontrolledCollapsed] = React.useState(defaultCollapsed);

  const isControlled = controlledCollapsed !== undefined;
  const isCollapsed = isControlled ? controlledCollapsed : uncontrolledCollapsed;

  const toggleCollapse = () => {
    const nextState = !isCollapsed;
    if (!isControlled) {
      setUncontrolledCollapsed(nextState);
    }
    onCollapseChange?.(nextState);
  };

  // Group items by item.group if present
  const groupedItems = React.useMemo(() => {
    const groups: { [key: string]: SidebarItemData[] } = {};
    items.forEach((item) => {
      const groupName = item.group || "main";
      if (!groups[groupName]) groups[groupName] = [];
      groups[groupName].push(item);
    });
    return groups;
  }, [items]);

  return (
    <aside
      className={cn(
        "bg-sidebar border-r border-sidebar-border text-sidebar-foreground flex flex-col justify-between transition-all duration-200 ease-out select-none shrink-0 h-full min-h-screen",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
      {...props}
    >
      {/* Top Header & Navigation */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Header slot */}
        <div className="h-[72px] px-4 flex items-center justify-between border-b border-sidebar-border shrink-0">
          {!isCollapsed && (header || <span className="font-bold text-primary text-lg">Locates</span>)}
          <button
            type="button"
            onClick={toggleCollapse}
            aria-label={isCollapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
            className={cn(
              "p-1.5 rounded-lg text-gray-secondary hover:text-foreground hover:bg-lilac-50 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              isCollapsed && "mx-auto"
            )}
          >
            <svg
              className={cn("w-5 h-5 transition-transform duration-200", isCollapsed && "rotate-180")}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Navigation body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-4">
          {children ? (
            children
          ) : (
            Object.entries(groupedItems).map(([groupName, groupList]) => (
              <div key={groupName} className="space-y-1">
                {!isCollapsed && groupName !== "main" && (
                  <div className="px-3 py-1 text-[10px] font-semibold tracking-wider text-gray-secondary uppercase">
                    {groupName}
                  </div>
                )}
                {groupList.map((item) => {
                  const isActive = activeId !== undefined ? activeId === item.id : item.active;

                  return (
                    <a
                      key={item.id}
                      href={item.href || "#"}
                      title={isCollapsed ? item.label : undefined}
                      onClick={(e) => {
                        if (item.onClick) {
                          e.preventDefault();
                          item.onClick();
                        } else if (onSelect) {
                          e.preventDefault();
                          onSelect(item);
                        }
                      }}
                      className={cn(
                        "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 group",
                        isActive
                          ? "bg-lilac-50 text-primary font-semibold border-l-4 border-primary pl-2"
                          : "text-gray-secondary hover:text-foreground hover:bg-lilac-50",
                        isCollapsed && "justify-center px-0 border-l-0"
                      )}
                    >
                      {item.icon && (
                        <span
                          className={cn(
                            "shrink-0 transition-colors",
                            isActive ? "text-primary" : "text-gray-secondary group-hover:text-foreground"
                          )}
                        >
                          {item.icon}
                        </span>
                      )}

                      {!isCollapsed && <span className="truncate">{item.label}</span>}

                      {!isCollapsed && item.badge && (
                        <span className="ml-auto px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary font-semibold shrink-0">
                          {item.badge}
                        </span>
                      )}
                    </a>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer slot */}
      {footer && (
        <div className="p-3 border-t border-sidebar-border shrink-0">
          {footer}
        </div>
      )}
    </aside>
  );
};