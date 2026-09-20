import { apiGet } from "../../../../lib/api-client";
import type { TrialBalanceReport, TrialBalanceRow } from "../types";

function normalizeRow(item: Record<string, unknown>): TrialBalanceRow {
  return {
    account_id: (item.account_id as string | number) ?? "",
    account_code: (item.account_code as string | null) ?? null,
    account_name: (item.account_name as string | null) ?? null,
    account_type: (item.account_type as string | null) ?? null,
    debit_total: (item.debit_total as string | number | null) ?? null,
    credit_total: (item.credit_total as string | number | null) ?? null,
    balance: (item.balance as string | number | null) ?? null,
  };
}

export async function getTrialBalance(token?: string): Promise<TrialBalanceReport> {
  const rawData = await apiGet<Record<string, unknown>>("/reports/trial-balance", token);
  const rawRows = Array.isArray(rawData.data) ? rawData.data : [];
  const totals = (rawData.totals ?? {}) as Record<string, unknown>;

  return {
    rows: rawRows.map((item) => normalizeRow((item ?? {}) as Record<string, unknown>)),
    totals: {
      debit: (totals.debit as string | number | null) ?? null,
      credit: (totals.credit as string | number | null) ?? null,
    },
  };
}
