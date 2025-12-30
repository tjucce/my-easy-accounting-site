import { BarChart3 } from "lucide-react";
import { EconomyLayout } from "@/components/layout/EconomyLayout";
import { ServicePageTemplate } from "@/components/ServicePageTemplate";
import { useToast } from "@/hooks/use-toast";

const features = [
  {
    title: "Financial Reporting",
    description: "Comprehensive annual financial statements prepared to standards.",
  },
  {
    title: "Management Reports",
    description: "Detailed reports for internal decision-making and planning.",
  },
  {
    title: "Audit Preparation",
    description: "Complete preparation of documents for external audits.",
  },
  {
    title: "Regulatory Filings",
    description: "Timely submission of required regulatory reports and filings.",
  },
  {
    title: "Performance Analysis",
    description: "Year-over-year analysis of financial performance and trends.",
  },
  {
    title: "Stakeholder Reports",
    description: "Clear reports for shareholders, investors, and board members.",
  },
];

const benefits = [
  "Meet all regulatory reporting deadlines",
  "Clear insights into business performance",
  "Professional presentation for stakeholders",
  "Identify trends and opportunities for growth",
  "Compliance with accounting standards",
  "Support for strategic planning and budgeting",
];

export default function AnnualReports() {
  const { toast } = useToast();

  const handleGenerateReport = () => {
    toast({
      title: "Annual Reports",
      description: "Opening report generator...",
    });
  };

  return (
    <EconomyLayout>
      <ServicePageTemplate
        title="Annual Reports"
        subtitle="Financial Reporting"
        description="Comprehensive annual financial reporting and analysis that provides clear insights into your business performance and supports informed decision-making."
        icon={<BarChart3 className="h-8 w-8 text-primary-foreground" />}
        features={features}
        benefits={benefits}
        ctaText="Get Your Report"
        actionText="Generate Annual Report"
        onAction={handleGenerateReport}
      />
    </EconomyLayout>
  );
}
