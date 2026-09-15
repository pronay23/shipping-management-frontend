export type JournalEntryStatus = "draft" | "approved" | "voided";

export type JournalSourceType = "invoice" | "money_receipt";

export interface JournalLineItem {
  id: string | number;
  account_id: string | number;
  account_code: string | null;
  account_name: string | null;
  account_type: string | null;
  invoice_id: string | number | null;
  invoice_number: string | null;
  reference: string | null;
  debit: string | number | null;
  credit: string | number | null;
  note: string | null;
}

export interface JournalEntryListItem {
  id: string | number;
  voucher_number: string | null;
  entry_date: string | null;
  memo: string | null;
  source_type: JournalSourceType | null;
  source_id: string | number | null;
  total_debit: string | number | null;
  total_credit: string | number | null;
  status: JournalEntryStatus | null;
  line_count?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface JournalEntryDetail {
  id: string | number;
  voucher_number: string | null;
  entry_date: string | null;
  memo: string | null;
  source_type: JournalSourceType | null;
  source_id: string | number | null;
  total_debit: string | number | null;
  total_credit: string | number | null;
  status: JournalEntryStatus | null;
  voided_at: string | null;
  voided_by: string | null;
  lines?: JournalLineItem[] | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface TrialBalanceTotals {
  debit: string | number | null;
  credit: string | number | null;
}

export interface TrialBalanceRow {
  account_id: string | number;
  account_code: string | null;
  account_name: string | null;
  account_type: string | null;
  debit_total: string | number | null;
  credit_total: string | number | null;
  balance: string | number | null;
}

export interface TrialBalanceReport {
  rows: TrialBalanceRow[];
  totals: TrialBalanceTotals;
}

export interface AccountLedgerSummary {
  id: string | number;
  code: string | null;
  name: string | null;
  type: string | null;
  opening_balance: string | number | null;
}

export interface AccountLedgerRow {
  journal_entry_id: string | number | null;
  entry_date: string | null;
  voucher_number: string | null;
  reference: string | null;
  note: string | null;
  debit: string | number | null;
  credit: string | number | null;
  running_balance: string | number | null;
}

export interface AccountLedgerMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface AccountLedgerReport {
  account: AccountLedgerSummary | null;
  rows: AccountLedgerRow[];
  meta: AccountLedgerMeta;
}

export interface ProfitAndLossRow {
  account_id: string | number;
  account_code: string | null;
  account_name: string | null;
  amount: string | number | null;
}

export interface ProfitAndLossMeta {
  from: string | null;
  to: string | null;
}

export interface ProfitAndLossTotals {
  total_revenue: string | number | null;
  total_expense: string | number | null;
  net_profit: string | number | null;
}

export interface ProfitAndLossReport {
  revenue: ProfitAndLossRow[];
  expenses: ProfitAndLossRow[];
  meta: ProfitAndLossMeta;
  totals: ProfitAndLossTotals;
}

export const JOURNAL_STATUS_META: Record<JournalEntryStatus, { label: string; className: string }> = {
  draft: {
    label: "Draft",
    className: "bg-amber-100 text-amber-800",
  },
  approved: {
    label: "Approved",
    className: "bg-emerald-100 text-emerald-800",
  },
  voided: {
    label: "Voided",
    className: "bg-slate-200 text-slate-600",
  },
};