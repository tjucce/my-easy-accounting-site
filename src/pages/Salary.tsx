import { Users } from "lucide-react";
import { ServicePageTemplate } from "@/components/ServicePageTemplate";

const features = [
  {
    title: "Payroll Processing",
    description: "Accurate and timely payroll calculations including taxes and deductions.",
  },
  {
    title: "Tax Withholding",
    description: "Proper calculation and remittance of all payroll taxes.",
  },
  {
    title: "Benefits Administration",
    description: "Management of employee benefits, insurance, and retirement plans.",
  },
  {
    title: "Pay Slip Generation",
    description: "Professional pay slips with detailed breakdown for employees.",
  },
  {
    title: "Compliance Management",
    description: "Stay compliant with all labor laws and tax regulations.",
  },
  {
    title: "Employee Self-Service",
    description: "Portal for employees to access pay history and tax documents.",
  },
];

const benefits = [
  "Never miss a payroll deadline again",
  "Automatic tax calculations and filings",
  "Reduce administrative burden on HR teams",
  "Secure handling of sensitive employee data",
  "Integration with your existing accounting software",
  "Scalable solutions for growing businesses",
];

export default function Salary() {
  return (
    <ServicePageTemplate
      title="Salary Services"
      subtitle="Payroll Solutions"
      description="Streamlined payroll processing and employee compensation management that ensures your team gets paid accurately and on time, every time."
      icon={<Users className="h-8 w-8 text-primary-foreground" />}
      features={features}
      benefits={benefits}
      ctaText="Simplify Your Payroll"
    />
  );
}
