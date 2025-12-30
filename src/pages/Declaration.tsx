import { FileText } from "lucide-react";
import { EconomyLayout } from "@/components/layout/EconomyLayout";
import { ServicePageTemplate } from "@/components/ServicePageTemplate";

const features = [
  {
    title: "Tax Preparation",
    description: "Comprehensive tax return preparation for individuals and businesses.",
  },
  {
    title: "Tax Planning",
    description: "Strategic planning to minimize tax liability and maximize deductions.",
  },
  {
    title: "VAT Returns",
    description: "Accurate preparation and filing of VAT returns and declarations.",
  },
  {
    title: "Corporate Tax",
    description: "Expert handling of corporate tax filings and compliance.",
  },
  {
    title: "Tax Audit Support",
    description: "Professional representation and support during tax audits.",
  },
  {
    title: "International Tax",
    description: "Guidance on cross-border tax matters and international compliance.",
  },
];

const benefits = [
  "Maximize deductions and minimize tax liability",
  "Avoid costly penalties and late filing fees",
  "Stay updated with changing tax regulations",
  "Professional review to catch errors before filing",
  "Year-round tax planning and advice",
  "Confidential handling of all tax documents",
];

export default function Declaration() {
  return (
    <EconomyLayout>
      <ServicePageTemplate
        title="Tax Declaration"
        subtitle="Tax Services"
        description="Expert tax preparation and filing services that ensure compliance while maximizing your returns through strategic tax planning."
        icon={<FileText className="h-8 w-8 text-primary-foreground" />}
        features={features}
        benefits={benefits}
        ctaText="Get Tax Help Today"
      />
    </EconomyLayout>
  );
}
