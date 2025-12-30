import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Starter",
    price: "299",
    description: "Perfect for small businesses just getting started.",
    features: [
      "Basic bookkeeping",
      "Monthly financial reports",
      "Email support",
      "Up to 100 transactions/month",
    ],
  },
  {
    name: "Professional",
    price: "599",
    description: "Ideal for growing businesses with more complex needs.",
    features: [
      "Full bookkeeping services",
      "Quarterly tax planning",
      "Priority support",
      "Up to 500 transactions/month",
      "Payroll for up to 10 employees",
      "Annual report preparation",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Tailored solutions for large organizations.",
    features: [
      "Dedicated account manager",
      "Unlimited transactions",
      "24/7 priority support",
      "Custom integrations",
      "Multi-entity support",
      "Strategic financial consulting",
    ],
  },
];

export default function Pricing() {
  return (
    <div className="container py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that best fits your business needs. All plans include our core features.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-2xl border p-8 transition-all duration-300 ${
              plan.popular
                ? "border-accent bg-accent/5 shadow-lg scale-105"
                : "border-border/50 bg-card/50 hover:border-accent/30"
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-semibold text-accent-foreground">
                Most Popular
              </span>
            )}
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {plan.name}
            </h3>
            <div className="mb-4">
              <span className="text-4xl font-bold text-foreground">
                {plan.price === "Custom" ? "" : "$"}
                {plan.price}
              </span>
              {plan.price !== "Custom" && (
                <span className="text-muted-foreground">/month</span>
              )}
            </div>
            <p className="text-muted-foreground mb-6">{plan.description}</p>
            <ul className="space-y-3 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              variant={plan.popular ? "accent" : "outline"}
              className="w-full"
            >
              {plan.price === "Custom" ? "Contact Us" : "Get Started"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
