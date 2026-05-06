// Declaration field calculator
// Maps INK2R / INK2S / sida 1 fields to BAS accounts via exact BAS 2026 -> INK2 mapping.
// Important:
// - Formulas use declaration sign logic: + rows are added and − rows are subtracted.
// - Former ± fields are split into separate _plus and _minus calculation rows.
// - The calculator does not force UI/display values to be absolute; display formatting belongs in the page/component layer.

import type { Voucher } from "@/contexts/AccountingContexts";
import type { BASAccount } from "@/lib/bas-accounts";
import { calculateBalance, getAccountClass } from "@/lib/bas-accounts";
import { INK2_ACCOUNT_MAPPING_2026 } from "@/lib/ink2Mapping2026";

export interface BreakdownEntry {
  label: string;
  amount: number;
}

export interface FieldResult {
  /**
   * Stored field value. It may be positive or negative depending on source/calculation.
   * Formula code below applies declaration row signs explicitly and does not rely on UI formatting.
   */
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

interface PendingSignedGroup {
  value: number;
  breakdown: BreakdownEntry[];
  note: string;
}

const EPSILON = 0.005;

const INK2R_PLUS_MINUS_FIELDS = new Set(["3.12", "3.13", "3.14", "3.15", "3.23", "3.24"]);

const INK2R_RESULT_PLUS_FIELDS = new Set([
  "3.1",
  "3.2",
  "3.3",
  "3.4",
  "3.16",
  "3.20",
  "3.21",
  "3.26",
]);

const INK2R_RESULT_MINUS_FIELDS = new Set([
  "3.5",
  "3.6",
  "3.7",
  "3.8",
  "3.9",
  "3.10",
  "3.11",
  "3.17",
  "3.18",
  "3.19",
  "3.22",
  "3.25",
  "3.27",
]);

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
  if (Math.abs(amount) < EPSILON) return;

  const field = getOrCreateField(fields, fieldId, note);
  field.value += amount;
  field.breakdown.push({ label, amount });
}

function setFormulaField(
  value: number,
  breakdown: BreakdownEntry[],
  note?: string
): FieldResult {
  return {
    value: Math.abs(value) < EPSILON ? 0 : value,
    breakdown,
    source: "formula",
    note,
  };
}

function emptyFormulaField(): FieldResult {
  return { value: 0, breakdown: [], source: "formula" };
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
        accountName:
          account?.name ??
          INK2_ACCOUNT_MAPPING_2026[accountNumber]?.accountName ??
          INK2_ACCOUNT_MAPPING_2026[accountNumber]?.ink2rLabel ??
          "Okänt konto",
        totalDebit: debit,
        totalCredit: credit,
        balance: calculateBalance(accClass, debit, credit),
      };
    })
    .sort((a, b) => a.accountNumber.localeCompare(b.accountNumber));
}

function creditMinusDebit(aggregate: AccountAggregate): number {
  return aggregate.totalCredit - aggregate.totalDebit;
}

function debitMinusCredit(aggregate: AccountAggregate): number {
  return aggregate.totalDebit - aggregate.totalCredit;
}

function signedAmountForMapping(aggregate: AccountAggregate, ink2rField: string, amountRule?: string): number {
  const rule = (amountRule ?? "").toLowerCase();

  if (ink2rField.startsWith("2.")) {
    return aggregate.balance;
  }

  // Former ± result fields must be netted using result logic:
  // credit/income = plus, debit/cost/loss = minus.
  if (INK2R_PLUS_MINUS_FIELDS.has(ink2rField) || ink2rField === "3.21/3.22") {
    return creditMinusDebit(aggregate);
  }

  if (rule.includes("kreditsaldo minus debetsaldo")) {
    return creditMinusDebit(aggregate);
  }

  if (rule.includes("debetsaldo minus kreditsaldo")) {
    return debitMinusCredit(aggregate);
  }

  if (INK2R_RESULT_PLUS_FIELDS.has(ink2rField)) {
    return creditMinusDebit(aggregate);
  }

  if (INK2R_RESULT_MINUS_FIELDS.has(ink2rField)) {
    return debitMinusCredit(aggregate);
  }

  return aggregate.balance;
}

