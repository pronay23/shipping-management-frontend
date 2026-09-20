import { apiGet } from "../../../../lib/api-client";
import type { JournalEntryListItem } from "../types";

function normalizeStatus(value: unknown): JournalEntryListItem["status"] {
  if (value === "draft" || value === "approved" || value === "voided") return value;
  return null;
}

function normalizeSourceType(value: unknown): JournalEntryListItem["source_type"] {
  if (value === "invoice" || value === "money_receipt") return value;
  return null;
}

export async function getJournalEntryList(token?: string): Promise<JournalEntryListItem[]> {
  const rawData = await apiGet<unknown>("/journal-entries", token);

  if (!Array.isArray(rawData)) {
    return [];
  }

  return rawData.map((item: Record<string, unknown>) => ({
    id: (item.id as string | number) ?? "",
    voucher_number: item.voucher_number as string | null,
    entry_date: item.entry_date as string | null,
    memo: item.memo as string | null,
    source_type: normalizeSourceType(item.source_type),
    source_id: item.source_id as string | number | null,
    total_debit: item.total_debit as string | number | null,
    total_credit: item.total_credit as string | number | null,
    status: normalizeStatus(item.status),
    line_count: item.line_count as number | null | undefined,
    created_at: item.created_at as string | null,
    updated_at: item.updated_at as string | null,
  }));
}
