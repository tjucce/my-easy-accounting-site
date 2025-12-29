import { Link } from "react-router-dom";
import { ArrowRight, Calculator, FileText, Users, BarChart3, Shield, Clock, Award, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    title: "Accounting",
    description: "Complete bookkeeping and financial management solutions for your business.",
    icon: Calculator,
    href: "/accounting",
  },
  {
    title: "Salary Services",
    description: "Streamlined payroll processing and employee compensation management.",
    icon: Users,
    href: "/salary",
  },
  {
    title: "Tax Declaration",
    description: "Expert tax preparation and filing services to maximize your returns.",
    icon: FileText,
    href: "/declaration",
  },
  {
    title: "Annual Reports",
    description: "Comprehensive annual financial reporting and analysis.",
    icon: BarChart3,
    href: "/annual-reports",
  },
];

const features = [
  {
    icon: Shield,
    title: "Secure & Compliant",
    description: "Bank-level security with full regulatory compliance.",
  },
  {
    icon: Clock,
    title: "Time-Saving",
    description: "Automated processes that save you valuable time.",
  },
  {
    icon: Award,
    title: "Expert Team",
    description: "Certified professionals with years of experience.",
  },
];

const stats = [
  { value: "500+", label: "Happy Clients" },
  { value: "15+", label: "Years Experience" },
  { value: "99%", label: "Accuracy Rate" },
  { value: "24/7", label: "Support Available" },
];

export default function Index() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-hero-gradient py-24 lg:py-36">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
        <div className="container relative">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2 backdrop-blur-sm animate-fade-in">
              <span className="text-sm font-medium text-primary-foreground">
                Trusted by 500+ businesses worldwide
              </span>
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl xl:text-7xl animate-slide-up" style={{ animationDelay: "0.1s" }}>
              Professional Accounting
              <span className="block text-gradient mt-2">Made Simple</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-primary-foreground/80 lg:text-xl animate-slide-up" style={{ animationDelay: "0.2s" }}>
              Streamline your finances with our comprehensive accounting services. From bookkeeping to tax filing, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <Button variant="hero" size="xl">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="hero-outline" size="xl">
                View Our Services
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative -mt-12 z-10">
        <div className="container">
          <div className="mx-auto max-w-4xl rounded-2xl bg-card border border-border shadow-xl p-8">
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <div key={stat.label} className="text-center animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="text-3xl font-bold text-accent lg:text-4xl">{stat.value}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 lg:py-32">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground lg:text-4xl mb-4">
              Our Services
            </h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive financial solutions tailored to your business needs
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => (
              <Link
                key={service.title}
                to={service.href}
                className="group relative rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-accent/50 hover:-translate-y-1 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute inset-0 rounded-2xl bg-accent-gradient opacity-0 transition-opacity duration-300 group-hover:opacity-5" />
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent transition-all duration-300 group-hover:bg-accent group-hover:text-accent-foreground">
                  <service.icon className="h-7 w-7" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {service.description}
                </p>
                <div className="flex items-center text-accent font-medium">
                  Learn more
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 lg:py-32 bg-muted/30">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground lg:text-4xl mb-6">
                Why Choose AccountPro?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                We combine cutting-edge technology with expert knowledge to deliver exceptional accounting services that help your business thrive.
              </p>
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <div key={feature.title} className="flex gap-4 animate-slide-in-right" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-accent/20 to-primary/20 p-8 lg:p-12">
                <div className="h-full w-full rounded-2xl bg-card shadow-xl flex flex-col items-center justify-center p-8">
                  <div className="mb-6 h-24 w-24 rounded-2xl bg-accent-gradient flex items-center justify-center shadow-glow">
                    <CheckCircle className="h-12 w-12 text-accent-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2 text-center">100% Satisfaction</h3>
                  <p className="text-muted-foreground text-center">Guaranteed quality service for every client</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32">
        <div className="container">
          <div className="mx-auto max-w-4xl rounded-3xl bg-hero-gradient p-12 lg:p-20 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
            <div className="relative">
              <h2 className="text-3xl font-bold text-primary-foreground lg:text-4xl mb-6">
                Ready to Transform Your Finances?
              </h2>
              <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                Join hundreds of businesses that trust AccountPro for their accounting needs. Start your journey today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="xl">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="hero-outline" size="xl">
                  Schedule a Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
