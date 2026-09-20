import { apiGet } from "../../../../lib/api-client";
import type { ProfitAndLossReport, ProfitAndLossRow } from "../types";

function normalizeRow(item: Record<string, unknown>): ProfitAndLossRow {
  return {
    account_id: (item.account_id as string | number) ?? "",
    account_code: (item.account_code as string | null) ?? null,
    account_name: (item.account_name as string | null) ?? null,
    amount: (item.amount as string | number | null) ?? null,
  };
}

function normalizeSection(value: unknown): ProfitAndLossRow[] {
  return Array.isArray(value)
    ? value.map((item) => normalizeRow((item ?? {}) as Record<string, unknown>))
    : [];
}

export async function getProfitAndLoss(from?: string, to?: string, token?: string): Promise<ProfitAndLossReport> {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  const qs = params.toString();
  const url = `/reports/profit-and-loss${qs ? `?${qs}` : ""}`;

  const rawData = await apiGet<Record<string, unknown>>(url, token);
  const data = (rawData.data ?? {}) as Record<string, unknown>;
  const meta = (rawData.meta ?? {}) as Record<string, unknown>;
  const totals = (rawData.totals ?? {}) as Record<string, unknown>;

  return {
    revenue: normalizeSection(data.revenue),
    expenses: normalizeSection(data.expenses),
    meta: {
      from: (meta.from as string | null) ?? null,
      to: (meta.to as string | null) ?? null,
    },
    totals: {
      total_revenue: (totals.total_revenue as string | number | null) ?? null,
      total_expense: (totals.total_expense as string | number | null) ?? null,
      net_profit: (totals.net_profit as string | number | null) ?? null,
    },
  };
}
