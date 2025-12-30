import { Mail, Phone, MessageCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const contactMethods = [
  {
    icon: Phone,
    title: "Phone Support",
    description: "Speak directly with our team",
    detail: "+1 (555) 123-4567",
    action: "Call Now",
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "Get a response within 24 hours",
    detail: "support@accountpro.com",
    action: "Send Email",
  },
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Chat with our support team",
    detail: "Available 9am - 6pm EST",
    action: "Start Chat",
  },
];

export default function Support() {
  return (
    <div className="container py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          How Can We Help?
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Our dedicated support team is here to assist you with any questions or concerns.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto mb-16">
        {contactMethods.map((method) => (
          <div
            key={method.title}
            className="rounded-xl border border-border/50 bg-card/50 p-6 text-center transition-all duration-300 hover:border-accent/30 hover:shadow-lg"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
              <method.icon className="h-7 w-7 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {method.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              {method.description}
            </p>
            <p className="text-sm font-medium text-foreground mb-4">
              {method.detail}
            </p>
            <Button variant="outline" size="sm">
              {method.action}
            </Button>
          </div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto rounded-2xl border border-border/50 bg-card/50 p-8">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="h-6 w-6 text-accent" />
          <h2 className="text-2xl font-semibold text-foreground">
            Business Hours
          </h2>
        </div>
        <div className="space-y-3 text-foreground">
          <div className="flex justify-between">
            <span>Monday - Friday</span>
            <span className="font-medium">9:00 AM - 6:00 PM EST</span>
          </div>
          <div className="flex justify-between">
            <span>Saturday</span>
            <span className="font-medium">10:00 AM - 2:00 PM EST</span>
          </div>
          <div className="flex justify-between">
            <span>Sunday</span>
            <span className="text-muted-foreground">Closed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
