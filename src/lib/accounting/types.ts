// Core accounting types for Swedish BAS chart of accounts

export type AccountClass = 
  | 'assets'           // 1xxx
  | 'equity_liabilities' // 2xxx
  | 'revenue'          // 3xxx
  | 'expenses';        // 4-8xxx

export interface BASAccount {
  code: string;
  name: string;
  class: AccountClass;
  description?: string;
}

export interface VoucherLine {
  id: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  description?: string;
}

export interface Voucher {
  id: string;
  voucherNumber: number;
  date: string;
  description: string;
  lines: VoucherLine[];
  createdAt: string;
  posted: boolean;
}

export interface AccountStatement {
  accountCode: string;
  accountName: string;
  entries: AccountStatementEntry[];
}

export interface AccountStatementEntry {
  date: string;
  voucherNumber: number;
  description: string;
  debit: number;
  credit: number;
  balance: number;
}

export interface GeneralLedgerEntry {
  accountCode: string;
  accountName: string;
  totalDebit: number;
  totalCredit: number;
  balance: number;
}

export interface TrialBalance {
  entries: TrialBalanceEntry[];
  totalDebit: number;
  totalCredit: number;
}

export interface TrialBalanceEntry {
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
}

export interface IncomeStatementSection {
  title: string;
  accounts: {
    code: string;
    name: string;
    amount: number;
  }[];
  total: number;
}

export interface IncomeStatement {
  revenue: IncomeStatementSection;
  expenses: IncomeStatementSection;
  netResult: number;
  period: string;
}

export interface BalanceSheetSection {
  title: string;
  accounts: {
    code: string;
    name: string;
    amount: number;
  }[];
  total: number;
}

export interface BalanceSheet {
  assets: BalanceSheetSection;
  equityAndLiabilities: BalanceSheetSection;
  isBalanced: boolean;
  period: string;
}

export interface Periodization {
  id: string;
  type: 'prepaid_expense' | 'accrued_expense' | 'prepaid_income' | 'accrued_income';
  sourceAccountCode: string;
  targetAccountCode: string;
  amount: number;
  startDate: string;
  endDate: string;
  description: string;
  originalVoucherId: string;
  reversalVoucherId?: string;
}

export interface YearEndClosing {
  fiscalYear: string;
  incomeStatementResult: number;
  closingVoucherId: string;
  closedAt: string;
}

// Helper to get account class from code
export function getAccountClass(code: string): AccountClass {
  const firstDigit = parseInt(code.charAt(0), 10);
  if (firstDigit === 1) return 'assets';
  if (firstDigit === 2) return 'equity_liabilities';
  if (firstDigit === 3) return 'revenue';
  return 'expenses'; // 4-8
}

// Helper to check if balance increases on debit side
export function balanceIncreasesOnDebit(code: string): boolean {
  const accountClass = getAccountClass(code);
  return accountClass === 'assets' || accountClass === 'expenses';
}

// Helper to calculate balance for an account
export function calculateAccountBalance(
  code: string,
  totalDebit: number,
  totalCredit: number
): number {
  if (balanceIncreasesOnDebit(code)) {
    return totalDebit - totalCredit;
  }
  return totalCredit - totalDebit;
}

// Voucher validation
export function validateVoucher(voucher: Partial<Voucher>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!voucher.date) {
    errors.push('Voucher date is required');
  }

  if (!voucher.description?.trim()) {
    errors.push('Voucher description is required');
  }

  if (!voucher.lines || voucher.lines.length < 2) {
    errors.push('At least two voucher lines are required');
  }

  const totalDebit = voucher.lines?.reduce((sum, line) => sum + (line.debit || 0), 0) || 0;
  const totalCredit = voucher.lines?.reduce((sum, line) => sum + (line.credit || 0), 0) || 0;

  if (Math.abs(totalDebit - totalCredit) > 0.001) {
    errors.push(`Voucher is not balanced. Debit: ${totalDebit.toFixed(2)}, Credit: ${totalCredit.toFixed(2)}`);
  }

  voucher.lines?.forEach((line, index) => {
    if (!line.accountCode) {
      errors.push(`Line ${index + 1}: Account is required`);
    }
    if (line.debit === 0 && line.credit === 0) {
      errors.push(`Line ${index + 1}: Either debit or credit must have a value`);
    }
    if (line.debit > 0 && line.credit > 0) {
      errors.push(`Line ${index + 1}: Cannot have both debit and credit on same line`);
    }
    if (line.debit < 0 || line.credit < 0) {
      errors.push(`Line ${index + 1}: Amounts must be positive`);
    }
  });

  return { valid: errors.length === 0, errors };
}
