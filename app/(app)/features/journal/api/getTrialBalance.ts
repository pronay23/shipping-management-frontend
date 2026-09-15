import type { TrialBalanceReport, TrialBalanceRow } from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000/api";

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

export async function getTrialBalance(): Promise<TrialBalanceReport> {
  const response = await fetch(`${API_BASE_URL}/reports/trial-balance`, {
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Failed to load trial balance (${response.status}): ${message || response.statusText}`);
  }

  const rawData = (await response.json()) as Record<string, unknown>;
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
