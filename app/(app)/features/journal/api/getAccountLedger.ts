import { apiGet } from "../../../../lib/api-client";
import type { AccountLedgerReport, AccountLedgerRow, AccountLedgerSummary } from "../types";

function normalizeAccount(value: unknown): AccountLedgerSummary | null {
  if (typeof value !== "object" || value === null) return null;
  const item = value as Record<string, unknown>;
  return {
    id: (item.id as string | number) ?? "",
    code: (item.code as string | null) ?? null,
    name: (item.name as string | null) ?? null,
    type: (item.type as string | null) ?? null,
    opening_balance: (item.opening_balance as string | number | null) ?? null,
  };
}

function normalizeRow(item: Record<string, unknown>): AccountLedgerRow {
  return {
    journal_entry_id: (item.journal_entry_id as string | number | null) ?? null,
    entry_date: (item.entry_date as string | null) ?? null,
    voucher_number: (item.voucher_number as string | null) ?? null,
    reference: (item.reference as string | null) ?? null,
    note: (item.note as string | null) ?? null,
    debit: (item.debit as string | number | null) ?? null,
    credit: (item.credit as string | number | null) ?? null,
    running_balance: (item.running_balance as string | number | null) ?? null,
  };
}

export async function getAccountLedger(
  accountId: string | number,
  page = 1,
  perPage = 50,
  token?: string
): Promise<AccountLedgerReport> {
  const query = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
  });

  const rawData = await apiGet<Record<string, unknown>>(`/accounts/${accountId}/ledger?${query.toString()}`, token);
  const rawRows = Array.isArray(rawData.data) ? rawData.data : [];
  const meta = (rawData.meta ?? {}) as Record<string, unknown>;

  return {
    account: normalizeAccount(rawData.account),
    rows: rawRows.map((item) => normalizeRow((item ?? {}) as Record<string, unknown>)),
    meta: {
      current_page: Number(meta.current_page) || 1,
      last_page: Number(meta.last_page) || 1,
      per_page: Number(meta.per_page) || perPage,
      total: Number(meta.total) || 0,
    },
  };
}
