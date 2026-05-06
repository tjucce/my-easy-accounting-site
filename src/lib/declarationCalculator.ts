// Declaration field calculator
// Maps INK2R / INK2S / sida 1 fields to BAS accounts via exact BAS 2026 -> INK2 mapping.
//
// Viktigt:
// - Alla fältvärden som visas i deklarationen hålls som positiva belopp i `value`.
// - Beräkningar använder `signedValue`, dvs deklarationens teckenlogik:
//   plusfält = positiv effekt, minusfält = negativ effekt, ±-fält = plus/minus beroende på nettot.
// - Det gör att UI:t kan visa belopp utan minustecken samtidigt som årets resultat och INK2S räknas rätt.

import type { Voucher } from "@/contexts/AccountingContexts";
import type { BASAccount } from "@/lib/bas-accounts";
import { calculateBalance, getAccountClass } from "@/lib/bas-accounts";
import { INK2_ACCOUNT_MAPPING_2026 } from "@/lib/ink2Mapping2026";

export interface BreakdownEntry {
  label: string;
  amount: number;
}

export interface FieldResult {
  /** Positivt belopp för visning i deklarationsrutan. */
  value: number;
  /** Belopp med deklarationens faktiska beräkningstecken. */
  signedValue?: number;
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

type FieldSign = "+" | "-" | "±" | "none";

const FIELD_SIGNS: Record<string, FieldSign> = {
  // Sida 1
  f1_1: "+",
  f1_2: "-",

  // INK2R resultaträkning
  f3_1: "+",
  f3_2: "+",
  f3_3: "+",
  f3_4: "+",
  f3_5: "-",
  f3_6: "-",
  f3_7: "-",
  f3_8: "-",
  f3_9: "-",
  f3_10: "-",
  f3_11: "-",
  f3_12: "±",
  f3_13: "±",
  f3_14: "±",
  f3_15: "±",
  f3_16: "+",
  f3_17: "-",
  f3_18: "-",
  f3_19: "-",
  f3_20: "+",
  f3_21: "+",
  f3_22: "-",
  f3_23: "±",
  f3_24: "±",
  f3_25: "-",
  f3_26: "+",
  f3_27: "-",

  // INK2S
  f4_1: "+",
  f4_2: "-",
  f4_3a: "+",
  f4_3b: "+",
  f4_3c: "+",
  f4_4a: "-",
  f4_4b: "-",
  f4_5a: "-",
  f4_5b: "-",
  f4_5c: "-",
  f4_6a: "+",
  f4_6b: "+",
  f4_6c: "+",
  f4_6d: "+",
  f4_6e: "+",
  f4_7a: "-",
  f4_7b: "+",
  f4_7c: "-",
  f4_7d: "+",
  f4_7e: "+",
  f4_7f: "-",
  f4_8a: "-",
  f4_8b: "+",
  f4_8c: "+",
  f4_8d: "-",
  f4_9: "±",
  f4_10: "±",
  f4_11: "-",
  f4_12: "+",
  f4_14a: "-",
  f4_14b: "+",
  f4_14c: "+",
  f4_15: "+",
  f4_16: "-",
};

const PLUS_MINUS_FIELD_IDS = Object.entries(FIELD_SIGNS)
  .filter(([, sign]) => sign === "±")
  .map(([fieldId]) => fieldId);

function fieldIdFromInk2rField(ink2rField: string): string | null {
  if (!ink2rField || ink2rField.includes("/")) return null;
  return `f${ink2rField.replace(".", "_")}`;
}

function getFieldSign(fieldId: string): FieldSign {
  return FIELD_SIGNS[fieldId] ?? "none";
}

function getOrCreateField(
  fields: Record<string, FieldResult>,
  id: string,
  note = "Summeras från exakt BAS 2026 → INK2-koppling."
): FieldResult {
  if (!fields[id]) {
    fields[id] = { value: 0, signedValue: 0, breakdown: [], source: "accounts", note };
  }
  return fields[id];
}

function normalizeForDisplay(field: FieldResult): void {
  field.value = Math.abs(field.signedValue ?? field.value ?? 0);
}

function signedAmountFromVisibleValue(fieldId: string, value: number): number {
  const absValue = Math.abs(value);

  switch (getFieldSign(fieldId)) {
    case "-":
      return -absValue;
    case "+":
      return absValue;
    case "±":
      return value;
    case "none":
    default:
      return value;
  }
}

function getSigned(fields: Record<string, FieldResult>, id: string): number {
  const field = fields[id];
  if (!field) return 0;

  if (typeof field.signedValue === "number") {
    return field.signedValue;
  }

  return signedAmountFromVisibleValue(id, field.value ?? 0);
}

function getVisible(fields: Record<string, FieldResult>, id: string): number {
  return Math.abs(fields[id]?.value ?? 0);
}

function addSignedToField(
  fields: Record<string, FieldResult>,
  fieldId: string,
  label: string,
  signedAmount: number,
  note?: string
): void {
  if (Math.abs(signedAmount) < 0.005) return;

  const field = getOrCreateField(fields, fieldId, note);
  field.signedValue = (field.signedValue ?? signedAmountFromVisibleValue(fieldId, field.value)) + signedAmount;
  normalizeForDisplay(field);
  field.breakdown.push({ label, amount: signedAmount });
}

function createFormulaField(
  fieldId: string,
  signedAmount: number,
  breakdown: BreakdownEntry[],
  note?: string
): FieldResult {
  const signedValue = signedAmountFromVisibleValue(fieldId, signedAmount);

  return {
    value: Math.abs(signedValue),
    signedValue,
    breakdown,
    source: "formula",
    note,
  };
}

function aggregateVoucherAccounts(vouchers: Voucher[], accounts: BASAccount[]): AccountAggregate[] {
  const totals = new Map<string, { debit: number; credit: number }>();

  vouchers.forEach((voucher) => {
    voucher.lines.forEach((line) => {
      const accountNumber = line.accountNumber?.trim();
      if (!accountNumber || !/^\d{4}$/.test(accountNumber)) return;

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
      const mapping = INK2_ACCOUNT_MAPPING_2026[accountNumber];

      return {
        accountNumber,
        accountName: account?.name ?? mapping?.accountName ?? mapping?.ink2rLabel ?? "Okänt konto",
        totalDebit: debit,
        totalCredit: credit,
        balance: calculateBalance(accClass, debit, credit),
      };
    })
    .sort((a, b) => a.accountNumber.localeCompare(b.accountNumber));
}

function accountNaturalAmount(aggregate: AccountAggregate, fieldId: string): number {
  const debitMinusCredit = aggregate.totalDebit - aggregate.totalCredit;
  const creditMinusDebit = aggregate.totalCredit - aggregate.totalDebit;
  const sign = getFieldSign(fieldId);

  // Resultaträkningens plusfält ska bidra positivt när kontot har ett normalt intäkts-/kreditsaldo.
  if (sign === "+") {
    if (fieldId.startsWith("f3_") && aggregate.accountNumber.startsWith("8")) {
      return creditMinusDebit;
    }
    return aggregate.balance;
  }

  // Resultaträkningens minusfält ska bidra negativt när kontot har ett normalt kostnads-/debetsaldo.
  if (sign === "-") {
    if (fieldId.startsWith("f3_") && aggregate.accountNumber.startsWith("8")) {
      return -debitMinusCredit;
    }
    return -Math.abs(aggregate.balance);
  }

  // ±-fält måste behålla nettots riktning. För 8-konton betyder kredit positivt resultat och debet negativt resultat.
  if (sign === "±") {
    if (aggregate.accountNumber.startsWith("8")) {
      return creditMinusDebit;
    }
    return aggregate.balance;
  }

  // Balansräkningen använder kontoklassens naturliga saldo.
  return aggregate.balance;
}

function addMappedAccount(fields: Record<string, FieldResult>, aggregate: AccountAggregate): void {
  const mapping = INK2_ACCOUNT_MAPPING_2026[aggregate.accountNumber];
  if (!mapping?.ink2rField) return;

  const baseLabel = `${aggregate.accountNumber} ${aggregate.accountName}`;
  const fullLabel = mapping.sruCodes ? `${baseLabel} · SRU ${mapping.sruCodes}` : baseLabel;

  // 8990/8999 ska inte summeras direkt till 3.26/3.27.
  // 3.26/3.27 beräknas från hela resultaträkningen längre ned för att undvika dubbelräkning.
  if (mapping.ink2rField === "3.26/3.27") return;

  // 8810 är ett specialkonto: kreditnetto är återföring (+ 3.21), debetnetto är avsättning (- 3.22).
  if (mapping.ink2rField === "3.21/3.22") {
    const signedNet = aggregate.totalCredit - aggregate.totalDebit;

    if (signedNet > 0) {
      addSignedToField(
        fields,
        "f3_21",
        fullLabel,
        signedNet,
        "8810 teckenstyrs: kreditnetto/återföring till 3.21, debetnetto/avsättning till 3.22."
      );
    } else if (signedNet < 0) {
      addSignedToField(
        fields,
        "f3_22",
        fullLabel,
        signedNet,
        "8810 teckenstyrs: kreditnetto/återföring till 3.21, debetnetto/avsättning till 3.22."
      );
    }
    return;
  }

  const fieldId = fieldIdFromInk2rField(mapping.ink2rField);
  if (!fieldId) return;

  const signedAmount = accountNaturalAmount(aggregate, fieldId);
  addSignedToField(fields, fieldId, fullLabel, signedAmount);
}

function buildIncomeStatementResult(fields: Record<string, FieldResult>): Record<"f3_26" | "f3_27", FieldResult> {
  const rorelseintakter =
    getSigned(fields, "f3_1") +
    getSigned(fields, "f3_2") +
    getSigned(fields, "f3_3") +
    getSigned(fields, "f3_4");

  const rorelsekostnader =
    getSigned(fields, "f3_5") +
    getSigned(fields, "f3_6") +
    getSigned(fields, "f3_7") +
    getSigned(fields, "f3_8") +
    getSigned(fields, "f3_9") +
    getSigned(fields, "f3_10") +
    getSigned(fields, "f3_11");

  const finansiellaPoster =
    getSigned(fields, "f3_12") +
    getSigned(fields, "f3_13") +
    getSigned(fields, "f3_14") +
    getSigned(fields, "f3_15") +
    getSigned(fields, "f3_16") +
    getSigned(fields, "f3_17") +
    getSigned(fields, "f3_18");

  const koncernbidrag = getSigned(fields, "f3_19") + getSigned(fields, "f3_20");

  const bokslutsdispositioner =
    getSigned(fields, "f3_21") +
    getSigned(fields, "f3_22") +
    getSigned(fields, "f3_23") +
    getSigned(fields, "f3_24");

  const skatt = getSigned(fields, "f3_25");
  const netto = rorelseintakter + rorelsekostnader + finansiellaPoster + koncernbidrag + bokslutsdispositioner + skatt;

  const breakdown: BreakdownEntry[] = [
    { label: "Rörelseintäkter (3.1–3.4)", amount: rorelseintakter },
    { label: "Rörelsekostnader (3.5–3.11)", amount: rorelsekostnader },
    { label: "Finansiella poster (3.12–3.18)", amount: finansiellaPoster },
    { label: "Koncernbidrag (3.19/3.20)", amount: koncernbidrag },
    { label: "Bokslutsdispositioner (3.21–3.24)", amount: bokslutsdispositioner },
    { label: "Skatt (3.25)", amount: skatt },
  ];

  return {
    f3_26: netto >= 0
      ? createFormulaField("f3_26", netto, breakdown, "Beräknas från INK2R med deklarationens teckenlogik.")
      : createFormulaField("f3_26", 0, [], "Beräknas från INK2R med deklarationens teckenlogik."),
    f3_27: netto < 0
      ? createFormulaField("f3_27", netto, breakdown, "Beräknas från INK2R med deklarationens teckenlogik.")
      : createFormulaField("f3_27", 0, [], "Beräknas från INK2R med deklarationens teckenlogik."),
  };
}

function buildTaxAdjustments(fields: Record<string, FieldResult>): Record<string, FieldResult> {
  const aretsResultat = getSigned(fields, "f3_26") + getSigned(fields, "f3_27");

  const f4_1: FieldResult = aretsResultat >= 0
    ? createFormulaField(
        "f4_1",
        aretsResultat,
        [
          { label: "3.26 Årets resultat, vinst", amount: getSigned(fields, "f3_26") },
          { label: "3.27 Årets resultat, förlust", amount: getSigned(fields, "f3_27") },
        ],
        "Hämtas från resultaträkningen (3.26/3.27)."
      )
    : createFormulaField("f4_1", 0, [], "Hämtas från resultaträkningen (3.26/3.27).");

  const f4_2: FieldResult = aretsResultat < 0
    ? createFormulaField(
        "f4_2",
        aretsResultat,
        [
          { label: "3.26 Årets resultat, vinst", amount: getSigned(fields, "f3_26") },
          { label: "3.27 Årets resultat, förlust", amount: getSigned(fields, "f3_27") },
        ],
        "Hämtas från resultaträkningen (3.26/3.27)."
      )
    : createFormulaField("f4_2", 0, [], "Hämtas från resultaträkningen (3.26/3.27).");

  // 4.3a lägger tillbaka bokförd skatt. Den ska därför vara plus i INK2S även om 3.25 var ett minusfält i INK2R.
  const f4_3a: FieldResult = createFormulaField(
    "f4_3a",
    getVisible(fields, "f3_25"),
    [{ label: "3.25 Skatt på årets resultat", amount: getVisible(fields, "f3_25") }],
    "Återlagd skatt – ej avdragsgill kostnad."
  );

  const temporaryFields: Record<string, FieldResult> = {
    ...fields,
    f4_1,
    f4_2,
    f4_3a,
  };

  const delagarratter =
    getSigned(temporaryFields, "f4_7a") +
    getSigned(temporaryFields, "f4_7b") +
    getSigned(temporaryFields, "f4_7c") +
    getSigned(temporaryFields, "f4_7d") +
    getSigned(temporaryFields, "f4_7e") +
    getSigned(temporaryFields, "f4_7f");

  const handelsbolag =
    getSigned(temporaryFields, "f4_8a") +
    getSigned(temporaryFields, "f4_8b") +
    getSigned(temporaryFields, "f4_8c") +
    getSigned(temporaryFields, "f4_8d");

  const ovrigaJusteringar =
    getSigned(temporaryFields, "f4_9") +
    getSigned(temporaryFields, "f4_10") +
    getSigned(temporaryFields, "f4_11") +
    getSigned(temporaryFields, "f4_12");

  const underskott =
    getSigned(temporaryFields, "f4_14a") +
    getSigned(temporaryFields, "f4_14b") +
    getSigned(temporaryFields, "f4_14c");

  const skattemassigtResultat =
    getSigned(temporaryFields, "f4_1") +
    getSigned(temporaryFields, "f4_2") +
    getSigned(temporaryFields, "f4_3a") +
    getSigned(temporaryFields, "f4_3b") +
    getSigned(temporaryFields, "f4_3c") +
    getSigned(temporaryFields, "f4_4a") +
    getSigned(temporaryFields, "f4_4b") +
    getSigned(temporaryFields, "f4_5a") +
    getSigned(temporaryFields, "f4_5b") +
    getSigned(temporaryFields, "f4_5c") +
    getSigned(temporaryFields, "f4_6a") +
    getSigned(temporaryFields, "f4_6b") +
    getSigned(temporaryFields, "f4_6c") +
    getSigned(temporaryFields, "f4_6d") +
    getSigned(temporaryFields, "f4_6e") +
    delagarratter +
    handelsbolag +
    ovrigaJusteringar +
    underskott;

  const breakdown415: BreakdownEntry[] = [
    { label: "4.1 Årets resultat, vinst", amount: getSigned(temporaryFields, "f4_1") },
    { label: "4.2 Årets resultat, förlust", amount: getSigned(temporaryFields, "f4_2") },
    {
      label: "4.3 Bokförda kostnader som inte ska dras av",
      amount: getSigned(temporaryFields, "f4_3a") + getSigned(temporaryFields, "f4_3b") + getSigned(temporaryFields, "f4_3c"),
    },
    {
      label: "4.4 Kostnader som ska dras av men som inte ingår i resultatet",
      amount: getSigned(temporaryFields, "f4_4a") + getSigned(temporaryFields, "f4_4b"),
    },
    {
      label: "4.5 Bokförda intäkter som inte ska tas upp",
      amount: getSigned(temporaryFields, "f4_5a") + getSigned(temporaryFields, "f4_5b") + getSigned(temporaryFields, "f4_5c"),
    },
    {
      label: "4.6 Intäkter som ska tas upp men inte ingår i resultatet",
      amount:
        getSigned(temporaryFields, "f4_6a") +
        getSigned(temporaryFields, "f4_6b") +
        getSigned(temporaryFields, "f4_6c") +
        getSigned(temporaryFields, "f4_6d") +
        getSigned(temporaryFields, "f4_6e"),
    },
    { label: "4.7 Avyttring av delägarrätter", amount: delagarratter },
    { label: "4.8 Andel i handelsbolag", amount: handelsbolag },
    { label: "4.9–4.12 Övriga skattemässiga justeringar", amount: ovrigaJusteringar },
    { label: "4.14 Underskott", amount: underskott },
  ];

  const f4_15: FieldResult = skattemassigtResultat >= 0
    ? createFormulaField("f4_15", skattemassigtResultat, breakdown415, "Bokfört resultat summerat med INK2S-fältens teckenlogik.")
    : createFormulaField("f4_15", 0, [], "Bokfört resultat summerat med INK2S-fältens teckenlogik.");

  const f4_16: FieldResult = skattemassigtResultat < 0
    ? createFormulaField("f4_16", skattemassigtResultat, breakdown415, "Bokfört resultat summerat med INK2S-fältens teckenlogik.")
    : createFormulaField("f4_16", 0, [], "Bokfört resultat summerat med INK2S-fältens teckenlogik.");

  const f1_1: FieldResult = createFormulaField(
    "f1_1",
    getSigned({ f4_15 }, "f4_15"),
    [{ label: "4.15 Överskott", amount: getSigned({ f4_15 }, "f4_15") }],
    "Hämtas från 4.15."
  );

  const f1_2: FieldResult = createFormulaField(
    "f1_2",
    getSigned({ f4_16 }, "f4_16"),
    [{ label: "4.16 Underskott", amount: getSigned({ f4_16 }, "f4_16") }],
    "Hämtas från 4.16."
  );

  return { f1_1, f1_2, f4_1, f4_2, f4_3a, f4_15, f4_16 };
}

function addPlusMinusAliases(fields: Record<string, FieldResult>): void {
  PLUS_MINUS_FIELD_IDS.forEach((fieldId) => {
    const field = fields[fieldId];
    if (!field) return;

    const signedValue = getSigned(fields, fieldId);
    const plusId = `${fieldId}_plus`;
    const minusId = `${fieldId}_minus`;

    fields[plusId] = signedValue > 0
      ? {
          ...field,
          value: Math.abs(signedValue),
          signedValue,
          note: `${field.note ?? ""} Visas i plusfältet.`.trim(),
        }
      : {
          value: 0,
          signedValue: 0,
          breakdown: [],
          source: field.source,
          note: `${field.note ?? ""} Plusfält för ${fieldId}.`.trim(),
        };

    fields[minusId] = signedValue < 0
      ? {
          ...field,
          value: Math.abs(signedValue),
          signedValue,
          note: `${field.note ?? ""} Visas i minusfältet.`.trim(),
        }
      : {
          value: 0,
          signedValue: 0,
          breakdown: [],
          source: field.source,
          note: `${field.note ?? ""} Minusfält för ${fieldId}.`.trim(),
        };
  });
}

export function calculateDeclarationFields(vouchers: Voucher[], accounts: BASAccount[]): Record<string, FieldResult> {
  const fields: Record<string, FieldResult> = {};

  aggregateVoucherAccounts(vouchers, accounts).forEach((aggregate) => {
    addMappedAccount(fields, aggregate);
  });

  // 3.26/3.27 måste skapas innan 4.1/4.2/4.15/4.16 räknas fram.
  Object.assign(fields, buildIncomeStatementResult(fields));
  Object.assign(fields, buildTaxAdjustments(fields));

  // Bakåtkompatibelt stöd för UI som delar ±-fält i separata plus/minus-fält.
  // Parentfältet finns fortfarande kvar, men plus/minus-alias finns också: t.ex. f3_12_plus och f3_12_minus.
  addPlusMinusAliases(fields);

  return fields;
}

export function formatSEK(value: number): string {
  return new Intl.NumberFormat("sv-SE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}
