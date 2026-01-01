import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Voucher, VoucherLine, validateVoucher, Periodization, YearEndClosing } from './types';

// Generate UUID-like ID without external dependency
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

interface AccountingContextType {
  // Vouchers
  vouchers: Voucher[];
  addVoucher: (voucher: Omit<Voucher, 'id' | 'voucherNumber' | 'createdAt' | 'posted'>) => { success: boolean; errors?: string[]; voucher?: Voucher };
  getVoucher: (id: string) => Voucher | undefined;
  getNextVoucherNumber: () => number;
  
  // Periodizations
  periodizations: Periodization[];
  addPeriodization: (periodization: Omit<Periodization, 'id'>) => Periodization;
  
  // Year-end
  yearEndClosings: YearEndClosing[];
  performYearEndClosing: (fiscalYear: string) => { success: boolean; errors?: string[]; closing?: YearEndClosing };
  
  // Calculations (to be replaced by Python backend)
  calculateAccountBalance: (accountCode: string) => { debit: number; credit: number; balance: number };
  getAccountStatement: (accountCode: string) => { date: string; voucherNumber: number; description: string; debit: number; credit: number; balance: number }[];
  getGeneralLedger: () => { accountCode: string; accountName: string; totalDebit: number; totalCredit: number; balance: number }[];
  getTrialBalance: () => { entries: { accountCode: string; accountName: string; debit: number; credit: number }[]; totalDebit: number; totalCredit: number };
  
  // API integration point
  setApiEndpoint: (endpoint: string) => void;
  apiEndpoint: string | null;
}

const AccountingContext = createContext<AccountingContextType | undefined>(undefined);