function addToPendingSignedGroup(
  groups: Record<string, PendingSignedGroup>,
  groupId: string,
  label: string,
  amount: number,
  note: string
): void {
  if (Math.abs(amount) < EPSILON) return;

  if (!groups[groupId]) {
    groups[groupId] = { value: 0, breakdown: [], note };
  }

  groups[groupId].value += amount;
  groups[groupId].breakdown.push({ label, amount });
}

function flushPendingSignedGroups(
  fields: Record<string, FieldResult>,
  groups: Record<string, PendingSignedGroup>
): void {
  Object.entries(groups).forEach(([groupId, group]) => {
    if (Math.abs(group.value) < EPSILON) return;

    if (groupId === "3.21/3.22") {
      const fieldId = group.value >= 0 ? "f3_21" : "f3_22";
      fields[fieldId] = {
        value: group.value,
        breakdown: group.breakdown,
        source: "accounts",
        note: group.note,
      };
      return;
    }

    if (INK2R_PLUS_MINUS_FIELDS.has(groupId)) {
      const baseFieldId = fieldIdFromInk2rField(groupId);
      if (!baseFieldId) return;

      const fieldId = group.value >= 0 ? `${baseFieldId}_plus` : `${baseFieldId}_minus`;
      fields[fieldId] = {
        value: group.value,
        breakdown: group.breakdown,
        source: "accounts",
        note: group.note,
      };
    }
  });
}

function addMappedAccount(
  fields: Record<string, FieldResult>,
  signedGroups: Record<string, PendingSignedGroup>,
  aggregate: AccountAggregate
): void {
  const mapping = INK2_ACCOUNT_MAPPING_2026[aggregate.accountNumber];
  if (!mapping?.ink2rField) return;

  const baseLabel = `${aggregate.accountNumber} ${aggregate.accountName}`;
  const fullLabel = mapping.sruCodes ? `${baseLabel} · SRU ${mapping.sruCodes}` : baseLabel;

  // 8990/8999 should not be booked directly into 3.26/3.27 here.
  // Those fields are calculated from the whole income statement below to avoid double-counting.
  if (mapping.ink2rField === "3.26/3.27") return;

  const signedAmount = signedAmountForMapping(aggregate, mapping.ink2rField, mapping.amountRule);

  // 8810 is one BAS account but two declaration fields:
  // net credit = återföring/intäkt -> 3.21
  // net debit   = avsättning/kostnad -> 3.22
  if (mapping.ink2rField === "3.21/3.22") {
    addToPendingSignedGroup(
      signedGroups,
      "3.21/3.22",
      fullLabel,
      signedAmount,
      "8810 nettas först. Kreditsaldo/återföring hamnar i 3.21, debetsaldo/avsättning hamnar i 3.22."
    );
    return;
  }

  // Former ± fields are netted first, then placed either in _plus or _minus.
  // This avoids showing both a plus and minus value when the field has one net result.
  if (INK2R_PLUS_MINUS_FIELDS.has(mapping.ink2rField)) {
    addToPendingSignedGroup(
      signedGroups,
      mapping.ink2rField,
      fullLabel,
      signedAmount,
      `${mapping.ink2rField} nettas först. Positivt netto hamnar i plusraden, negativt netto hamnar i minusraden.`
    );
    return;
  }

  const fieldId = fieldIdFromInk2rField(mapping.ink2rField);
  if (!fieldId) return;

  addToField(fields, fieldId, fullLabel, signedAmount);
}

function getRaw(fields: Record<string, FieldResult>, id: string): number {
  return fields[id]?.value ?? 0;
}

function declarationAmount(fields: Record<string, FieldResult>, id: string): number {
  // Declaration formulas use the amount in the field independent of how the UI chooses to render signs.
  return Math.abs(getRaw(fields, id));
}

function amount(fields: Record<string, FieldResult>, id: string): number {
  return declarationAmount(fields, id);
}

