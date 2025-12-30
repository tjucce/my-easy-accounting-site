import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calculator, 
  Users, 
  FileText, 
  BarChart3, 
  CreditCard, 
  BookOpen,
  Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

// Easy to add new items - just add to this array
const economyNavItems = [
  { name: "Accounting", href: "/economy/accounting", icon: Calculator },
  { name: "Billing", href: "/economy/billing", icon: CreditCard },
  { name: "Salary", href: "/economy/salary", icon: Users },
  { name: "Declaration", href: "/economy/declaration", icon: FileText },
  { name: "Annual Reports", href: "/economy/annual-reports", icon: BarChart3 },
  { name: "Accounts", href: "/economy/accounts", icon: BookOpen },
];

// Profile item shown only when authenticated
const profileNavItem = { 
  name: "Profile", 
  href: "/economy/profile", 
  icon: Building2 
};

export function EconomySidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const showExpanded = !isCollapsed || isHovering;

  // Build nav items based on auth status
  const navItems = isAuthenticated 
    ? [profileNavItem, ...economyNavItems] 
    : economyNavItems;

  return (
    <aside
      className={cn(
        "relative h-full border-r border-border/50 bg-card/50 transition-all duration-300 ease-in-out",
        showExpanded ? "w-64" : "w-16"
      )}
      onMouseEnter={() => isCollapsed && setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border border-border bg-background shadow-sm hover:bg-muted"
      >
        {isCollapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-4 pt-6">
        {showExpanded && (
          <h2 className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Economy
          </h2>
        )}
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.href;
          const isProfile = item.name === "Profile";
          return (
            <div key={item.name}>
              {isProfile && showExpanded && (
                <div className="mb-2 mt-0" />
              )}
              <NavLink
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-accent/10 text-accent"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  !showExpanded && "justify-center px-2",
                  isProfile && "border-b border-border/50 pb-3 mb-2"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {showExpanded && <span>{item.name}</span>}
              </NavLink>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
