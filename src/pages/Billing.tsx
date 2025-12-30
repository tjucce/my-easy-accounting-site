import { CreditCard } from "lucide-react";
import { EconomyLayout } from "@/components/layout/EconomyLayout";
import { ServicePageTemplate } from "@/components/ServicePageTemplate";
import { useToast } from "@/hooks/use-toast";

const features = [
  {
    title: "Invoice Management",
    description: "Create, send, and track professional invoices with automatic reminders.",
  },
  {
    title: "Payment Processing",
    description: "Accept multiple payment methods and process transactions securely.",
  },
  {
    title: "Expense Tracking",
    description: "Monitor and categorize all business expenses in real-time.",
  },
  {
    title: "Recurring Billing",
    description: "Set up automated recurring invoices for subscription services.",
  },
  {
    title: "Credit Management",
    description: "Track customer credits, refunds, and payment terms efficiently.",
  },
  {
    title: "Financial Reports",
    description: "Generate detailed billing reports and cash flow statements.",
  },
];

const benefits = [
  "Faster payment collection with automated reminders",
  "Reduce billing errors with automated calculations",
  "Professional invoice templates that match your brand",
  "Real-time visibility into outstanding payments",
  "Streamlined reconciliation with accounting",
  "Secure payment processing and data protection",
];

export default function Billing() {
  const { toast } = useToast();

  const handleCreateInvoice = () => {
    toast({
      title: "Billing",
      description: "Opening invoice creator...",
    });
  };

  return (
    <EconomyLayout>
      <ServicePageTemplate
        title="Billing Services"
        subtitle="Payment & Invoicing"
        description="Streamline your billing process with professional invoicing, automated payment reminders, and comprehensive expense tracking solutions."
        icon={<CreditCard className="h-8 w-8 text-primary-foreground" />}
        features={features}
        benefits={benefits}
        ctaText="Start Managing Billing"
        actionText="Create Invoice"
        onAction={handleCreateInvoice}
      />
    </EconomyLayout>
  );
}
