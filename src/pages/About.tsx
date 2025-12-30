import { Users, Target, Award, TrendingUp } from "lucide-react";

const stats = [
  { label: "Years of Experience", value: "15+" },
  { label: "Happy Clients", value: "500+" },
  { label: "Transactions Processed", value: "1M+" },
  { label: "Team Members", value: "25+" },
];

const values = [
  {
    icon: Target,
    title: "Precision",
    description: "We deliver accurate financial solutions with meticulous attention to detail.",
  },
  {
    icon: Users,
    title: "Partnership",
    description: "We work alongside our clients as trusted advisors invested in their success.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We maintain the highest standards in everything we do.",
  },
  {
    icon: TrendingUp,
    title: "Growth",
    description: "We help businesses scale with smart financial strategies.",
  },
];

export default function About() {
  return (
    <div className="container py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          About AccountPro
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          For over 15 years, we've been helping businesses of all sizes manage their finances with confidence. Our team of experienced professionals combines deep expertise with modern technology to deliver exceptional results.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border/50 bg-card/50 p-6 text-center"
          >
            <div className="text-3xl font-bold text-accent mb-2">
              {stat.value}
            </div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Values */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-foreground text-center mb-8">
          Our Values
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <div
              key={value.title}
              className="rounded-xl border border-border/50 bg-card/50 p-6 transition-all duration-300 hover:border-accent/30 hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <value.icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {value.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission */}
      <div className="max-w-3xl mx-auto text-center rounded-2xl border border-accent/20 bg-accent/5 p-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
        <p className="text-muted-foreground">
          To empower businesses with clear financial insights and reliable accounting services, enabling them to make informed decisions and achieve sustainable growth. We believe that every business deserves access to professional financial guidance.
        </p>
      </div>
    </div>
  );
}
