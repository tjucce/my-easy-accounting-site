// Declaration field calculator
// Maps INK2R / INK2S / sida 1 fields to BAS accounts via exact BAS 2026 -> INK2 mapping.
// Important: this replaces broad account ranges with exact account-number mapping.

import type { Voucher } from "@/contexts/AccountingContexts";
import type { BASAccount } from "@/lib/bas-accounts";
import { calculateBalance, getAccountClass } from "@/lib/bas-accounts";
import { INK2_ACCOUNT_MAPPING_2026 } from "@/lib/ink2Mapping2026";

export interface BreakdownEntry {
  label: string;
  amount: number;
}

export interface FieldResult {
  value: number;
  breakdown: BreakdownEntry[];
  source: "accounts" | "formula" | "manual";
  note?: string;
}

interface AccountAggregate {
  accountNumber: string;
  accountName: string;
  totalDebit: number;
  totalCredit: number;
  balance: number;
}

function fieldIdFromInk2rField(ink2rField: string): string | null {
  if (!ink2rField || ink2rField.includes("/")) return null;
  return `f${ink2rField.replace(".", "_")}`;
}

function getOrCreateField(
  fields: Record<string, FieldResult>,
  id: string,
  note = "Summeras från exakt BAS 2026 → INK2-koppling."
): FieldResult {
  if (!fields[id]) {
    fields[id] = { value: 0, breakdown: [], source: "accounts", note };
  }
  return fields[id];
}

function addToField(
  fields: Record<string, FieldResult>,
  fieldId: string,
  label: string,
  amount: number,
  note?: string
): void {
  if (Math.abs(amount) < 0.005) return;

  const field = getOrCreateField(fields, fieldId, note);
  field.value += amount;
  field.breakdown.push({ label, amount });
}

function aggregateVoucherAccounts(vouchers: Voucher[], accounts: BASAccount[]): AccountAggregate[] {
  const totals = new Map<string, { debit: number; credit: number }>();

  vouchers.forEach((voucher) => {
    voucher.lines.forEach((line) => {
      const accountNumber = line.accountNumber?.trim();
      if (!/^\d{4}$/.test(accountNumber)) return;

      const cur = totals.get(accountNumber) ?? { debit: 0, credit: 0 };
      cur.debit += line.debit || 0;
      cur.credit += line.credit || 0;
      totals.set(accountNumber, cur);
    });
  });

  return Array.from(totals.entries())
    .map(([accountNumber, { debit, credit }]) => {
      const account = accounts.find((a) => a.number === accountNumber);
      const accClass = getAccountClass(accountNumber);

      return {
        accountNumber,
        accountName: account?.name ?? INK2_ACCOUNT_MAPPING_2026[accountNumber]?.accountName ?? INK2_ACCOUNT_MAPPING_2026[accountNumber]?.ink2rLabel ?? "Okänt konto",
        totalDebit: debit,
        totalCredit: credit,
        balance: calculateBalance(accClass, debit, credit),
      };
    })
    .sort((a, b) => a.accountNumber.localeCompare(b.accountNumber));
}

function addMappedAccount(fields: Record<string, FieldResult>, aggregate: AccountAggregate): void {
  const mapping = INK2_ACCOUNT_MAPPING_2026[aggregate.accountNumber];
  if (!mapping?.ink2rField) return;

  const baseLabel = `${aggregate.accountNumber} ${aggregate.accountName}`;
  const fullLabel = mapping.sruCodes
    ? `${baseLabel} · SRU ${mapping.sruCodes}`
    : baseLabel;

  // 8990/8999 should not be booked directly into 3.26/3.27 here.
  // Those fields are calculated from the whole income statement below to avoid double-counting.
  if (mapping.ink2rField === "3.26/3.27") return;

  // 8810 is one BAS account but two declaration fields:
  // debit balance = avsättning/kostnad -> 3.22
  // credit balance = återföring/intäkt -> 3.21
  if (mapping.ink2rField === "3.21/3.22") {
    if (aggregate.balance > 0) {
      addToField(fields, "f3_22", fullLabel, aggregate.balance, "8810 teckenstyrs: debetsaldo/avsättning till 3.22, kreditsaldo/återföring till 3.21.");
    } else if (aggregate.balance < 0) {
      addToField(fields, "f3_21", fullLabel, Math.abs(aggregate.balance), "8810 teckenstyrs: debetsaldo/avsättning till 3.22, kreditsaldo/återföring till 3.21.");
    }
    return;
  }

  const fieldId = fieldIdFromInk2rField(mapping.ink2rField);
  if (!fieldId) return;

  addToField(fields, fieldId, fullLabel, aggregate.balance);
}

