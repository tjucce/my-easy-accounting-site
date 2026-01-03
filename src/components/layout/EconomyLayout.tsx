import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Header } from "./Header";
import { EconomySidebar } from "./EconomySidebar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export function EconomyLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showCompanyAlert, setShowCompanyAlert] = useState(false);
  const { user, hasValidCompany, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user && !hasValidCompany) {
      setShowCompanyAlert(true);
      navigate("/company", { replace: true });
    }
  }, [user, hasValidCompany, isLoading, navigate]);

  // Show nothing while checking or redirecting
  if (!isLoading && user && !hasValidCompany) {
    return (
      <AlertDialog open={showCompanyAlert} onOpenChange={setShowCompanyAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Company Required</AlertDialogTitle>
            <AlertDialogDescription>
              You need to add a company before you can visit the Economy page. Please fill in all mandatory company details and save.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowCompanyAlert(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <EconomySidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main
          className={cn(
            "flex-1 transition-all duration-300 ease-in-out",
            sidebarCollapsed ? "ml-sidebar-collapsed" : "ml-sidebar"
          )}
        >
          <div className="container py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