function buildIncomeStatementResult(fields: Record<string, FieldResult>): Pick<Record<string, FieldResult>, "f3_26" | "f3_27"> {
  const netto =
    amount(fields, "f3_1") +
    amount(fields, "f3_2") +
    amount(fields, "f3_3") +
    amount(fields, "f3_4") -
    amount(fields, "f3_5") -
    amount(fields, "f3_6") -
    amount(fields, "f3_7") -
    amount(fields, "f3_8") -
    amount(fields, "f3_9") -
    amount(fields, "f3_10") -
    amount(fields, "f3_11") +
    amount(fields, "f3_12_plus") -
    amount(fields, "f3_12_minus") +
    amount(fields, "f3_13_plus") -
    amount(fields, "f3_13_minus") +
    amount(fields, "f3_14_plus") -
    amount(fields, "f3_14_minus") +
    amount(fields, "f3_15_plus") -
    amount(fields, "f3_15_minus") +
    amount(fields, "f3_16") -
    amount(fields, "f3_17") -
    amount(fields, "f3_18") -
    amount(fields, "f3_19") +
    amount(fields, "f3_20") +
    amount(fields, "f3_21") -
    amount(fields, "f3_22") +
    amount(fields, "f3_23_plus") -
    amount(fields, "f3_23_minus") +
    amount(fields, "f3_24_plus") -
    amount(fields, "f3_24_minus") -
    amount(fields, "f3_25");

  const breakdown: BreakdownEntry[] = [
    { label: "+ 3.1 Nettoomsättning", amount: amount(fields, "f3_1") },
    { label: "+ 3.2 Lagerförändring", amount: amount(fields, "f3_2") },
    { label: "+ 3.3 Aktiverat arbete", amount: amount(fields, "f3_3") },
    { label: "+ 3.4 Övriga rörelseintäkter", amount: amount(fields, "f3_4") },
    { label: "− 3.5 Råvaror och förnödenheter", amount: -amount(fields, "f3_5") },
    { label: "− 3.6 Handelsvaror", amount: -amount(fields, "f3_6") },
    { label: "− 3.7 Övriga externa kostnader", amount: -amount(fields, "f3_7") },
    { label: "− 3.8 Personalkostnader", amount: -amount(fields, "f3_8") },
    { label: "− 3.9 Av- och nedskrivningar", amount: -amount(fields, "f3_9") },
    { label: "− 3.10 Nedskrivningar av omsättningstillgångar", amount: -amount(fields, "f3_10") },
    { label: "− 3.11 Övriga rörelsekostnader", amount: -amount(fields, "f3_11") },
    { label: "+ 3.12 plusrad", amount: amount(fields, "f3_12_plus") },
    { label: "− 3.12 minusrad", amount: -amount(fields, "f3_12_minus") },
    { label: "+ 3.13 plusrad", amount: amount(fields, "f3_13_plus") },
    { label: "− 3.13 minusrad", amount: -amount(fields, "f3_13_minus") },
    { label: "+ 3.14 plusrad", amount: amount(fields, "f3_14_plus") },
    { label: "− 3.14 minusrad", amount: -amount(fields, "f3_14_minus") },
    { label: "+ 3.15 plusrad", amount: amount(fields, "f3_15_plus") },
    { label: "− 3.15 minusrad", amount: -amount(fields, "f3_15_minus") },
    { label: "+ 3.16 Ränteintäkter", amount: amount(fields, "f3_16") },
    { label: "− 3.17 Finansiella nedskrivningar", amount: -amount(fields, "f3_17") },
    { label: "− 3.18 Räntekostnader", amount: -amount(fields, "f3_18") },
    { label: "− 3.19 Lämnade koncernbidrag", amount: -amount(fields, "f3_19") },
    { label: "+ 3.20 Mottagna koncernbidrag", amount: amount(fields, "f3_20") },
    { label: "+ 3.21 Återföring periodiseringsfond", amount: amount(fields, "f3_21") },
    { label: "− 3.22 Avsättning periodiseringsfond", amount: -amount(fields, "f3_22") },
    { label: "+ 3.23 plusrad", amount: amount(fields, "f3_23_plus") },
    { label: "− 3.23 minusrad", amount: -amount(fields, "f3_23_minus") },
    { label: "+ 3.24 plusrad", amount: amount(fields, "f3_24_plus") },
    { label: "− 3.24 minusrad", amount: -amount(fields, "f3_24_minus") },
    { label: "− 3.25 Skatt", amount: -amount(fields, "f3_25") },
  ].filter((entry) => Math.abs(entry.amount) >= EPSILON);

  return {
    f3_26:
      netto >= 0
        ? setFormulaField(netto, breakdown, "Beräknas med deklarationens teckenlogik från INK2R.")
        : emptyFormulaField(),
    f3_27:
      netto < 0
        ? setFormulaField(netto, breakdown, "Beräknas med deklarationens teckenlogik från INK2R.")
        : emptyFormulaField(),
  };
}

