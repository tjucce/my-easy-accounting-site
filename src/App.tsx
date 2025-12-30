import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import Index from "./pages/Index";
import Economy from "./pages/Economy";
import Accounting from "./pages/Accounting";
import Salary from "./pages/Salary";
import Declaration from "./pages/Declaration";
import AnnualReports from "./pages/AnnualReports";
import Pricing from "./pages/Pricing";
import Support from "./pages/Support";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/economy" element={<Economy />} />
            <Route path="/economy/accounting" element={<Accounting />} />
            <Route path="/economy/salary" element={<Salary />} />
            <Route path="/economy/declaration" element={<Declaration />} />
            <Route path="/economy/annual-reports" element={<AnnualReports />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/support" element={<Support />} />
            <Route path="/about" element={<About />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
