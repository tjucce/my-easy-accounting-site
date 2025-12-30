import { EconomyLayout } from "@/components/layout/EconomyLayout";
import { Calculator, Users, FileText, BarChart3, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    title: "Accounting",
    description: "Complete bookkeeping and financial management solutions.",
    icon: Calculator,
    href: "/economy/accounting",
  },
  {
    title: "Salary",
    description: "Payroll processing and employee compensation management.",
    icon: Users,
    href: "/economy/salary",
  },
  {
    title: "Declaration",
    description: "Tax declarations and regulatory compliance services.",
    icon: FileText,
    href: "/economy/declaration",
  },
  {
    title: "Annual Reports",
    description: "Comprehensive annual financial reporting and analysis.",
    icon: BarChart3,
    href: "/economy/annual-reports",
  },
];

export default function Economy() {
  return (
    <EconomyLayout>
      <div className="container py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Economy Services
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Explore our comprehensive range of financial and accounting services designed to help your business thrive.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {services.map((service) => (
            <Link
              key={service.title}
              to={service.href}
              className="group rounded-xl border border-border/50 bg-card/50 p-6 transition-all duration-300 hover:border-accent/30 hover:bg-card hover:shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <service.icon className="h-6 w-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {service.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-accent">
                    Learn more
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </EconomyLayout>
  );
}