function get(fields: Record<string, FieldResult>, id: string): number {
  return fields[id]?.value ?? 0;
}

function buildIncomeStatementResult(fields: Record<string, FieldResult>): Pick<Record<string, FieldResult>, "f3_26" | "f3_27"> {
  const intakter = get(fields, "f3_1") + get(fields, "f3_2") + get(fields, "f3_3") + get(fields, "f3_4");
  const kostnader =
    get(fields, "f3_5") +
    get(fields, "f3_6") +
    get(fields, "f3_7") +
    get(fields, "f3_8") +
    get(fields, "f3_9") +
    get(fields, "f3_10") +
    get(fields, "f3_11");

  const finansiellaPoster =
    get(fields, "f3_12") +
    get(fields, "f3_13") +
    get(fields, "f3_14") +
    get(fields, "f3_15") +
    get(fields, "f3_16") -
    get(fields, "f3_17") -
    get(fields, "f3_18");

  const koncernbidrag = get(fields, "f3_20") - get(fields, "f3_19");
  const bokslutsdispositioner = get(fields, "f3_21") - get(fields, "f3_22") + get(fields, "f3_23") + get(fields, "f3_24");
  const skatt = get(fields, "f3_25");

  const netto = intakter - kostnader + finansiellaPoster + koncernbidrag + bokslutsdispositioner - skatt;

  const breakdown: BreakdownEntry[] = [
    { label: "Rörelseintäkter (3.1–3.4)", amount: intakter },
    { label: "− Rörelsekostnader (3.5–3.11)", amount: -kostnader },
    { label: "± Finansiella poster (3.12–3.18)", amount: finansiellaPoster },
    { label: "± Koncernbidrag (3.19/3.20)", amount: koncernbidrag },
    { label: "± Bokslutsdispositioner (3.21–3.24)", amount: bokslutsdispositioner },
    { label: "− Skatt (3.25)", amount: -skatt },
  ];

  return {
    f3_26: netto >= 0
      ? { value: netto, breakdown, source: "formula", note: "Beräknas från INK2R resultaträkning, inte direkt från 899x." }
      : { value: 0, breakdown: [], source: "formula" },
    f3_27: netto < 0
      ? { value: Math.abs(netto), breakdown, source: "formula", note: "Beräknas från INK2R resultaträkning, inte direkt från 899x." }
      : { value: 0, breakdown: [], source: "formula" },
  };
}

