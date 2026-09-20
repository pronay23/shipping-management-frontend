import { apiGet } from "../../../../lib/api-client";

export interface AgingRow {
  invoice_id?: string | number;
  ap_invoice_id?: string | number;
  invoice_number?: string | null;
  ap_invoice_number?: string | null;
  customer_name?: string | null;
  vendor_name?: string | null;
  invoice_date?: string | null;
  days_outstanding: number | null;
  bucket: string;
  outstanding: string | number | null;
}

export interface AgingReport {
  data: AgingRow[];
  meta: { as_of: string | null; count: number };
  totals: { total_outstanding: string | number | null };
}

export async function getArAging(asOf?: string, token?: string): Promise<AgingReport> {
  const params = new URLSearchParams();
  if (asOf) params.set("as_of", asOf);
  const qs = params.toString();
  const url = `/reports/ar-aging${qs ? `?${qs}` : ""}`;

  const raw = await apiGet<Record<string, unknown>>(url, token);
  const data = Array.isArray(raw.data) ? raw.data : [];
  const meta = (raw.meta ?? {}) as Record<string, unknown>;
  const totals = (raw.totals ?? {}) as Record<string, unknown>;

  return {
    data: data.map((item) => {
      const row = (item ?? {}) as Record<string, unknown>;
      return {
        invoice_id: row.invoice_id as string | number | undefined,
        invoice_number: (row.invoice_number as string | null) ?? null,
        customer_name: (row.customer_name as string | null) ?? null,
        invoice_date: (row.invoice_date as string | null) ?? null,
        days_outstanding: (row.days_outstanding as number | null) ?? null,
        bucket: (row.bucket as string) ?? "unknown",
        outstanding: (row.outstanding as string | number | null) ?? null,
      };
    }),
    meta: {
      as_of: (meta.as_of as string | null) ?? null,
      count: (meta.count as number) ?? 0,
    },
    totals: {
      total_outstanding: (totals.total_outstanding as string | number | null) ?? null,
    },
  };
}

export async function getApAging(asOf?: string, token?: string): Promise<AgingReport> {
  const params = new URLSearchParams();
  if (asOf) params.set("as_of", asOf);
  const qs = params.toString();
  const url = `/reports/ap-aging${qs ? `?${qs}` : ""}`;

  const raw = await apiGet<Record<string, unknown>>(url, token);
  const data = Array.isArray(raw.data) ? raw.data : [];
  const meta = (raw.meta ?? {}) as Record<string, unknown>;
  const totals = (raw.totals ?? {}) as Record<string, unknown>;

  return {
    data: data.map((item) => {
      const row = (item ?? {}) as Record<string, unknown>;
      return {
        ap_invoice_id: row.ap_invoice_id as string | number | undefined,
        ap_invoice_number: (row.ap_invoice_number as string | null) ?? null,
        vendor_name: (row.vendor_name as string | null) ?? null,
        invoice_date: (row.invoice_date as string | null) ?? null,
        days_outstanding: (row.days_outstanding as number | null) ?? null,
        bucket: (row.bucket as string) ?? "unknown",
        outstanding: (row.outstanding as string | number | null) ?? null,
      };
    }),
    meta: {
      as_of: (meta.as_of as string | null) ?? null,
      count: (meta.count as number) ?? 0,
    },
    totals: {
      total_outstanding: (totals.total_outstanding as string | number | null) ?? null,
    },
  };
}
