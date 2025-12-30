import { Building2, Save } from "lucide-react";
import { EconomyLayout } from "@/components/layout/EconomyLayout";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [companyInfo, setCompanyInfo] = useState({
    companyName: "",
    organizationNumber: "",
    vatNumber: "",
    address: "",
    postalCode: "",
    city: "",
    country: "",
    phone: "",
    email: "",
    website: "",
    bankAccount: "",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCompanyInfo({ ...companyInfo, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    toast({
      title: "Profile Saved",
      description: "Your company information has been updated successfully.",
    });
  };

  if (!isAuthenticated) {
    return (
      <EconomyLayout>
        <div className="container py-20 text-center">
          <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-4">Company Profile</h1>
          <p className="text-muted-foreground">Please log in to manage your company information.</p>
        </div>
      </EconomyLayout>
    );
  }

  return (
    <EconomyLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-hero-gradient py-16 lg:py-24">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
          <div className="container relative">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/10 backdrop-blur-sm">
                <Building2 className="h-8 w-8 text-primary-foreground" />
              </div>
              <h1 className="mb-4 text-4xl font-bold text-primary-foreground lg:text-5xl">
                Company Profile
              </h1>
              <p className="text-lg text-primary-foreground/80">
                Manage your company information for invoices and reports
              </p>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-12 lg:py-20">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <div className="rounded-2xl border border-border bg-card p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Company Information</h2>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      value={companyInfo.companyName}
                      onChange={handleChange}
                      placeholder="Your Company AB"
                      className="mt-1.5"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="organizationNumber">Organization Number</Label>
                    <Input
                      id="organizationNumber"
                      name="organizationNumber"
                      value={companyInfo.organizationNumber}
                      onChange={handleChange}
                      placeholder="556xxx-xxxx"
                      className="mt-1.5"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="vatNumber">VAT Number</Label>
                    <Input
                      id="vatNumber"
                      name="vatNumber"
                      value={companyInfo.vatNumber}
                      onChange={handleChange}
                      placeholder="SE556xxxxxx01"
                      className="mt-1.5"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={companyInfo.address}
                      onChange={handleChange}
                      placeholder="Street Address 123"
                      className="mt-1.5"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={companyInfo.postalCode}
                      onChange={handleChange}
                      placeholder="123 45"
                      className="mt-1.5"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={companyInfo.city}
                      onChange={handleChange}
                      placeholder="Stockholm"
                      className="mt-1.5"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value={companyInfo.country}
                      onChange={handleChange}
                      placeholder="Sweden"
                      className="mt-1.5"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={companyInfo.phone}
                      onChange={handleChange}
                      placeholder="+46 8 123 456 78"
                      className="mt-1.5"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={companyInfo.email}
                      onChange={handleChange}
                      placeholder="info@yourcompany.se"
                      className="mt-1.5"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      value={companyInfo.website}
                      onChange={handleChange}
                      placeholder="www.yourcompany.se"
                      className="mt-1.5"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="bankAccount">Bank Account / IBAN</Label>
                    <Input
                      id="bankAccount"
                      name="bankAccount"
                      value={companyInfo.bankAccount}
                      onChange={handleChange}
                      placeholder="SE00 0000 0000 0000 0000 0000"
                      className="mt-1.5"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={companyInfo.notes}
                      onChange={handleChange}
                      placeholder="Any additional information about your company..."
                      rows={4}
                      className="mt-1.5"
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <Button variant="hero" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </EconomyLayout>
  );
}
