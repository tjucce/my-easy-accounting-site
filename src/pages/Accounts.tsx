import { BookOpen, Plus } from "lucide-react";
import { EconomyLayout } from "@/components/layout/EconomyLayout";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Easy to add more accounts - just add to this array
const accounts = [
  { code: "1930", name: "Company Account", category: "Assets" },
  // Add more accounts here as needed:
  // { code: "1910", name: "Cash", category: "Assets" },
  // { code: "2440", name: "Accounts Payable", category: "Liabilities" },
  // { code: "3000", name: "Share Capital", category: "Equity" },
  // { code: "4000", name: "Sales Revenue", category: "Revenue" },
  // { code: "5000", name: "Cost of Goods Sold", category: "Expenses" },
];

export default function Accounts() {
  const { isAuthenticated } = useAuth();

  return (
    <EconomyLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-hero-gradient py-20 lg:py-32">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
          <div className="container relative">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/10 backdrop-blur-sm animate-fade-in">
                <BookOpen className="h-8 w-8 text-primary-foreground" />
              </div>
              <p className="mb-4 text-sm font-medium uppercase tracking-wider text-primary-foreground/70 animate-fade-in">
                Chart of Accounts
              </p>
              <h1 className="mb-6 text-4xl font-bold text-primary-foreground lg:text-5xl xl:text-6xl animate-slide-up">
                Account Management
              </h1>
              <p className="text-lg text-primary-foreground/80 animate-slide-up">
                Manage your chart of accounts for accurate bookkeeping and financial reporting.
              </p>
            </div>
          </div>
        </section>

        {/* Accounts Section */}
        <section className="py-20 lg:py-28">
          <div className="container">
            <div className="mx-auto max-w-4xl">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-foreground lg:text-4xl mb-2">
                    Your Accounts
                  </h2>
                  <p className="text-muted-foreground">
                    Accounts available for bookkeeping transactions
                  </p>
                </div>
                {isAuthenticated && (
                  <Button variant="hero">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Account
                  </Button>
                )}
              </div>

              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 border-b border-border text-sm font-semibold text-foreground">
                  <div>Account Code</div>
                  <div>Account Name</div>
                  <div>Category</div>
                </div>
                {accounts.map((account, index) => (
                  <div
                    key={account.code}
                    className={cn(
                      "grid grid-cols-3 gap-4 p-4 transition-colors hover:bg-muted/30",
                      index !== accounts.length - 1 && "border-b border-border/50"
                    )}
                  >
                    <div className="font-mono text-accent font-semibold">
                      {account.code}
                    </div>
                    <div className="text-foreground">{account.name}</div>
                    <div className="text-muted-foreground">{account.category}</div>
                  </div>
                ))}
                {accounts.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    No accounts configured yet.
                  </div>
                )}
              </div>

              {!isAuthenticated && (
                <div className="mt-8 rounded-2xl border border-border bg-muted/30 p-8 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Manage Your Accounts
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Log in to add, edit, and manage your chart of accounts for bookkeeping.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </EconomyLayout>
  );
}
