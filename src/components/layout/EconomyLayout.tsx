import { useState } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { EconomySidebar } from "./EconomySidebar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useInactivityLogout } from "@/hooks/useInactivityLogout";
import { useUnlockOnTabClose } from "@/hooks/useUnlockOnTabClose";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, Check, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MAX_COMPANIES_SHOWN = 5;

export function EconomyLayout() {
  useInactivityLogout();
  useUnlockOnTabClose();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, hasValidCompany, isLoading, companies, activeCompany, setActiveCompany } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [companySearch, setCompanySearch] = useState("");

  useEffect(() => {
    if (location.pathname === "/economy/accounting") {
      const forceScrollTop = () => {
        window.scrollTo({ top: 0, behavior: "instant" });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      };
      forceScrollTop();
      const frame = requestAnimationFrame(forceScrollTop);
      return () => cancelAnimationFrame(frame);
    }
  }, [location.key, location.pathname]);

  useEffect(() => {
    if (!isLoading && user && !hasValidCompany) {
      navigate("/settings", { replace: true, state: { showCompanyRequiredAlert: true } });
    }
  }, [user, hasValidCompany, isLoading, navigate]);

  if (!isLoading && user && !hasValidCompany) {
    return null;
  }

  const filteredCompanies = companies.filter(c => {
    if (!companySearch.trim()) return true;
    const q = companySearch.toLowerCase();
    return (c.companyName || "").toLowerCase().includes(q) || (c.organizationNumber || "").includes(q);
  });

  const showCompanySearch = companies.length > MAX_COMPANIES_SHOWN;
  const displayedCompanies = showCompanySearch ? filteredCompanies : companies.slice(0, MAX_COMPANIES_SHOWN);

  return (
    <div className="min-h-screen flex">
      <EconomySidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main
        className={cn(
          "flex-1 transition-all duration-300 ease-in-out min-h-screen",
          sidebarCollapsed ? "ml-sidebar-collapsed" : "ml-sidebar"
        )}
      >
        {/* Top bar: company name center + company switcher right */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-6 py-3 bg-background/80 backdrop-blur-sm border-b border-border/40">
          {/* Center: company name as link to overview */}
          <div className="flex-1" />
          <Link
            to="/economy"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {activeCompany?.companyName || "My Company"}
          </Link>
          <div className="flex-1 flex justify-end">
            {/* Company switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1.5 text-foreground/70 hover:text-foreground">
                  <span className="text-sm font-medium truncate max-w-[180px]">
                    {activeCompany?.companyName || "Select Company"}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2">
                <p className="text-xs text-muted-foreground px-2 py-1 font-medium">Switch Company</p>
                {showCompanySearch && (
                  <div className="px-2 pb-1">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                      <Input
                        placeholder="Search companies..."
                        value={companySearch}
                        onChange={(e) => setCompanySearch(e.target.value)}
                        className="h-7 pl-7 text-xs"
                      />
                    </div>
                  </div>
                )}
                {displayedCompanies.map((company) => (
                  <button
                    key={company.id}
                    onClick={() => setActiveCompany(company.id)}
                    className={cn(
                      "w-full flex items-center gap-2 px-2 py-2 rounded-md text-sm transition-colors text-left",
                      company.id === activeCompany?.id
                        ? "bg-sidebar-primary/10 text-sidebar-primary"
                        : "hover:bg-muted"
                    )}
                  >
                    {company.id === activeCompany?.id && (
                      <Check className="h-4 w-4 shrink-0" />
                    )}
                    <div className={cn(company.id !== activeCompany?.id && "ml-6")}>
                      <p className="font-medium truncate">{company.companyName || "Unnamed Company"}</p>
                      {company.organizationNumber && (
                        <p className="text-xs text-muted-foreground">{company.organizationNumber}</p>
                      )}
                    </div>
                  </button>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="container py-8">
          <Outlet context={{ sidebarCollapsed, setSidebarCollapsed }} />
        </div>
      </main>
    </div>
  );
}
