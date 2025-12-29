import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ServiceFeature {
  title: string;
  description: string;
}

interface ServicePageTemplateProps {
  title: string;
  subtitle: string;
  description: string;
  icon: ReactNode;
  features: ServiceFeature[];
  benefits: string[];
  ctaText?: string;
}

export function ServicePageTemplate({
  title,
  subtitle,
  description,
  icon,
  features,
  benefits,
  ctaText = "Get Started Today",
}: ServicePageTemplateProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-hero-gradient py-20 lg:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/10 backdrop-blur-sm animate-fade-in">
              {icon}
            </div>
            <p className="mb-4 text-sm font-medium uppercase tracking-wider text-primary-foreground/70 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              {subtitle}
            </p>
            <h1 className="mb-6 text-4xl font-bold text-primary-foreground lg:text-5xl xl:text-6xl animate-slide-up" style={{ animationDelay: "0.2s" }}>
              {title}
            </h1>
            <p className="text-lg text-primary-foreground/80 animate-slide-up" style={{ animationDelay: "0.3s" }}>
              {description}
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-28">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground lg:text-4xl mb-4">
              What We Offer
            </h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive solutions tailored to your specific needs
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={cn(
                  "group relative rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-accent/50",
                  "animate-slide-up"
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute inset-0 rounded-2xl bg-accent-gradient opacity-0 transition-opacity duration-300 group-hover:opacity-5" />
                <h3 className="mb-3 text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground lg:text-4xl mb-6">
                Why Choose Our {title} Services?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                We combine expertise with technology to deliver exceptional results for your business.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10">
                      <Check className="h-3 w-3 text-accent" />
                    </div>
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-accent/20 to-primary/20 p-8 lg:p-12">
                <div className="h-full w-full rounded-2xl bg-card shadow-xl flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-accent-gradient">
                      {icon}
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">Expert Support</h3>
                    <p className="text-muted-foreground">Professional guidance every step of the way</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-foreground lg:text-4xl mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Contact us today for a free consultation and discover how we can help your business thrive.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl">
                {ctaText}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="xl">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
