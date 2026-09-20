import { apiGet } from "../../../../lib/api-client";

export interface BalanceSheetAccount {
  account_id: string | number;
  account_code: string | null;
  account_name: string | null;
  balance: string | number | null;
}

export interface BalanceSheetTotals {
  total_assets: string | number | null;
  total_liabilities: string | number | null;
  total_equity: string | number | null;
  net_profit: string | number | null;
  total_liabilities_equity: string | number | null;
}

export interface BalanceSheetReport {
  assets: BalanceSheetAccount[];
  liabilities: BalanceSheetAccount[];
  equity: BalanceSheetAccount[];
  meta: { as_of: string | null };
  totals: BalanceSheetTotals;
}

export async function getBalanceSheet(asOf?: string, token?: string): Promise<BalanceSheetReport> {
  const params = new URLSearchParams();
  if (asOf) params.set("as_of", asOf);
  const qs = params.toString();
  const url = `/reports/balance-sheet${qs ? `?${qs}` : ""}`;

  const raw = await apiGet<Record<string, unknown>>(url, token);
  const data = (raw.data ?? {}) as Record<string, unknown>;
  const meta = (raw.meta ?? {}) as Record<string, unknown>;
  const totals = (raw.totals ?? {}) as Record<string, unknown>;

  function normalizeAccounts(value: unknown): BalanceSheetAccount[] {
    return Array.isArray(value)
      ? value.map((item) => {
          const row = (item ?? {}) as Record<string, unknown>;
          return {
            account_id: (row.account_id as string | number) ?? "",
            account_code: (row.account_code as string | null) ?? null,
            account_name: (row.account_name as string | null) ?? null,
            balance: (row.balance as string | number | null) ?? null,
          };
        })
      : [];
  }

  return {
    assets: normalizeAccounts(data.assets),
    liabilities: normalizeAccounts(data.liabilities),
    equity: normalizeAccounts(data.equity),
    meta: { as_of: (meta.as_of as string | null) ?? null },
    totals: {
      total_assets: (totals.total_assets as string | number | null) ?? null,
      total_liabilities: (totals.total_liabilities as string | number | null) ?? null,
      total_equity: (totals.total_equity as string | number | null) ?? null,
      net_profit: (totals.net_profit as string | number | null) ?? null,
      total_liabilities_equity: (totals.total_liabilities_equity as string | number | null) ?? null,
    },
  };
}
