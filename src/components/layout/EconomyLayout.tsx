import { ReactNode } from "react";
import { EconomySidebar } from "./EconomySidebar";

interface EconomyLayoutProps {
  children: ReactNode;
}

export function EconomyLayout({ children }: EconomyLayoutProps) {
  return (
    <div className="flex min-h-[calc(100vh-5rem)]">
      <EconomySidebar />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
