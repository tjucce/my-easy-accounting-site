import { Calculator } from "lucide-react";
import { EconomyLayout } from "@/components/layout/EconomyLayout";
import { ServicePageTemplate } from "@/components/ServicePageTemplate";
import { useToast } from "@/hooks/use-toast";

const features = [
  {
    title: "Bookkeeping",
    description: "Accurate and timely recording of all financial transactions to keep your books in order.",
  },
  {
    title: "Financial Statements",
    description: "Preparation of balance sheets, income statements, and cash flow statements.",
  },
  {
    title: "Accounts Payable",
    description: "Efficient management of vendor payments and expense tracking.",
  },
  {
    title: "Accounts Receivable",
    description: "Invoice generation and payment collection management.",
  },
  {
    title: "Bank Reconciliation",
    description: "Regular reconciliation of bank statements with your financial records.",
  },
  {
    title: "Financial Analysis",
    description: "In-depth analysis of your financial data to drive business decisions.",
  },
];

const benefits = [
  "Reduce accounting errors and save valuable time",
  "Real-time access to your financial data",
  "Compliance with accounting standards and regulations",
  "Customized reporting tailored to your business needs",
  "Dedicated support from certified accountants",
  "Secure cloud-based platform for data protection",
];

export default function Accounting() {
  const { toast } = useToast();

  const handleStartBookkeeping = () => {
    toast({
      title: "Bookkeeping Started",
      description: "Opening the bookkeeping module...",
    });
  };

  return (
    <EconomyLayout>
      <ServicePageTemplate
        title="Accounting Services"
        subtitle="Core Service"
        description="Comprehensive bookkeeping and financial management solutions that help you maintain accurate records and make informed business decisions."
        icon={<Calculator className="h-8 w-8 text-primary-foreground" />}
        features={features}
        benefits={benefits}
        ctaText="Start Your Free Consultation"
        actionText="Start Bookkeeping"
        onAction={handleStartBookkeeping}
      />
    </EconomyLayout>
  );
}