function buildTaxAdjustments(fields: Record<string, FieldResult>): Record<string, FieldResult> {
  const aretsResultat = amount(fields, "f3_26") - amount(fields, "f3_27");

  const f4_1: FieldResult =
    aretsResultat >= 0
      ? setFormulaField(
          aretsResultat,
          [
            { label: "+ 3.26 Årets resultat, vinst", amount: amount(fields, "f3_26") },
            { label: "− 3.27 Årets resultat, förlust", amount: -amount(fields, "f3_27") },
          ].filter((entry) => Math.abs(entry.amount) >= EPSILON),
          "Hämtas från 3.26 om årets resultat är vinst."
        )
      : emptyFormulaField();

  const f4_2: FieldResult =
    aretsResultat < 0
      ? setFormulaField(
          aretsResultat,
          [
            { label: "− 3.27 Årets resultat, förlust", amount: -amount(fields, "f3_27") },
            { label: "+ 3.26 Årets resultat, vinst", amount: amount(fields, "f3_26") },
          ].filter((entry) => Math.abs(entry.amount) >= EPSILON),
          "Hämtas från 3.27 om årets resultat är förlust."
        )
      : emptyFormulaField();

  const f4_3a: FieldResult = setFormulaField(
    amount(fields, "f3_25"),
    [{ label: "+ 3.25 Skatt på årets resultat", amount: amount(fields, "f3_25") }].filter((entry) => Math.abs(entry.amount) >= EPSILON),
    "Återlagd skatt – ej avdragsgill kostnad."
  );

  const skattemassigtResultat =
    amount({ f4_1 }, "f4_1") -
    amount({ f4_2 }, "f4_2") +
    amount({ f4_3a }, "f4_3a") +
    amount(fields, "f4_3b") +
    amount(fields, "f4_3c") -
    amount(fields, "f4_4a") -
    amount(fields, "f4_4b") -
    amount(fields, "f4_5a") -
    amount(fields, "f4_5b") -
    amount(fields, "f4_5c") +
    amount(fields, "f4_6a") +
    amount(fields, "f4_6b") +
    amount(fields, "f4_6c") +
    amount(fields, "f4_6d") +
    amount(fields, "f4_6e") -
    amount(fields, "f4_7a") +
    amount(fields, "f4_7b") -
    amount(fields, "f4_7c") +
    amount(fields, "f4_7d") +
    amount(fields, "f4_7e") -
    amount(fields, "f4_7f") -
    amount(fields, "f4_8a") +
    amount(fields, "f4_8b") +
    amount(fields, "f4_8c") -
    amount(fields, "f4_8d") +
    amount(fields, "f4_9_plus") -
    amount(fields, "f4_9_minus") +
    amount(fields, "f4_10_plus") -
    amount(fields, "f4_10_minus") -
    amount(fields, "f4_11") +
    amount(fields, "f4_12") -
    amount(fields, "f4_14a") +
    amount(fields, "f4_14b") +
    amount(fields, "f4_14c");

  const breakdown415: BreakdownEntry[] = [
    { label: "+ 4.1 Årets resultat, vinst", amount: amount({ f4_1 }, "f4_1") },
    { label: "− 4.2 Årets resultat, förlust", amount: -amount({ f4_2 }, "f4_2") },
    { label: "+ 4.3a Skatt på årets resultat", amount: amount({ f4_3a }, "f4_3a") },
    { label: "+ 4.3b Nedskrivning av finansiella tillgångar", amount: amount(fields, "f4_3b") },
    { label: "+ 4.3c Andra bokförda kostnader", amount: amount(fields, "f4_3c") },
    { label: "− 4.4a Lämnade koncernbidrag", amount: -amount(fields, "f4_4a") },
    { label: "− 4.4b Andra ej bokförda kostnader", amount: -amount(fields, "f4_4b") },
    { label: "− 4.5a Ackordsvinster", amount: -amount(fields, "f4_5a") },
    { label: "− 4.5b Utdelning", amount: -amount(fields, "f4_5b") },
    { label: "− 4.5c Andra bokförda intäkter", amount: -amount(fields, "f4_5c") },
    { label: "+ 4.6a Schablonintäkt periodiseringsfonder", amount: amount(fields, "f4_6a") },
    { label: "+ 4.6b Schablonintäkt fondandelar", amount: amount(fields, "f4_6b") },
    { label: "+ 4.6c Mottagna koncernbidrag", amount: amount(fields, "f4_6c") },
    { label: "+ 4.6d Uppräknat belopp vid återföring", amount: amount(fields, "f4_6d") },
    { label: "+ 4.6e Andra ej bokförda intäkter", amount: amount(fields, "f4_6e") },
    { label: "− 4.7a Bokförd vinst", amount: -amount(fields, "f4_7a") },
    { label: "+ 4.7b Bokförd förlust", amount: amount(fields, "f4_7b") },
    { label: "− 4.7c Uppskov kapitalvinst", amount: -amount(fields, "f4_7c") },
    { label: "+ 4.7d Återfört uppskov", amount: amount(fields, "f4_7d") },
    { label: "+ 4.7e Kapitalvinst", amount: amount(fields, "f4_7e") },
    { label: "− 4.7f Kapitalförlust som ska dras av", amount: -amount(fields, "f4_7f") },
    { label: "− 4.8a Bokförd intäkt/vinst", amount: -amount(fields, "f4_8a") },
    { label: "+ 4.8b Skattemässigt överskott", amount: amount(fields, "f4_8b") },
    { label: "+ 4.8c Bokförd kostnad/förlust", amount: amount(fields, "f4_8c") },
    { label: "− 4.8d Skattemässigt underskott", amount: -amount(fields, "f4_8d") },
    { label: "+ 4.9 plusrad", amount: amount(fields, "f4_9_plus") },
    { label: "− 4.9 minusrad", amount: -amount(fields, "f4_9_minus") },
    { label: "+ 4.10 plusrad", amount: amount(fields, "f4_10_plus") },
    { label: "− 4.10 minusrad", amount: -amount(fields, "f4_10_minus") },
    { label: "− 4.11 Skogs-/substansminskningsavdrag", amount: -amount(fields, "f4_11") },
    { label: "+ 4.12 Återföringar vid avyttring av fastighet", amount: amount(fields, "f4_12") },
    { label: "− 4.14a Outnyttjat underskott", amount: -amount(fields, "f4_14a") },
    { label: "+ 4.14b Reduktion av underskott", amount: amount(fields, "f4_14b") },
    { label: "+ 4.14c Reduktion av spärrat underskott", amount: amount(fields, "f4_14c") },
  ].filter((entry) => Math.abs(entry.amount) >= EPSILON);

  const f4_15: FieldResult =
    skattemassigtResultat >= 0
      ? setFormulaField(skattemassigtResultat, breakdown415, "Beräknas med deklarationens teckenlogik från INK2S.")
      : emptyFormulaField();

  const f4_16: FieldResult =
    skattemassigtResultat < 0
      ? setFormulaField(skattemassigtResultat, breakdown415, "Beräknas med deklarationens teckenlogik från INK2S.")
      : emptyFormulaField();

  const f1_1: FieldResult = setFormulaField(f4_15.value, [{ label: "+ 4.15 Överskott", amount: f4_15.value }], "Hämtas från 4.15.");
  const f1_2: FieldResult = setFormulaField(f4_16.value, [{ label: "4.16 Underskott", amount: f4_16.value }], "Hämtas från 4.16.");

  return { f1_1, f1_2, f4_1, f4_2, f4_3a, f4_15, f4_16 };
}

export function calculateDeclarationFields(vouchers: Voucher[], accounts: BASAccount[]): Record<string, FieldResult> {
  const fields: Record<string, FieldResult> = {};
  const signedGroups: Record<string, PendingSignedGroup> = {};

  aggregateVoucherAccounts(vouchers, accounts).forEach((aggregate) => {
    addMappedAccount(fields, signedGroups, aggregate);
  });

  flushPendingSignedGroups(fields, signedGroups);

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