export function AccountingProvider({ children }: { children: ReactNode }) {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [periodizations, setPeriodizations] = useState<Periodization[]>([]);
  const [yearEndClosings, setYearEndClosings] = useState<YearEndClosing[]>([]);
  const [apiEndpoint, setApiEndpoint] = useState<string | null>(null);

  const getNextVoucherNumber = useCallback(() => {
    if (vouchers.length === 0) return 1;
    return Math.max(...vouchers.map(v => v.voucherNumber)) + 1;
  }, [vouchers]);

  const addVoucher = useCallback((voucherData: Omit<Voucher, 'id' | 'voucherNumber' | 'createdAt' | 'posted'>) => {
    const validation = validateVoucher(voucherData as Partial<Voucher>);
    
    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }

    const newVoucher: Voucher = {
      ...voucherData,
      id: generateId(),
      voucherNumber: getNextVoucherNumber(),
      createdAt: new Date().toISOString(),
      posted: true,
    };

    setVouchers(prev => [...prev, newVoucher]);
    return { success: true, voucher: newVoucher };
  }, [getNextVoucherNumber]);

  const getVoucher = useCallback((id: string) => {
    return vouchers.find(v => v.id === id);
  }, [vouchers]);

  const addPeriodization = useCallback((periodizationData: Omit<Periodization, 'id'>) => {
    const newPeriodization: Periodization = {
      ...periodizationData,
      id: generateId(),
    };
    setPeriodizations(prev => [...prev, newPeriodization]);
    return newPeriodization;
  }, []);

  // Calculate account balance from all vouchers
  const calculateAccountBalance = useCallback((accountCode: string) => {
    let totalDebit = 0;
    let totalCredit = 0;

    vouchers.forEach(voucher => {
      voucher.lines.forEach(line => {
        if (line.accountCode === accountCode) {
          totalDebit += line.debit;
          totalCredit += line.credit;
        }
      });
    });

    // Balance calculation depends on account class
    const firstDigit = parseInt(accountCode.charAt(0), 10);
    let balance: number;
    
    if (firstDigit === 1 || firstDigit >= 4) {
      // Assets and expenses: balance = debit - credit
      balance = totalDebit - totalCredit;
    } else {
      // Equity, liabilities, revenue: balance = credit - debit
      balance = totalCredit - totalDebit;
    }

    return { debit: totalDebit, credit: totalCredit, balance };
  }, [vouchers]);

  // Get account statement with running balance
  const getAccountStatement = useCallback((accountCode: string) => {
    const entries: { date: string; voucherNumber: number; description: string; debit: number; credit: number; balance: number }[] = [];
    
    const firstDigit = parseInt(accountCode.charAt(0), 10);
    const balanceIncreasesOnDebit = firstDigit === 1 || firstDigit >= 4;
    
    let runningBalance = 0;

    // Sort vouchers by date and number
    const sortedVouchers = [...vouchers].sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.voucherNumber - b.voucherNumber;
    });

    sortedVouchers.forEach(voucher => {
      voucher.lines.forEach(line => {
        if (line.accountCode === accountCode) {
          if (balanceIncreasesOnDebit) {
            runningBalance += line.debit - line.credit;
          } else {
            runningBalance += line.credit - line.debit;
          }

          entries.push({
            date: voucher.date,
            voucherNumber: voucher.voucherNumber,
            description: voucher.description,
            debit: line.debit,
            credit: line.credit,
            balance: runningBalance,
          });
        }
      });
    });

    return entries;
  }, [vouchers]);

  // Get general ledger (all accounts with activity)
  const getGeneralLedger = useCallback(() => {
    const accountBalances = new Map<string, { name: string; debit: number; credit: number }>();

    vouchers.forEach(voucher => {
      voucher.lines.forEach(line => {
        const existing = accountBalances.get(line.accountCode) || { name: line.accountName, debit: 0, credit: 0 };
        accountBalances.set(line.accountCode, {
          name: line.accountName,
          debit: existing.debit + line.debit,
          credit: existing.credit + line.credit,
        });
      });
    });

    const entries = Array.from(accountBalances.entries())
      .map(([code, data]) => {
        const firstDigit = parseInt(code.charAt(0), 10);
        const balanceIncreasesOnDebit = firstDigit === 1 || firstDigit >= 4;
        const balance = balanceIncreasesOnDebit
          ? data.debit - data.credit
          : data.credit - data.debit;

        return {
          accountCode: code,
          accountName: data.name,
          totalDebit: data.debit,
          totalCredit: data.credit,
          balance,
        };
      })
      .sort((a, b) => a.accountCode.localeCompare(b.accountCode));

    return entries;
  }, [vouchers]);

  // Get trial balance
  const getTrialBalance = useCallback(() => {
    const ledger = getGeneralLedger();
    
    const entries = ledger.map(entry => ({
      accountCode: entry.accountCode,
      accountName: entry.accountName,
      debit: entry.balance > 0 ? entry.balance : 0,
      credit: entry.balance < 0 ? Math.abs(entry.balance) : 0,
    }));

    const totalDebit = entries.reduce((sum, e) => sum + e.debit, 0);
    const totalCredit = entries.reduce((sum, e) => sum + e.credit, 0);

    return { entries, totalDebit, totalCredit };
  }, [getGeneralLedger]);

  // Year-end closing
  const performYearEndClosing = useCallback((fiscalYear: string) => {
    // Calculate income statement result
    const ledger = getGeneralLedger();
    
    let revenue = 0;
    let expenses = 0;

    ledger.forEach(entry => {
      const firstDigit = parseInt(entry.accountCode.charAt(0), 10);
      if (firstDigit === 3) {
        revenue += entry.balance;
      } else if (firstDigit >= 4 && firstDigit <= 8) {
        expenses += entry.balance;
      }
    });

    const netResult = revenue - expenses;

    // Create closing voucher entries
    const closingLines: VoucherLine[] = [];
    
    // Zero out all income and expense accounts (3-8xxx)
    ledger.forEach(entry => {
      const firstDigit = parseInt(entry.accountCode.charAt(0), 10);
      if (firstDigit >= 3 && firstDigit <= 8) {
        if (entry.balance !== 0) {
          // Reverse the balance
          closingLines.push({
            id: generateId(),
            accountCode: entry.accountCode,
            accountName: entry.accountName,
            debit: entry.balance < 0 ? Math.abs(entry.balance) : 0,
            credit: entry.balance > 0 ? entry.balance : 0,
          });
        }
      }
    });

    // Post result to 8999 and 2099
    if (netResult !== 0) {
      closingLines.push({
        id: generateId(),
        accountCode: '8999',
        accountName: 'Årets resultat',
        debit: netResult > 0 ? netResult : 0,
        credit: netResult < 0 ? Math.abs(netResult) : 0,
      });
      
      closingLines.push({
        id: generateId(),
        accountCode: '2099',
        accountName: 'Årets resultat',
        debit: netResult < 0 ? Math.abs(netResult) : 0,
        credit: netResult > 0 ? netResult : 0,
      });
    }

    if (closingLines.length === 0) {
      return { success: false, errors: ['No income or expense accounts to close'] };
    }

    // Create the closing voucher
    const closingVoucherResult = addVoucher({
      date: `${fiscalYear}-12-31`,
      description: `Bokslut ${fiscalYear} - Överföring av årets resultat`,
      lines: closingLines,
    });

    if (!closingVoucherResult.success) {
      return { success: false, errors: closingVoucherResult.errors };
    }

    const closing: YearEndClosing = {
      fiscalYear,
      incomeStatementResult: netResult,
      closingVoucherId: closingVoucherResult.voucher!.id,
      closedAt: new Date().toISOString(),
    };

    setYearEndClosings(prev => [...prev, closing]);
    
    return { success: true, closing };
  }, [getGeneralLedger, addVoucher]);

  return (
    <AccountingContext.Provider
      value={{
        vouchers,
        addVoucher,
        getVoucher,
        getNextVoucherNumber,
        periodizations,
        addPeriodization,
        yearEndClosings,
        performYearEndClosing,
        calculateAccountBalance,
        getAccountStatement,
        getGeneralLedger,
        getTrialBalance,
        setApiEndpoint,
        apiEndpoint,
      }}
    >
      {children}
    </AccountingContext.Provider>
  );
}

export function useAccounting() {
  const context = useContext(AccountingContext);
  if (context === undefined) {
    throw new Error('useAccounting must be used within an AccountingProvider');
  }
  return context;
}
