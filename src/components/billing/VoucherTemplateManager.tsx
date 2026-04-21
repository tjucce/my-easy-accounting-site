import { useState } from "react";
import { Plus, Trash2, Edit, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useBilling } from "@/contexts/BillingContext";
import { useAccounting } from "@/contexts/AccountingContext";
import { VoucherTemplate, VoucherTemplateLine, TemplateAmountSource } from "@/lib/billing/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const SOURCE_LABEL: Record<TemplateAmountSource, string> = {
  total: "Total (incl. VAT)",
  subtotal: "Subtotal (excl. VAT)",
  totalVat: "VAT amount",
  fixed: "Fixed amount",
};

interface FormProps {
  initial?: VoucherTemplate;
  onSubmit: (data: Omit<VoucherTemplate, "id" | "companyId" | "createdAt">) => void;
  onCancel: () => void;
}

function TemplateForm({ initial, onSubmit, onCancel }: FormProps) {
  const { accounts } = useAccounting();
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [isDefault, setIsDefault] = useState(initial?.isDefault ?? false);
  const [lines, setLines] = useState<VoucherTemplateLine[]>(
    initial?.lines ?? [
      { id: crypto.randomUUID(), accountNumber: "1930", accountName: "Bankgiro", side: "debit", amountSource: "total" },
      { id: crypto.randomUUID(), accountNumber: "", accountName: "", side: "credit", amountSource: "subtotal" },
    ]
  );

  const updateLine = (id: string, patch: Partial<VoucherTemplateLine>) => {
    setLines(lines.map(l => l.id === id ? { ...l, ...patch } : l));
  };

  const addLine = () => {
    setLines([...lines, {
      id: crypto.randomUUID(),
      accountNumber: "",
      accountName: "",
      side: "credit",
      amountSource: "subtotal",
    }]);
  };

  const removeLine = (id: string) => {
    if (lines.length <= 2) {
      toast.error("A template needs at least 2 lines");
      return;
    }
    setLines(lines.filter(l => l.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error("Name is required"); return; }
    for (const l of lines) {
      if (!l.accountNumber.trim()) { toast.error("All lines need an account number"); return; }
      if (l.amountSource === "fixed" && (!l.fixedAmount || l.fixedAmount <= 0)) {
        toast.error("Fixed amount must be greater than 0");
        return;
      }
    }
    const cleaned = lines.map(l => {
      const account = accounts.find(a => a.number === l.accountNumber);
      return { ...l, accountName: account?.name ?? l.accountName };
    });
    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      isDefault,
      lines: cleaned,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="tplName">Template Name *</Label>
        <Input id="tplName" value={name} onChange={(e) => setName(e.target.value)} placeholder="Standard sales invoice" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tplDesc">Description</Label>
        <Input id="tplDesc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional" />
      </div>
      <div className="flex items-center justify-between rounded-lg border border-border p-3">
        <div>
          <p className="text-sm font-medium">Use as default template</p>
          <p className="text-xs text-muted-foreground">Auto-selected when marking invoices as paid</p>
        </div>
        <Switch checked={isDefault} onCheckedChange={setIsDefault} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Voucher Lines</Label>
          <Button type="button" size="sm" variant="outline" onClick={addLine}>
            <Plus className="h-3 w-3 mr-1" /> Add line
          </Button>
        </div>
        <div className="space-y-2">
          {lines.map((line) => (
            <div key={line.id} className="grid grid-cols-[100px_1fr_120px_140px_32px] gap-2 items-center">
              <Input
                value={line.accountNumber}
                onChange={(e) => {
                  const num = e.target.value.replace(/\D/g, "").slice(0, 4);
                  const acc = accounts.find(a => a.number === num);
                  updateLine(line.id, { accountNumber: num, accountName: acc?.name ?? "" });
                }}
                placeholder="1930"
                maxLength={4}
              />
              <div className="text-xs text-muted-foreground truncate">
                {line.accountName || "—"}
              </div>
              <Select value={line.side} onValueChange={(v) => updateLine(line.id, { side: v as "debit" | "credit" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="debit">Debit</SelectItem>
                  <SelectItem value="credit">Credit</SelectItem>
                </SelectContent>
              </Select>
              <div className="space-y-1">
                <Select
                  value={line.amountSource}
                  onValueChange={(v) => updateLine(line.id, { amountSource: v as TemplateAmountSource })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(Object.keys(SOURCE_LABEL) as TemplateAmountSource[]).map(s => (
                      <SelectItem key={s} value={s}>{SOURCE_LABEL[s]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {line.amountSource === "fixed" && (
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    value={line.fixedAmount ?? ""}
                    onChange={(e) => updateLine(line.id, { fixedAmount: parseFloat(e.target.value) || 0 })}
                    placeholder="Amount"
                  />
                )}
              </div>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeLine(line.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Tip: pick which invoice amount fills each line. Debit and credit must balance per voucher.
        </p>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button type="submit" className="flex-1">{initial ? "Save Changes" : "Create Template"}</Button>
      </div>
    </form>
  );
}

export function VoucherTemplateManager() {
  const { templates, addTemplate, updateTemplate, deleteTemplate, setDefaultTemplate } = useBilling();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<VoucherTemplate | undefined>();

  const handleSubmit = (data: Omit<VoucherTemplate, "id" | "companyId" | "createdAt">) => {
    if (editing) {
      updateTemplate({ ...editing, ...data });
      toast.success("Template updated");
    } else {
      addTemplate(data);
      toast.success("Template created");
    }
    setOpen(false);
    setEditing(undefined);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Voucher Templates</h2>
          <p className="text-sm text-muted-foreground">
            Define how vouchers are created automatically when an invoice is marked as paid.
          </p>
        </div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(undefined); }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />New Template</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Template" : "New Voucher Template"}</DialogTitle>
            </DialogHeader>
            <TemplateForm
              initial={editing}
              onSubmit={handleSubmit}
              onCancel={() => { setOpen(false); setEditing(undefined); }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {templates.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No templates yet. Create one to enable automatic voucher creation when marking invoices as paid.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {templates.map((tpl) => (
            <Card key={tpl.id} className={cn(tpl.isDefault && "border-secondary")}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{tpl.name}</p>
                      {tpl.isDefault && (
                        <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-secondary/15 text-secondary">
                          <Star className="h-3 w-3" /> Default
                        </span>
                      )}
                    </div>
                    {tpl.description && (
                      <p className="text-xs text-muted-foreground truncate">{tpl.description}</p>
                    )}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {!tpl.isDefault && (
                      <Button variant="ghost" size="icon" className="h-7 w-7" title="Set as default" onClick={() => setDefaultTemplate(tpl.id)}>
                        <Star className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditing(tpl); setOpen(true); }}>
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { deleteTemplate(tpl.id); toast.success("Template deleted"); }}>
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                </div>

                <div className="rounded-md border border-border overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-muted/40">
                      <tr>
                        <th className="text-left py-1.5 px-2 font-medium">Account</th>
                        <th className="text-left py-1.5 px-2 font-medium w-16">Side</th>
                        <th className="text-left py-1.5 px-2 font-medium">Amount from</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tpl.lines.map((l) => (
                        <tr key={l.id} className="border-t border-border/50">
                          <td className="py-1.5 px-2">
                            <span className="font-mono">{l.accountNumber}</span>
                            <span className="text-muted-foreground ml-1 truncate">{l.accountName}</span>
                          </td>
                          <td className="py-1.5 px-2 capitalize">{l.side}</td>
                          <td className="py-1.5 px-2 text-muted-foreground">
                            {l.amountSource === "fixed"
                              ? `Fixed ${l.fixedAmount ?? 0} kr`
                              : SOURCE_LABEL[l.amountSource]}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