function buildTaxAdjustments(fields: Record<string, FieldResult>): Record<string, FieldResult> {
  const aretsResultat = get(fields, "f3_26") - get(fields, "f3_27");

  const f4_1: FieldResult = aretsResultat >= 0
    ? {
        value: aretsResultat,
        breakdown: [
          { label: "3.26 Årets resultat, vinst", amount: get(fields, "f3_26") },
          { label: "− 3.27 Årets resultat, förlust", amount: -get(fields, "f3_27") },
        ],
        source: "formula",
        note: "Hämtas från resultaträkningen (3.26/3.27).",
      }
    : { value: 0, breakdown: [], source: "formula" };

  const f4_2: FieldResult = aretsResultat < 0
    ? {
        value: Math.abs(aretsResultat),
        breakdown: [
          { label: "3.27 Årets resultat, förlust", amount: get(fields, "f3_27") },
          { label: "− 3.26 Årets resultat, vinst", amount: -get(fields, "f3_26") },
        ],
        source: "formula",
        note: "Hämtas från resultaträkningen (3.26/3.27).",
      }
    : { value: 0, breakdown: [], source: "formula" };

  // 4.3a is a tax adjustment: accounting tax expense is added back.
  const f4_3a: FieldResult = {
    value: get(fields, "f3_25"),
    breakdown: [{ label: "3.25 Skatt på årets resultat", amount: get(fields, "f3_25") }],
    source: "formula",
    note: "Återlagd skatt – ej avdragsgill kostnad.",
  };

  const skattemassigtResultat =
    f4_1.value -
    f4_2.value +
    f4_3a.value +
    get(fields, "f4_3b") + get(fields, "f4_3c") -
    get(fields, "f4_4a") - get(fields, "f4_4b") -
    get(fields, "f4_5a") - get(fields, "f4_5b") - get(fields, "f4_5c") +
    get(fields, "f4_6a") + get(fields, "f4_6b") + get(fields, "f4_6c") + get(fields, "f4_6d") + get(fields, "f4_6e") -
    get(fields, "f4_7a") + get(fields, "f4_7b") - get(fields, "f4_7c") + get(fields, "f4_7d") + get(fields, "f4_7e") - get(fields, "f4_7f") -
    get(fields, "f4_8a") + get(fields, "f4_8b") + get(fields, "f4_8c") - get(fields, "f4_8d") +
    get(fields, "f4_9") + get(fields, "f4_10") - get(fields, "f4_11") + get(fields, "f4_12") -
    get(fields, "f4_14a") + get(fields, "f4_14b") + get(fields, "f4_14c");

  const breakdown415: BreakdownEntry[] = [
    { label: "4.1 Årets vinst", amount: f4_1.value },
    { label: "− 4.2 Årets förlust", amount: -f4_2.value },
    { label: "+ 4.3 Bokförda kostnader som inte ska dras av", amount: f4_3a.value + get(fields, "f4_3b") + get(fields, "f4_3c") },
    { label: "− 4.4 Kostnader som ska dras av men inte ingår i resultatet", amount: -(get(fields, "f4_4a") + get(fields, "f4_4b")) },
    { label: "− 4.5 Bokförda intäkter som inte ska tas upp", amount: -(get(fields, "f4_5a") + get(fields, "f4_5b") + get(fields, "f4_5c")) },
    { label: "+ 4.6 Intäkter som ska tas upp men inte ingår i resultatet", amount: get(fields, "f4_6a") + get(fields, "f4_6b") + get(fields, "f4_6c") + get(fields, "f4_6d") + get(fields, "f4_6e") },
    { label: "± 4.7–4.8 Delägarrätter / handelsbolag", amount: -get(fields, "f4_7a") + get(fields, "f4_7b") - get(fields, "f4_7c") + get(fields, "f4_7d") + get(fields, "f4_7e") - get(fields, "f4_7f") - get(fields, "f4_8a") + get(fields, "f4_8b") + get(fields, "f4_8c") - get(fields, "f4_8d") },
    { label: "± 4.9–4.12 Övriga skattemässiga justeringar", amount: get(fields, "f4_9") + get(fields, "f4_10") - get(fields, "f4_11") + get(fields, "f4_12") },
    { label: "± 4.14 Underskott", amount: -get(fields, "f4_14a") + get(fields, "f4_14b") + get(fields, "f4_14c") },
  ];

  const f4_15: FieldResult = skattemassigtResultat >= 0
    ? { value: skattemassigtResultat, breakdown: breakdown415, source: "formula", note: "Bokfört resultat ± skattemässiga justeringar." }
    : { value: 0, breakdown: [], source: "formula" };

  const f4_16: FieldResult = skattemassigtResultat < 0
    ? { value: Math.abs(skattemassigtResultat), breakdown: breakdown415, source: "formula", note: "Bokfört resultat ± skattemässiga justeringar." }
    : { value: 0, breakdown: [], source: "formula" };

  const f1_1: FieldResult = {
    value: f4_15.value,
    breakdown: [{ label: "4.15 Överskott", amount: f4_15.value }],
    source: "formula",
    note: "Hämtas från 4.15.",
  };

  const f1_2: FieldResult = {
    value: f4_16.value,
    breakdown: [{ label: "4.16 Underskott", amount: f4_16.value }],
    source: "formula",
    note: "Hämtas från 4.16.",
  };

  return { f1_1, f1_2, f4_1, f4_2, f4_3a, f4_15, f4_16 };
}

export function calculateDeclarationFields(vouchers: Voucher[], accounts: BASAccount[]): Record<string, FieldResult> {
  const fields: Record<string, FieldResult> = {};

  aggregateVoucherAccounts(vouchers, accounts).forEach((aggregate) => {
    addMappedAccount(fields, aggregate);
  });

  // 3.26/3.27 must exist before 4.1/4.2/4.15/4.16 are calculated.
  Object.assign(fields, buildIncomeStatementResult(fields));
  Object.assign(fields, buildTaxAdjustments(fields));

  return fields;
}

export function formatSEK(value: number): string {
  return new Intl.NumberFormat("sv-SE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}
